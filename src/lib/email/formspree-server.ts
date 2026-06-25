import { getFormspreeEndpoint } from "@/lib/formspree";
import type { FormspreeForm } from "@/lib/formspree";

export async function submitFormspreeServer(
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

  try {
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
  } catch {
    return {
      ok: false,
      message:
        "Could not reach the form server. Check your connection and try again.",
    };
  }
}
