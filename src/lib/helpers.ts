/**
 * Try to infer the current dialog id from DOM focus.
 *
 * Walks up from document.activeElement to the nearest ancestor with
 * [data-dialog-id], returning that value if present. Returns undefined
 * on the server or when no active element is associated with a dialog.
 */
export function getActiveDialogIdFromDOM(): string | undefined {
  if (typeof document === 'undefined') return undefined
  
  const active = (document.activeElement as HTMLElement | null)
  if (!active) return undefined
  
  const container = active.closest('[data-dialog-id]') as HTMLElement | null
  return container?.getAttribute('data-dialog-id') ?? undefined
}