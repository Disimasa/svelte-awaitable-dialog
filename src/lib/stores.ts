import { writable } from 'svelte/store'
import type {SvelteComponent} from 'svelte'

export class Dialog {
  component: SvelteComponent
  data: object
  resolve: (value: any) => void
  reject: (reason?: any) => void
  promise
  constructor(component: SvelteComponent, data: object) {
    this.component = component
    this.data = data
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}

export const dialogs = writable<Dialog[]>([])