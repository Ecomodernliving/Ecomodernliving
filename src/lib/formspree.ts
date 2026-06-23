import { siteConfig } from "@/config/site";

export type FormspreeForm = keyof typeof siteConfig.formspree;

export function getFormspreeEndpoint(form: FormspreeForm): string | null {
  const id = siteConfig.formspree[form];
  if (!id) return null;
  return `https://formspree.io/f/${id}`;
}

export async function submitToFormspree(
  form: FormspreeForm,
  data: Record<string, string>
): Promise<{ ok: true } | { ok: false; message: string }> {
  const endpoint = getFormspreeEndpoint(form);
  if (!endpoint) {
    return {
      ok: false,
      message:
        "Form is not configured yet. Add your Formspree ID to .env.local (see .env.example).",
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    return {
      ok: false,
      message: body?.error ?? "Something went wrong. Please try again.",
    };
  }

  return { ok: true };
}
