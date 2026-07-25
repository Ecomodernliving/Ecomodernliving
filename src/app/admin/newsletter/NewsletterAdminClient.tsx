"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type {
  NewsletterIssue,
  NewsletterIssueStatus,
  NewsletterSection,
} from "@/lib/newsletter/issues";

type SectionKey =
  | "ecoProductPicks"
  | "aiSmartHomeTrends"
  | "energySavingTips"
  | "passiveHouseEducation";

const SECTION_META: { key: SectionKey; label: string }[] = [
  { key: "ecoProductPicks", label: "Eco product picks" },
  { key: "aiSmartHomeTrends", label: "AI smart home trends" },
  { key: "energySavingTips", label: "Energy savings tips" },
  { key: "passiveHouseEducation", label: "Passive house education" },
];

const emptySection = (): NewsletterSection => ({
  title: "",
  body: "",
  linkLabel: "",
  linkHref: "",
});

function statusLabel(status: NewsletterIssueStatus): string {
  switch (status) {
    case "pending_approval":
      return "Pending approval";
    case "approved":
      return "Approved";
    case "sent":
      return "Sent";
    default:
      return "Draft";
  }
}

export function NewsletterAdminClient() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("issue");

  const [issues, setIssues] = useState<NewsletterIssue[]>([]);
  const [airtable, setAirtable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [composing, setComposing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [sections, setSections] = useState<Record<SectionKey, NewsletterSection>>({
    ecoProductPicks: emptySection(),
    aiSmartHomeTrends: emptySection(),
    energySavingTips: emptySection(),
    passiveHouseEducation: emptySection(),
  });

  const loadIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/newsletter");
      const raw = await res.text();
      const data = (
        raw
          ? (JSON.parse(raw) as {
              issues?: NewsletterIssue[];
              airtable?: boolean;
              error?: string;
            })
          : {}
      ) as {
        issues?: NewsletterIssue[];
        airtable?: boolean;
        error?: string;
      };
      setAirtable(Boolean(data.airtable));
      if (!res.ok) throw new Error(data.error || "Failed to load issues");
      setIssues(data.issues ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadIssues();
  }, [loadIssues]);

  const highlighted = useMemo(
    () => issues.find((i) => i.id === highlightId) ?? null,
    [issues, highlightId]
  );

  function updateSection(
    key: SectionKey,
    field: keyof NewsletterSection,
    value: string
  ) {
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  async function composeFromSite(force = false) {
    setComposing(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "compose", force }),
      });
      const data = (await res.json()) as {
        error?: string;
        created?: boolean;
        reason?: string;
        issue?: NewsletterIssue;
      };
      if (!res.ok) throw new Error(data.error || "Compose failed");
      setMessage(
        force
          ? "Draft regenerated with the shorter layout — click Preview."
          : data.created
            ? `Draft created${data.issue ? `: ${data.issue.subject}` : ""}. Check email to approve.`
            : data.reason || "Draft already exists for this week"
      );
      await loadIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compose failed");
    } finally {
      setComposing(false);
    }
  }

  async function createIssue() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          subject,
          previewText,
          scheduledFor: scheduledFor
            ? new Date(scheduledFor).toISOString()
            : null,
          ...sections,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not save issue");
      setMessage("Manual draft saved — pending your approval.");
      setSubject("");
      setPreviewText("");
      setScheduledFor("");
      setSections({
        ecoProductPicks: emptySection(),
        aiSmartHomeTrends: emptySection(),
        energySavingTips: emptySection(),
        passiveHouseEducation: emptySection(),
      });
      await loadIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function runAction(
    id: string,
    action: "approve" | "send",
    extra?: Record<string, unknown>
  ) {
    setBusyId(id);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id, ...extra }),
      });
      const data = (await res.json()) as {
        error?: string;
        publishError?: string;
        sent?: number;
        attempted?: number;
        failed?: number;
        send?: { sent: number; attempted: number; failed: number };
      };
      if (!res.ok) throw new Error(data.error || "Action failed");
      if (data.publishError) {
        setMessage(`Approved, but publish failed: ${data.publishError}`);
      } else if (action === "approve" && extra?.publishNow) {
        const s = data.send;
        setMessage(
          s
            ? `Approved & sent to ${s.sent}/${s.attempted}`
            : "Approved and published"
        );
      } else if (action === "approve") {
        setMessage("Approved — Monday cron will send (or click Send now).");
      } else {
        setMessage(
          `Sent to ${data.sent ?? 0}/${data.attempted ?? 0}` +
            (data.failed ? ` (${data.failed} failed)` : "")
        );
      }
      await loadIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-10">
      <div className="rounded-xl border border-sage-200 bg-cream-50/80 px-4 py-3 text-sm text-sage-700">
        Storage:{" "}
        <strong className="text-forest-900">
          {airtable ? "Airtable" : "Local / Neon fallback"}
        </strong>
        . Saturday cron auto-composes a draft; Monday cron only sends{" "}
        <strong className="text-forest-900">approved</strong> issues.
      </div>

      {(message || error) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-forest-200 bg-forest-50 text-forest-900"
          }`}
        >
          {error || message}
        </div>
      )}

      {highlighted && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Opened from preview email: <strong>{highlighted.subject}</strong> (
          {statusLabel(highlighted.status)})
        </div>
      )}

      <section className="rounded-2xl border border-sage-200 bg-white p-5 sm:p-7">
        <h2 className="font-display text-xl font-bold text-forest-950">
          Auto-draft from site
        </h2>
        <p className="mt-1 text-sm text-sage-600">
          Pulls marketplace picks, Passive House FAQ, energy tips, and smart-home
          products. Saves to Airtable as pending approval and emails you a preview
          link.
        </p>
        <button
          type="button"
          disabled={composing}
          onClick={() => void composeFromSite()}
          className="mt-4 rounded-lg bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {composing ? "Composing…" : "Generate this week’s draft"}
        </button>
        <button
          type="button"
          disabled={composing}
          onClick={() => void composeFromSite(true)}
          className="mt-4 ml-3 rounded-lg border border-forest-300 bg-white px-4 py-2.5 text-sm font-semibold text-forest-900 disabled:opacity-50"
        >
          Regenerate (new design)
        </button>
      </section>

      <section className="rounded-2xl border border-sage-200 bg-white p-5 sm:p-7">
        <h2 className="font-display text-xl font-bold text-forest-950">
          Manual compose
        </h2>
        <p className="mt-1 text-sm text-sage-600">
          Optional override. Still requires Approve before send.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-forest-900">Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 text-sm"
              placeholder="EcoModern Living — Week of July 28"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-forest-900">
              Preview text (optional)
            </span>
            <input
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 text-sm"
              placeholder="Inbox preview line"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-forest-900">
              Schedule for (optional)
            </span>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="mt-1 w-full rounded-lg border border-sage-200 px-3 py-2 text-sm"
            />
          </label>

          {SECTION_META.map(({ key, label }) => (
            <fieldset
              key={key}
              className="rounded-xl border border-sage-100 bg-cream-50/60 p-4"
            >
              <legend className="px-1 text-sm font-semibold text-forest-900">
                {label}
              </legend>
              <div className="mt-2 space-y-3">
                <input
                  value={sections[key].title}
                  onChange={(e) => updateSection(key, "title", e.target.value)}
                  className="w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm"
                  placeholder="Section headline"
                />
                <textarea
                  value={sections[key].body}
                  onChange={(e) => updateSection(key, "body", e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm"
                  placeholder="Paragraphs… use blank lines between them"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={sections[key].linkLabel ?? ""}
                    onChange={(e) =>
                      updateSection(key, "linkLabel", e.target.value)
                    }
                    className="w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm"
                    placeholder="Link label (optional)"
                  />
                  <input
                    value={sections[key].linkHref ?? ""}
                    onChange={(e) =>
                      updateSection(key, "linkHref", e.target.value)
                    }
                    className="w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm"
                    placeholder="https://…"
                  />
                </div>
              </div>
            </fieldset>
          ))}

          <button
            type="button"
            disabled={saving || !subject.trim()}
            onClick={() => void createIssue()}
            className="rounded-lg border border-forest-300 bg-white px-4 py-2.5 text-sm font-semibold text-forest-900 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save manual draft"}
          </button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-forest-950">
          Recent issues
        </h2>
        {loading ? (
          <p className="mt-3 text-sm text-sage-600">Loading…</p>
        ) : issues.length === 0 ? (
          <p className="mt-3 text-sm text-sage-600">No issues yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {issues.map((issue) => (
              <li
                key={issue.id}
                id={`issue-${issue.id}`}
                className={`flex flex-col gap-3 rounded-xl border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                  highlightId === issue.id
                    ? "border-amber-300 ring-2 ring-amber-100"
                    : "border-sage-200"
                }`}
              >
                <div>
                  <p className="font-medium text-forest-950">{issue.subject}</p>
                  <p className="mt-0.5 text-xs text-sage-500">
                    {statusLabel(issue.status)}
                    {issue.weekKey ? ` · ${issue.weekKey}` : ""}
                    {issue.sentAt
                      ? ` · sent ${new Date(issue.sentAt).toLocaleString()}`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/api/admin/newsletter/preview?id=${encodeURIComponent(issue.id)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-sage-300 px-3 py-1.5 text-sm font-medium text-forest-900"
                  >
                    Preview
                  </a>
                  {(issue.status === "pending_approval" ||
                    issue.status === "draft") && (
                    <>
                      <button
                        type="button"
                        disabled={busyId === issue.id}
                        onClick={() => void runAction(issue.id, "approve")}
                        className="rounded-lg border border-sage-300 px-3 py-1.5 text-sm font-medium text-forest-900 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busyId === issue.id}
                        onClick={() =>
                          void runAction(issue.id, "approve", {
                            publishNow: true,
                          })
                        }
                        className="rounded-lg bg-forest-800 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                      >
                        Approve &amp; send
                      </button>
                    </>
                  )}
                  {issue.status === "approved" && (
                    <button
                      type="button"
                      disabled={busyId === issue.id}
                      onClick={() => void runAction(issue.id, "send")}
                      className="rounded-lg border border-sage-300 px-3 py-1.5 text-sm font-medium text-forest-900 disabled:opacity-50"
                    >
                      {busyId === issue.id ? "Sending…" : "Send now"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
