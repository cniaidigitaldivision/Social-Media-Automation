import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="marketing-override min-h-screen w-full bg-[#040d1a] text-[#e9eff6]">
      <style dangerouslySetInnerHTML={{ __html: `
        body { background: #040d1a !important; color: #e9eff6 !important; margin: 0; overflow-x: hidden; }
        :root {
          --teal: #005952;
          --teal-hover: #007369;
          --teal-glow: rgba(0, 115, 105, .45);
          --bg: #040d1a;
          --bg-raised: #081426;
          --line: rgba(255, 255, 255, .08);
          --line-strong: rgba(255, 255, 255, .14);
          --fg: #e9eff6;
          --fg-muted: #93a6ba;
          --fg-faint: #64788c;
          --maxw: 1180px;
        }
        .marketing-override { font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif; }
        .marketing-override a { color: inherit; text-decoration: none; }
        .marketing-override h1, .marketing-override h2, .marketing-override h3 {
          font-family: 'Space Grotesk', Inter, sans-serif;
          font-weight: 600;
          letter-spacing: -.01em;
          line-height: 1.08;
          margin: 0;
        }
        .wrap { width: 100%; max-width: var(--maxw); margin: 0 auto; padding-inline: 24px; }
        
        .bg-layer { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .bg-glow { position: absolute; border-radius: 50%; filter: blur(110px); }
        .bg-glow-1 { width: 820px; height: 820px; top: -340px; right: -200px; background: radial-gradient(circle, var(--teal-glow) 0%, transparent 68%); }
        .bg-glow-2 { width: 640px; height: 640px; top: 44%; left: -260px; background: radial-gradient(circle, rgba(0, 89, 82, .40) 0%, transparent 70%); }
        .bg-glow-3 { width: 700px; height: 700px; bottom: -320px; left: 38%; background: radial-gradient(circle, rgba(0, 115, 105, .28) 0%, transparent 72%); }
        
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; padding-top: env(safe-area-inset-top, 0px); background: rgba(4, 13, 26, .82); backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); }
        .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; height: 72px; }
        .brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .brand img { height: 52px; width: auto; object-fit: contain; display: block; }
        
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 46px; padding: 0 22px; border-radius: 10px; font-family: Inter, sans-serif; font-size: 14.5px; font-weight: 600; border: 1px solid transparent; cursor: pointer; white-space: nowrap; }
        .btn-sm { height: 38px; padding: 0 16px; font-size: 14px; }
        .btn-primary { background: var(--teal); color: #fff; box-shadow: 0 6px 22px rgba(0, 89, 82, .5); }
        .btn-primary:hover { background: var(--teal-hover); box-shadow: 0 8px 28px rgba(0, 115, 105, .6); }
        
        .policy-content { padding: 140px 0 80px; position: relative; z-index: 1; }
        .policy-content h1 { font-size: 36px; margin-bottom: 8px; }
        .policy-content .last-updated { color: var(--fg-muted); margin-bottom: 48px; font-size: 15px; }
        .policy-content h2 { font-size: 24px; margin-top: 40px; margin-bottom: 16px; border-bottom: 1px solid var(--line); padding-bottom: 12px; }
        .policy-content h3 { font-size: 18px; margin-top: 24px; margin-bottom: 12px; }
        .policy-content p, .policy-content ul, .policy-content li { color: var(--fg-muted); font-size: 16px; line-height: 1.7; margin-bottom: 16px; }
        .policy-content ul { padding-left: 24px; }
        .policy-content li { margin-bottom: 8px; }
        .policy-content a { color: var(--teal-hover); text-decoration: underline; }
        .policy-content a:hover { color: #fff; }
        .text-col { max-width: 720px; margin: 0 auto; }
        
        .footer { border-top: 1px solid var(--line); padding-block: 36px; position: relative; z-index: 1; }
        .footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .footer-copy { font-size: 13.5px; color: var(--fg-faint); margin: 0; }
        .footer-links { display: flex; gap: 16px; align-items: center; }
        .footer-links a { color: var(--fg-faint); font-size: 13.5px; transition: color 0.2s; }
        .footer-links a:hover { color: var(--fg); }
        .footer-divider { width: 1px; height: 12px; background: var(--line-strong); }
        
        @media (max-width:640px) {
          .nav-inner { height: 64px; }
          .footer-inner { flex-direction: column; text-align: center; }
          .footer-links { flex-direction: column; gap: 12px; margin-top: 24px; }
          .footer-divider { display: none; }
        }
      `}} />
      <div className="bg-layer" aria-hidden="true">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
      </div>
      <header className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="/">
            <img src="/logo.png" alt="AI &amp; Digital Division" />
          </a>
          <div className="nav-cta">
            <a className="btn btn-sm btn-primary" href="/login">Log in</a>
          </div>
        </div>
      </header>
      
      <main className="policy-content">
        <div className="wrap text-col">
          <h1>Privacy Policy</h1>
          <div className="last-updated">Crescent Nova International — AI &amp; Digital Division | Product: Postly | Last updated: September 17, 2026</div>

          <h2>1. Scope</h2>
          <p>Postly is an internal tool operated by Crescent Nova International (CNI) for scheduling and publishing content to social accounts CNI itself owns or manages. It is not a public consumer product.</p>

          <h2>2. What Data Is Collected and Why</h2>
          <ul>
            <li><strong>Team member account details:</strong> Name, email address, and avatar for authentication and team identification.</li>
            <li><strong>Connected social account identifiers:</strong> Page IDs, channel IDs, and usernames to identify publishing targets.</li>
            <li><strong>OAuth tokens:</strong> Access and refresh tokens, securely encrypted at rest, used exclusively to publish content on behalf of the connected accounts.</li>
            <li><strong>Post content:</strong> Captions, media files, and schedule times created by our team.</li>
            <li><strong>Audit records:</strong> Basic security logs recording user actions within the platform.</li>
          </ul>

          <h2>3. Social Media Accounts</h2>
          <p>Postly connects to CNI&apos;s own social accounts across Facebook, Instagram, LinkedIn, TikTok, and YouTube to publish scheduled posts our team composes. We do not read private messages, comment authors, or personal profiles. Access tokens (where applicable) are encrypted at rest and used only to publish. Access can be revoked by the account owner from each platform&apos;s own settings.</p>
          
          <h3>YouTube specifically</h3>
          <p>Postly uses the YouTube Data API to upload videos to channels CNI owns or manages; no other user&apos;s or the public&apos;s YouTube data is accessed. Google&apos;s use of information is governed by the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>. Access can be revoked anytime at <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">https://myaccount.google.com/permissions</a>, which immediately stops upload ability. Disconnecting removes the local connection and its token, but does not delete videos already on YouTube (only YouTube Studio can do this).</p>

          <h2>4. Third-Party Processors</h2>
          <p>Postly relies on the following third-party processors to operate:</p>
          <ul>
            <li><strong>Supabase:</strong> Database, storage, and authentication.</li>
            <li><strong>Vercel:</strong> Application hosting.</li>
            <li><strong>n8n:</strong> Publishing automation engine.</li>
            <li><strong>Buffer:</strong> TikTok publishing pipeline.</li>
            <li><strong>Social Platforms (Meta, LinkedIn, Google/YouTube):</strong> As recipients of the scheduled post content.</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>All data is encrypted in transit and at rest. OAuth tokens are encrypted with a separate AES-256-GCM key. The database enforces strict row-level security (RLS), and two-factor authentication is available for all team members.</p>

          <h2>6. Data Retention</h2>
          <p>Post content and media are retained as long as the workspace is active to maintain publishing history. Audit records are retained indefinitely for security and compliance monitoring.</p>

          <h2>7. User Rights &amp; Contact</h2>
          <p>Users may request access to, correction, or deletion of their personal data. For all privacy inquiries, please contact <a href="mailto:admin@aidigitaldivision.com">admin@aidigitaldivision.com</a>.</p>

          <h2>8. Changes to this Policy</h2>
          <p>Material changes to this policy will update the &quot;Last updated&quot; date and account holders will be notified internally.</p>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <a className="brand" href="/">
            <img src="/logo.png" alt="AI &amp; Digital Division" />
          </a>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <span className="footer-divider"></span>
            <a href="/terms">Terms of Service</a>
          </div>
          <p className="footer-copy">&copy; 2026 Crescent Nova International &middot; AI &amp; Digital Division</p>
        </div>
      </footer>
    </div>
  );
}
