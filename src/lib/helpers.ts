import type { ComponentProps, ComponentType } from 'svelte'
import { Dialog, dialogs } from './stores'
import { get } from 'svelte/store'
import type { SvelteComponent } from 'svelte'

export async function openDialog<T>(component: ComponentType<T>, data: Partial<ComponentProps<T>> = {} as Partial<ComponentProps<T>>) {
  const dialog = new Dialog(component, data)
  dialogs.set([...get(dialogs), dialog])

  return get(dialogs).slice(-1)[0].promise
}

export function resolveDialog(data: object = {}) {
  if (get(dialogs).length > 0) {
    get(dialogs).slice(-1)[0].resolve(data)
    closeDialog()
  }
}

export function rejectDialog(data: object = {}) {
  if (get(dialogs).length > 0) {
    get(dialogs).slice(-1)[0].reject(data)
    closeDialog()
  }
}

export function closeDialog() {
  dialogs.set(get(dialogs).slice(0, -1))
}