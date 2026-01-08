"use client";

import { useEffect, useMemo, useState } from "react";

function detectIsIOS() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent || "";
  return /iPad|iPhone|iPod/.test(ua);
}

function detectStandalone() {
  if (typeof window === "undefined") return false;
  // iOS Safari (legacy)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav: any = window.navigator;
  const iosStandalone = Boolean(nav.standalone);
  const displayModeStandalone = window.matchMedia?.("(display-mode: standalone)")
    ?.matches;
  return iosStandalone || Boolean(displayModeStandalone);
}

export function HomeScreenLink() {
  const isIOS = useMemo(detectIsIOS, []);
  const [isStandalone, setIsStandalone] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsStandalone(detectStandalone());
  }, []);

  if (isStandalone) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
      >
        Add to Home Screen
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-title"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl dark:bg-zinc-950">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  id="install-title"
                  className="text-base font-semibold text-zinc-900 dark:text-zinc-50"
                >
                  Add to Home Screen
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Install this app for a clean, full-screen mobile experience.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
              {isIOS ? (
                <ol className="list-decimal space-y-2 pl-5">
                  <li>
                    Open this site in <span className="font-medium">Safari</span>.
                  </li>
                  <li>
                    Tap <span className="font-medium">Share</span>.
                  </li>
                  <li>
                    Tap <span className="font-medium">Add to Home Screen</span>.
                  </li>
                </ol>
              ) : (
                <ol className="list-decimal space-y-2 pl-5">
                  <li>
                    Open the menu in your browser (often the{" "}
                    <span className="font-medium">three dots</span>).
                  </li>
                  <li>
                    Tap <span className="font-medium">Install app</span> or{" "}
                    <span className="font-medium">Add to Home screen</span>.
                  </li>
                </ol>
              )}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 w-full rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}


