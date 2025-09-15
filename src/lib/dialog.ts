import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte'
import { Dialog, dialogs } from './stores'
import type { ArbitraryObject, DialogData } from './stores'
import { getActiveDialogIdFromDOM } from './helpers'

// Helpers to reduce duplication
function removeTargetDialog(targetDialogId?: string): Dialog | undefined {
  let target: Dialog | undefined
  dialogs.update(current => {
    const index = targetDialogId
      ? current.findIndex(d => d.data.dialogId === targetDialogId)
      : current.length - 1
    if (index < 0) return current
    target = current[index]
    return [...current.slice(0, index), ...current.slice(index + 1)]
  })
  return target
}

async function runCallbacksSequentially(callbacks: (((data: ArbitraryObject) => unknown) | ((data: ArbitraryObject) => Promise<unknown>))[] | undefined, data: ArbitraryObject) {
  if (!callbacks || callbacks.length === 0) return
  for (const cb of callbacks) {
    try { await cb(data) } catch (err) { console.error(err) }
  }
}

async function runFinallyOnce(dialog: Dialog) {
  const cb = dialog.finallyCallback
  if (!cb) return
  dialog.finallyCallback = undefined
  try { await cb() } catch (err) { console.error(err) }
}

export class DialogPromise<T> {
  private inner: Promise<T>
  private dialog: Dialog
  constructor(inner: Promise<T>, dialog: Dialog) {
    this.inner = inner
    this.dialog = dialog
  }

  // Overload for user subscription style: .then(cb)
  then(cb: (res: any) => void): DialogPromise<T>
  // Overload for PromiseLike<T> compatibility (used by await/Promise)
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseLike<TResult1 | TResult2>
  // Implementation
  then(onfulfilledOrCb?: any, onrejected?: any): any {
    const isAwaitStyle = typeof onfulfilledOrCb === 'function' && typeof onrejected === 'function'
    if (isAwaitStyle) {
      // Delegate to inner promise; do not register user callbacks
      return this.inner.then(onfulfilledOrCb, onrejected)
    }
    const cb = onfulfilledOrCb as ((res: any) => void) | undefined
    if (cb) {
      if (!this.dialog.thenCallbacks) this.dialog.thenCallbacks = []
      this.dialog.thenCallbacks.push(cb)
    }
    return new DialogPromise<T>(this.inner, this.dialog)
  }

  catch(cb: (reason: any) => void): DialogPromise<T> {
    if (!this.dialog.catchCallbacks) this.dialog.catchCallbacks = []
      this.dialog.catchCallbacks.push(cb)
    return new DialogPromise<T>(this.inner, this.dialog)
  }

  finally(onfinally?: (() => void) | undefined | null): DialogPromise<T> {
    if (onfinally) {
      // Store only on dialog; lifecycle functions will call it exactly once
      this.dialog.finallyCallback = onfinally
    }
    return new DialogPromise<T>(this.inner, this.dialog)
  }

  onClose(cb: () => void): DialogPromise<T> {
    this.dialog.onCancel = cb
    return new DialogPromise<T>(this.inner, this.dialog)
  }
}

/**
 * Open a dialog component and return a promise that resolves/rejects
 * when the dialog is resolved/rejected.
 *
 * The dialog instance is pushed onto the dialogs stack. The promise is stable
 * and returned directly from the created dialog, so it is not affected by
 * future changes to the store.
 *
 * @typeParam T - Svelte component type of the dialog content
 * @param component - The Svelte component to render as a dialog
 * @param data - Optional props to pass to the dialog component; merged with an internal dialogId
 * @returns Promise with arbitrary resolved data from the dialog
 */
export function openDialog<T extends SvelteComponent>(component: ComponentType<T>, data: Partial<ComponentProps<T>> = {} as Partial<ComponentProps<T>>): DialogPromise<unknown> {
  const dialogData: DialogData = { dialogId: crypto.randomUUID(), ...(data as object) } as DialogData
  const dialog = new Dialog(component, dialogData)
  dialogs.update(current => [...current, dialog])

  return new DialogPromise(dialog.promise, dialog)
}

/**
 * Resolve the currently active dialog.
 *
 * The function attempts to resolve the dialog that currently holds DOM focus
 * (using data-dialog-id). If no focused dialog is found, it resolves the
 * top-most dialog in the stack. No-ops when the stack is empty.
 *
 * @param data - Arbitrary payload to resolve the dialog with
 */
export async function resolveDialog(data: ArbitraryObject = {}) {
  const activeId = getActiveDialogIdFromDOM()
  const target = removeTargetDialog(activeId)
  if (!target) return
  await runCallbacksSequentially(target.thenCallbacks, data)
  await runFinallyOnce(target)
  try { target.resolve(data) } catch {}
}

/**
 * Reject the currently active dialog.
 *
 * The function attempts to reject the dialog that currently holds DOM focus
 * (using data-dialog-id). If no focused dialog is found, it rejects the
 * top-most dialog in the stack. No-ops when the stack is empty.
 *
 * @param data - Arbitrary payload to reject the dialog with
 */
export async function rejectDialog(data: ArbitraryObject = {}) {
  const activeId = getActiveDialogIdFromDOM()
  const target = removeTargetDialog(activeId)
  if (!target) return
  await runCallbacksSequentially(target.catchCallbacks, data)
  await runFinallyOnce(target)
  try { target.resolve(data) } catch {}
}

/**
 * Close the currently active dialog without resolving or rejecting its promise.
 *
 * The function attempts to close the dialog that currently holds DOM focus
 * (using data-dialog-id). If no focused dialog is found, it closes the
 * top-most dialog in the stack. No-ops when the stack is empty.
 */
export async function closeDialog() {
  const activeId = getActiveDialogIdFromDOM()
  const target = removeTargetDialog(activeId)
  if (!target) return
  try { if (target.onCancel) await target.onCancel() } catch {}
  await runFinallyOnce(target)
  try { target.resolve(undefined as unknown as ArbitraryObject) } catch {}
}

/**
 * Resolve a dialog by its id.
 *
 * @param dialogId - Target dialog identifier
 * @param data - Arbitrary payload to resolve the dialog with
 */
export async function resolveDialogById(dialogId: string, data: ArbitraryObject = {}) {
  const target = removeTargetDialog(dialogId)
  if (!target) return
  await runCallbacksSequentially(target.thenCallbacks, data)
  await runFinallyOnce(target)
  try { target.resolve(data) } catch {}
}

/**
 * Reject a dialog by its id.
 *
 * @param dialogId - Target dialog identifier
 * @param data - Arbitrary payload to reject the dialog with
 */
export async function rejectDialogById(dialogId: string, data: ArbitraryObject = {}) {
  const target = removeTargetDialog(dialogId)
  if (!target) return
  await runCallbacksSequentially(target.catchCallbacks, data)
  await runFinallyOnce(target)
  try { target.resolve(data) } catch {}
}

/**
 * Close a dialog by its id without resolving or rejecting its promise.
 *
 * @param dialogId - Target dialog identifier
 */
export async function closeDialogById(dialogId: string) {
  const target = removeTargetDialog(dialogId)
  if (!target) return
  try { if (target.onCancel) await target.onCancel() } catch {}
  await runFinallyOnce(target)
  try { target.resolve(undefined as unknown as ArbitraryObject) } catch {}
}


