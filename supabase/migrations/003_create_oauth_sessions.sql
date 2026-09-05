CREATE TABLE IF NOT EXISTS public.oauth_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    pages_json TEXT NOT NULL,
    user_token_encrypted TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Index for cleaning up expired sessions easily
CREATE INDEX idx_oauth_sessions_expires_at ON public.oauth_sessions(expires_at);
