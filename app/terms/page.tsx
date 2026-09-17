import React from 'react';

export default function TermsPage() {
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
          <h1>Terms of Service</h1>
          <div className="last-updated">Crescent Nova International — AI &amp; Digital Division | Product: Postly | Last updated: September 17, 2026</div>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using Postly, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the service.</p>

          <h2>2. Description of Service</h2>
          <p>Postly is an internal tool designed to allow Crescent Nova International (CNI) team members to schedule and publish social media content to connected accounts owned or managed by CNI.</p>

          <h2>3. User Responsibilities</h2>
          <ul>
            <li>Users must own or be explicitly authorized to manage the social accounts they connect to Postly.</li>
            <li>Users must comply with the Terms of Service of each connected platform.</li>
            <li>Users must not use Postly to publish unlawful, infringing, or platform-violating content.</li>
          </ul>

          <h2>4. Third-Party Platforms</h2>
          <p>Postly integrates with third-party APIs, including YouTube API Services. Use of the YouTube feature is subject to the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a> and Google Privacy Policy.</p>

          <h2>5. Intellectual Property</h2>
          <p>User-generated content remains the property of the respective owner or CNI. The Postly software, interface, and underlying codebase remain the exclusive property of Crescent Nova International.</p>

          <h2>6. Disclaimers and Limitation of Liability</h2>
          <p>Postly is provided &quot;as is&quot; without any warranties. CNI does not guarantee uninterrupted publishing and is not liable for failures, API changes, or downtime originating from third-party social platforms.</p>

          <h2>7. Termination</h2>
          <p>CNI reserves the right to suspend or terminate access to Postly for any team member who misuses the platform or violates these terms.</p>

          <h2>8. Changes to Terms</h2>
          <p>We may update these terms periodically. Continued use of Postly after any changes indicates acceptance of the new terms.</p>

          <h2>9. Contact</h2>
          <p>If you have questions regarding these Terms of Service, please contact <a href="mailto:admin@aidigitaldivision.com">admin@aidigitaldivision.com</a>.</p>
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
