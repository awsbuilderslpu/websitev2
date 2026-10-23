"use client";

import { useState, type FormEvent } from "react";
import {
  Building2,
  CheckCircle2,
  Fingerprint,
  LoaderCircle,
  Save,
} from "lucide-react";

type WorkspaceEditorProps = {
  workspaceName: string | null;
  workspaceUid: string | null;
};

type UpdateResponse = {
  success?: boolean;
  error?: string;
  message?: string;
  workspace_name?: string | null;
  workspace_uid?: string | null;
};

export function WorkspaceEditor({
  workspaceName: initialWorkspaceName,
  workspaceUid: initialWorkspaceUid,
}: WorkspaceEditorProps) {
  const [workspaceName, setWorkspaceName] = useState(
    initialWorkspaceName ?? "",
  );
  const [workspaceUid, setWorkspaceUid] = useState(
    initialWorkspaceUid ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/v1/profile/workspace", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          workspace_name: workspaceName,
          workspace_uid: workspaceUid,
        }),
      });

      const result: UpdateResponse = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !result.success) {
        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please sign in again.",
          );
        }

        if (response.status === 403) {
          throw new Error(
            "You aren't authorized to update this profile.",
          );
        }

        if (result.error === "invalid_fields") {
          throw new Error(
            result.message || "Please check the workspace details.",
          );
        }

        throw new Error(
          "Couldn't save your workspace details. Please try again.",
        );
      }

      setWorkspaceName(result.workspace_name ?? "");
      setWorkspaceUid(result.workspace_uid ?? "");
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const fieldClassName =
    "mt-2 w-full rounded-xl border border-[#EAE7E0] bg-white px-4 py-3 text-sm text-[#242333] outline-none transition placeholder:text-[#AAA7B4] focus:border-[#5257C8] focus:ring-2 focus:ring-[#5257C8]/10 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <section className="overflow-hidden rounded-[24px] border border-[#EAE7E0] bg-white">
      <div className="border-b border-[#EAE7E0] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFEBFF] text-[#5257C8]">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight">
              Workspace details
            </h2>
            <p className="mt-1 text-sm text-[#777584]">
              Update your workspace name and UID whenever you need to.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        {success && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-[#C9E8D3] bg-[#EFF9F2] px-4 py-3 text-sm text-[#246C42]"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Workspace details updated successfully.
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-[#F1CCCC] bg-[#FFF1F1] px-4 py-3 text-sm leading-6 text-[#A83232]"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="workspace-name"
            className="flex items-center gap-2 text-sm font-semibold text-[#242333]"
          >
            <Building2 className="h-4 w-4 text-[#898795]" />
            Workspace name
          </label>

          <input
            id="workspace-name"
            name="workspace_name"
            type="text"
            autoComplete="organization"
            maxLength={120}
            value={workspaceName}
            onChange={(event) => {
              setWorkspaceName(event.target.value);
              setSuccess(false);
              setError(null);
            }}
            placeholder="Enter your workspace name"
            disabled={isSaving}
            className={fieldClassName}
          />

          <p className="mt-1.5 text-xs text-[#898795]">
            Maximum 120 characters. Leave empty to clear this field.
          </p>
        </div>

        <div>
          <label
            htmlFor="workspace-uid"
            className="flex items-center gap-2 text-sm font-semibold text-[#242333]"
          >
            <Fingerprint className="h-4 w-4 text-[#898795]" />
            Workspace UID
          </label>

          <input
            id="workspace-uid"
            name="workspace_uid"
            type="text"
            autoComplete="off"
            maxLength={80}
            value={workspaceUid}
            onChange={(event) => {
              setWorkspaceUid(event.target.value);
              setSuccess(false);
              setError(null);
            }}
            placeholder="Enter your workspace UID"
            disabled={isSaving}
            className={fieldClassName}
          />

          <p className="mt-1.5 text-xs text-[#898795]">
            Maximum 80 characters. Leave empty to clear this field.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#EAE7E0] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#898795]">
            Your changes are saved to your profile when you submit this form.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#5257C8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4448B6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}