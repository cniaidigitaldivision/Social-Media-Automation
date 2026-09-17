"use client";

import React, { useEffect, useRef, useState } from "react";
import { LogOut, Grid3x3 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ProfileData {
  full_name: string;
  email: string;
}

export function ProfileDropdown() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Fetch user + profile on mount ───────────────────────────── */
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: authData }) => {
      if (!authData?.user) return;
      supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", authData.user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfile({
              full_name: data.full_name ?? "",
              email: data.email ?? authData.user.email ?? "",
            });
          } else {
            setProfile({
              full_name: authData.user.user_metadata?.full_name ?? "",
              email: authData.user.email ?? "",
            });
          }
        });
    });
  }, []);

  /* ── Close on outside click / Escape ──────────────────────────── */
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  /* ── Logout ────────────────────────────────────────────────────── */
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div ref={containerRef} className="relative">
      {/* ── Trigger: plain circular avatar button ───────────────── */}
      <button
        id="btn-profile-dropdown"
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border-0 bg-gradient-to-br from-teal-700 to-teal-500 text-[13px] font-bold text-white transition-opacity duration-200 select-none hover:opacity-90 focus:outline-none"
        aria-label="Open user menu"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {/* ── Dropdown ────────────────────────────────────────────── */}
      {open && (
        <div
          className="absolute top-full right-0 z-50 mt-3 min-w-[250px] rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
          role="menu"
        >
          {/* ── User info ─────────────────────────────────────── */}
          <div className="flex items-center gap-3 p-2">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-700 to-teal-500 text-[13px] font-bold text-white select-none">
              {initials}
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-gray-900">
                {profile?.full_name || "—"}
              </span>
              <span className="truncate text-xs text-gray-500">
                {profile?.email || "—"}
              </span>
            </div>
          </div>

          {/* ── Divider ───────────────────────────────────────── */}
          <div className="my-1 border-t border-gray-100" />

          {/* ── Logout ────────────────────────────────────────── */}
          <button
            id="btn-profile-logout"
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700"
            role="menuitem"
            onClick={handleLogout}
          >
            <LogOut size={16} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Mini NavBar preview wrapper (standalone usage / Storybook) ────── */
export function ProfileDropdownPreview() {
  return (
    <header className="flex h-14 items-center justify-end gap-3 border-b border-gray-100 bg-white px-6 shadow-sm">
      <button
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
        aria-label="Grid"
      >
        <Grid3x3 size={18} />
      </button>
      <ProfileDropdown />
    </header>
  );
}
