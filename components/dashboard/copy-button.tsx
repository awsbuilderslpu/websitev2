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

  async function handleCopy() {
    await navigator.clipboard.writeText(value);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex h-8 w-8 items-center justify-center border border-white/10 text-[#596273] transition-colors hover:border-[#A855F7] hover:text-white"
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <Check size={13} />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}