import { writable } from 'svelte/store'
import type { ComponentType, SvelteComponent } from 'svelte'

export interface ArbitraryObject {
  [key: string]: any
}

export class Dialog {
  component: ComponentType
  data: object
  resolve: (data: ArbitraryObject) => void
  reject: (data: ArbitraryObject) => void
  promise: Promise<ArbitraryObject>
  constructor(component: ComponentType, data: object) {
    this.component = component
    this.data = data
    this.promise = new Promise<ArbitraryObject>((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export const  dialogs = writable<Dialog[]>([])