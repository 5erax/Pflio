export type ContactPayload = { name: string; email: string; message: string; website?: string };
export function validateContact(value: unknown): value is ContactPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Record<string, unknown>;
  return typeof payload.name === 'string' && payload.name.trim().length >= 2 && payload.name.length <= 100
    && typeof payload.email === 'string' && payload.email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
    && typeof payload.message === 'string' && payload.message.trim().length >= 10 && payload.message.length <= 5000
    && (payload.website === undefined || typeof payload.website === 'string');
}
