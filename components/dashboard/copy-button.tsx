"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setFailed(true);
      window.setTimeout(() => setFailed(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#EAE6DE] bg-white text-[#656474] transition duration-200 hover:border-[#D3CCFF] hover:bg-[#E5E2FF] hover:text-[#6252BD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6252BD] focus-visible:ring-offset-2 active:scale-95"
      aria-label={failed ? `Failed to copy ${label}` : copied ? `${label} copied` : `Copy ${label}`}
      title={failed ? "Couldn't copy" : copied ? "Copied!" : `Copy ${label}`}
    >
      {copied ? (
        <Check size={15} className="text-[#287B56]" />
      ) : (
        <Copy size={15} />
      )}
    </button>
  );
}