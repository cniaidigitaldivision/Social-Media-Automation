import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/crypto';
import { createClient } from '@/lib/supabase/server';
import { confirmMetaSelection } from '../actions';

interface MetaPage {
  id: string;
  name: string;
  picture?: { data?: { url: string } };
  instagram_business_account?: { id: string };
}

export default async function MetaPageSelection({
  params
}: {
  params: Promise<{ workspaceId: string }> | { workspaceId: string }
}) {
  // Await params if it's a promise (Next.js 15), or just use it.
  const resolvedParams = await Promise.resolve(params);
  const workspaceId = resolvedParams.workspaceId;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('meta_oauth_session');

  if (!sessionCookie) {
    redirect(`/workspaces/${workspaceId}/accounts?error=session_expired`);
  }

  const sessionId = sessionCookie.value;
  const supabase = createClient();

  // Fetch the session from the database
  const { data: sessionRow, error: sessionError } = await supabase
    .from('oauth_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError || !sessionRow) {
    redirect(`/workspaces/${workspaceId}/accounts?error=session_expired`);
  }

  // Check if session has expired
  if (new Date() > new Date(sessionRow.expires_at)) {
    await supabase.from('oauth_sessions').delete().eq('id', sessionId);
    redirect(`/workspaces/${workspaceId}/accounts?error=session_expired`);
  }

  if (sessionRow.workspace_id !== workspaceId) {
    redirect(`/workspaces/${workspaceId}/accounts?error=workspace_mismatch`);
  }

  let pages: MetaPage[] = [];
  try {
    const decryptedPagesStr = decrypt(sessionRow.pages_json);
    pages = JSON.parse(decryptedPagesStr);
  } catch (e) {
    redirect(`/workspaces/${workspaceId}/accounts?error=invalid_session`);
  }

  if (pages.length === 0) {
    return (
      <div className="page-content-wrapper" style={{ padding: '28px 32px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '80px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>No Pages Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            You do not administer any Facebook Pages. To connect Facebook or Instagram, you must have admin access to a Facebook Page.
          </p>
          <a href={`/workspaces/${workspaceId}/accounts`} className="btn-secondary-outline" style={{ display: 'inline-block' }}>
            Back to Accounts
          </a>
        </div>
      </div>
    );
  }

  // Fetch already connected accounts to disable them
  const { data: connectedAccounts } = await supabase
    .from('connected_accounts')
    .select('platform_account_id')
    .eq('workspace_id', workspaceId)
    .eq('platform', 'facebook');
    
  const connectedPageIds = new Set(connectedAccounts?.map(a => a.platform_account_id) || []);

  return (
    <div className="page-content-wrapper" style={{ padding: '28px 32px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
          Select Pages to Connect
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>
          Choose which Facebook Pages you want to connect to this workspace. 
          If a Page has an associated Instagram Business account, it will also be connected.
        </p>

        <form action={confirmMetaSelection}>
          <input type="hidden" name="workspaceId" value={workspaceId} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {pages.map((page) => {
              const isConnected = connectedPageIds.has(page.id);
              const avatar = page.picture?.data?.url || '';
              
              return (
                <label 
                  key={page.id}
                  className="form-field-block"
                  style={{
                    display: 'flex', alignItems: 'center', padding: '16px', 
                    background: 'var(--bg-card)', borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                    cursor: isConnected ? 'not-allowed' : 'pointer',
                    opacity: isConnected ? 0.6 : 1
                  }}
                >
                  <input 
                    type="checkbox" 
                    name="selectedPages" 
                    value={page.id} 
                    disabled={isConnected}
                    style={{ marginRight: '16px', width: '20px', height: '20px' }}
                  />
                  
                  {avatar && (
                    <img 
                      src={avatar} 
                      alt={page.name} 
                      style={{ width: '40px', height: '40px', borderRadius: '8px', marginRight: '16px' }}
                    />
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {page.name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {page.instagram_business_account 
                        ? 'Instagram Business Account linked' 
                        : 'No Instagram account linked'}
                    </div>
                  </div>

                  {isConnected && (
                    <span style={{ 
                      fontSize: '12px', fontWeight: 600, padding: '4px 8px',
                      background: 'var(--status-published-bg)', color: 'var(--status-published)',
                      borderRadius: '4px'
                    }}>
                      Connected
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <a href={`/workspaces/${workspaceId}/accounts`} className="btn-secondary-outline" style={{ display: 'inline-flex', alignItems: 'center' }}>
              Cancel
            </a>
            <button type="submit" className="btn-primary-teal">
              Connect Selected
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
