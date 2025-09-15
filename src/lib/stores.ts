import { writable } from 'svelte/store'
import type { ComponentType, SvelteComponent } from 'svelte'

export interface ArbitraryObject {
  [key: string]: any
}

export interface DialogData extends ArbitraryObject {
  dialogId: string
}

export class Dialog {
  component: ComponentType
  data: DialogData
  resolve!: (data: ArbitraryObject) => void
  reject!: (data: ArbitraryObject) => void
  promise: Promise<ArbitraryObject>
  onCancel?: () => void
  finallyCallback?: () => void
  onClosed?: () => void
  thenCallbacks?: ((data: ArbitraryObject) => void)[]
  catchCallbacks?: ((data: ArbitraryObject) => void)[]
  constructor(component: ComponentType, data: DialogData) {
    this.component = component
    this.data = data
    this.promise = new Promise<ArbitraryObject>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export const  dialogs = writable<Dialog[]>([])