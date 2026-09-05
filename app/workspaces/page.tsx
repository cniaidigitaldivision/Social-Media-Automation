'use client';

/**
 * /workspaces — All Workspaces grid
 *
 * Fetches real workspaces from Supabase on the client using the anon key.
 * The WorkspaceCard onClick navigates to /workspaces/{real-uuid}/accounts.
 * Creating a new workspace via the modal adds it to the list immediately
 * (optimistic) and the modal navigates to the new workspace's accounts page.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { Building2, Plus, Loader2, AlertCircle } from 'lucide-react';
import { NewWorkspaceModal } from '@/components/new-workspace-modal/NewWorkspaceModal';

// Shape returned by the Supabase query
type WorkspaceRow = {
  id: string;
  name: string;
  logo_url: string | null;
  status: string;
};

export default function WorkspacesPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<WorkspaceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Fetch real workspaces from Supabase ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setFetchError(null);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('workspaces')
        .select('id, name, logo_url, status')
        .eq('status', 'active')
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('[WorkspacesPage] fetch error:', error);
        setFetchError('Could not load workspaces. Check your Supabase connection.');
      } else {
        setWorkspaces(data ?? []);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ── After workspace creation, append it and navigate in ──────────────────
  const handleSuccess = (created: { id: string; name: string; slug: string; logo_url: string | null }) => {
    const newWs: WorkspaceRow = {
      id: created.id,
      name: created.name,
      logo_url: created.logo_url,
      status: 'active',
    };
    setWorkspaces((prev) => [...prev, newWs]);
    // NewWorkspaceModal itself calls router.push(/workspaces/${id}/accounts)
  };

  const handleSelect = (ws: WorkspaceRow) => {
    router.push(`/workspaces/${ws.id}/accounts`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── App Header ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/60 h-14 flex items-center px-6 gap-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center">
            <span className="text-white font-black text-sm">CN</span>
          </div>
          <span className="font-bold text-sm text-gray-800 hidden sm:block">
            Crescent Nova International
          </span>
        </div>
        <div className="flex-1">
          <WorkspaceSwitcher />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
            SJ
          </div>
        </div>
      </header>

      {/* ── Page Content ──────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Workspaces</h1>
            <p className="text-sm text-gray-500 mt-1">
              Select a workspace to open its dashboard, or create a new one.
            </p>
          </div>
          <button
            id="btn-add-workspace-page"
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add workspace
          </button>
        </div>

        {/* ── Loading state ───────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Loading workspaces…</p>
          </div>
        )}

        {/* ── Error state ─────────────────────────────────────────────────────── */}
        {!loading && fetchError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-sm font-semibold text-gray-700">{fetchError}</p>
          </div>
        )}

        {/* ── Empty state ─────────────────────────────────────────────────────── */}
        {!loading && !fetchError && workspaces.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border-2 border-dashed border-teal-200 flex items-center justify-center">
              <Plus className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">No workspaces yet</p>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                Create your first workspace to start managing social accounts and publishing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create your first workspace
            </button>
          </div>
        )}

        {/* ── Workspace grid ──────────────────────────────────────────────────── */}
        {!loading && !fetchError && workspaces.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((ws) => (
              <WorkspaceCard
                key={ws.id}
                workspace={ws}
                onSelect={() => handleSelect(ws)}
              />
            ))}

            {/* + Add new card */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-teal-400 hover:bg-teal-50/50 transition-all cursor-pointer text-center min-h-[140px]"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-500 group-hover:text-teal-700 transition-colors">
                Add new workspace
              </p>
            </button>
          </div>
        )}
      </main>

      {/* ── Create Workspace Modal ─────────────────────────────────────────────── */}
      <NewWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

// ── Workspace Card ─────────────────────────────────────────────────────────────
const PALETTE = ['#005952', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

function WorkspaceCard({ workspace, onSelect }: { workspace: WorkspaceRow; onSelect: () => void }) {
  const initials = workspace.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const colorIndex =
    workspace.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % PALETTE.length;
  const avatarBg = PALETTE[colorIndex];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-gray-200 bg-white cursor-pointer transition-all outline-none hover:border-gray-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-teal-500"
    >
      {/* Avatar */}
      {workspace.logo_url ? (
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
          <img src={workspace.logo_url} alt={workspace.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: avatarBg }}
        >
          <span className="text-white font-bold text-lg">{initials}</span>
        </div>
      )}

      <div>
        <p className="font-semibold text-gray-900 text-sm">{workspace.name}</p>
        <p className="text-xs text-gray-400 mt-0.5 font-mono">{workspace.id.slice(0, 8)}…</p>
      </div>

      <div className="flex items-center gap-2 pt-1 mt-auto border-t border-gray-100">
        <Building2 className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-xs text-gray-400">Click to open</span>
      </div>
    </div>
  );
}
