import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt } from '@/lib/crypto';
import { createClient } from '@/lib/supabase/server';
import { confirmYouTubeSelection } from '../actions';

interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    thumbnails?: {
      default?: { url: string };
    };
  };
}

export default async function YouTubeChannelSelection({
  params
}: {
  params: Promise<{ workspaceId: string }> | { workspaceId: string }
}) {
  const resolvedParams = await Promise.resolve(params);
  const workspaceId = resolvedParams.workspaceId;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('youtube_oauth_session');

  if (!sessionCookie) {
    redirect(`/workspaces/${workspaceId}/accounts?error=session_expired`);
  }

  const sessionId = sessionCookie.value;
  const supabase = createClient();

  const { data: sessionRow, error: sessionError } = await supabase
    .from('oauth_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError || !sessionRow) {
    redirect(`/workspaces/${workspaceId}/accounts?error=session_expired`);
  }

  if (new Date() > new Date(sessionRow.expires_at)) {
    await supabase.from('oauth_sessions').delete().eq('id', sessionId);
    redirect(`/workspaces/${workspaceId}/accounts?error=session_expired`);
  }

  if (sessionRow.workspace_id !== workspaceId) {
    redirect(`/workspaces/${workspaceId}/accounts?error=workspace_mismatch`);
  }

  let channels: YouTubeChannel[] = [];
  try {
    channels = JSON.parse(decrypt(sessionRow.pages_json));
  } catch (e) {
    redirect(`/workspaces/${workspaceId}/accounts?error=invalid_session`);
  }

  if (channels.length === 0) {
    return (
      <div className="page-content-wrapper" style={{ padding: '28px 32px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '80px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>No Channels Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            You do not have any YouTube channels on this Google account.
          </p>
          <a href={`/workspaces/${workspaceId}/accounts`} className="btn-secondary-outline" style={{ display: 'inline-block' }}>
            Back to Accounts
          </a>
        </div>
      </div>
    );
  }

  const { data: connectedAccounts } = await supabase
    .from('connected_accounts')
    .select('platform_account_id')
    .eq('workspace_id', workspaceId)
    .eq('platform', 'youtube');
    
  const connectedChannelIds = new Set(connectedAccounts?.map(a => a.platform_account_id) || []);

  return (
    <div className="page-content-wrapper" style={{ padding: '28px 32px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
          Select Channels to Connect
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>
          Choose which YouTube channels you want to connect to this workspace.
        </p>

        <form action={confirmYouTubeSelection}>
          <input type="hidden" name="workspaceId" value={workspaceId} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {channels.map((channel) => {
              const isConnected = connectedChannelIds.has(channel.id);
              const avatar = channel.snippet.thumbnails?.default?.url || '';
              
              return (
                <label 
                  key={channel.id}
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
                    name="selectedChannels" 
                    value={channel.id} 
                    disabled={isConnected}
                    style={{ marginRight: '16px', width: '20px', height: '20px' }}
                  />
                  
                  {avatar && (
                    <img 
                      src={avatar} 
                      alt={channel.snippet.title} 
                      style={{ width: '40px', height: '40px', borderRadius: '20px', marginRight: '16px' }}
                    />
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {channel.snippet.title}
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
