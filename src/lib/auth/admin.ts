export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "ecomodernliving@gmail.com";

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
}
