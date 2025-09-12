import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte'
import { Dialog, dialogs } from './stores'
import type { ArbitraryObject, DialogData } from './stores'
import { getActiveDialogIdFromDOM } from './helpers'

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
export async function openDialog<T extends SvelteComponent>(component: ComponentType<T>, data: Partial<ComponentProps<T>> = {} as Partial<ComponentProps<T>>) {
  const dialogData: DialogData = { dialogId: crypto.randomUUID(), ...(data as object) } as DialogData
  const dialog = new Dialog(component, dialogData)
  dialogs.update(current => [...current, dialog])
  
  return dialog.promise
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
export function resolveDialog(data: ArbitraryObject = {}) {
  const activeId = getActiveDialogIdFromDOM()
  dialogs.update(current => {
    const index = activeId ? current.findIndex(d => d.data.dialogId === activeId) : current.length - 1
    if (index >= 0) {
      const target = current[index]
      target.resolve(data)
      return [...current.slice(0, index), ...current.slice(index + 1)]
    }
    return current
  })
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
export function rejectDialog(data: ArbitraryObject = {}) {
  const activeId = getActiveDialogIdFromDOM()
  dialogs.update(current => {
    const index = activeId ? current.findIndex(d => d.data.dialogId === activeId) : current.length - 1
    if (index >= 0) {
      const target = current[index]
      target.reject(data)
      return [...current.slice(0, index), ...current.slice(index + 1)]
    }
    return current
  })
}

/**
 * Close the currently active dialog without resolving or rejecting its promise.
 *
 * The function attempts to close the dialog that currently holds DOM focus
 * (using data-dialog-id). If no focused dialog is found, it closes the
 * top-most dialog in the stack. No-ops when the stack is empty.
 */
export function closeDialog() {
  const activeId = getActiveDialogIdFromDOM()
  dialogs.update(current => {
    if (activeId) {
      return current.filter(d => d.data.dialogId !== activeId)
    }
    return current.length > 0 ? current.slice(0, -1) : current
  })
}

/**
 * Resolve a dialog by its id.
 *
 * @param dialogId - Target dialog identifier
 * @param data - Arbitrary payload to resolve the dialog with
 */
export function resolveDialogById(dialogId: string, data: ArbitraryObject = {}) {
  dialogs.update(current => {
    const index = current.findIndex(dialog => dialog?.data?.dialogId === dialogId)
    if (index >= 0) {
      const target = current[index]
      target.resolve(data)
      return [...current.slice(0, index), ...current.slice(index + 1)]
    }
    return current
  })
}

/**
 * Reject a dialog by its id.
 *
 * @param dialogId - Target dialog identifier
 * @param data - Arbitrary payload to reject the dialog with
 */
export function rejectDialogById(dialogId: string, data: ArbitraryObject = {}) {
  dialogs.update(current => {
    const index = current.findIndex(dialog => dialog?.data?.dialogId === dialogId)
    if (index >= 0) {
      const target = current[index]
      target.reject(data)
      return [...current.slice(0, index), ...current.slice(index + 1)]
    }
    return current
  })
}

/**
 * Close a dialog by its id without resolving or rejecting its promise.
 *
 * @param dialogId - Target dialog identifier
 */
export function closeDialogById(dialogId: string) {
  dialogs.update(current => current.filter(dialog => dialog?.data?.dialogId !== dialogId))
}


