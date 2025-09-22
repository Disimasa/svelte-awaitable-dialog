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

export function randomUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
}