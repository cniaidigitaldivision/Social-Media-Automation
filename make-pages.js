const fs = require('fs');
const landing = fs.readFileSync('public/landing.html', 'utf8');

const topPart = landing.split('<body>')[0] + '<body>\n  <div class="bg-layer" aria-hidden="true">\n    <div class="bg-glow bg-glow-1"></div>\n    <div class="bg-glow bg-glow-2"></div>\n    <div class="bg-glow bg-glow-3"></div>\n  </div>\n';

const nav = `
  <header class="nav" id="nav">
    <div class="wrap nav-inner">
      <a class="brand" href="/">
        <img src="/logo.png" alt="AI &amp; Digital Division" />
      </a>
      <div class="nav-cta">
        <a class="btn btn-sm btn-primary" href="/login">Log in</a>
      </div>
    </div>
  </header>
`;

const extraCss = `
    <style>
      .policy-content { padding: 140px 0 80px; }
      .policy-content h1 { font-size: 36px; margin-bottom: 8px; }
      .policy-content .last-updated { color: var(--fg-muted); margin-bottom: 48px; font-size: 15px; }
      .policy-content h2 { font-size: 24px; margin-top: 40px; margin-bottom: 16px; border-bottom: 1px solid var(--line); padding-bottom: 12px; }
      .policy-content p, .policy-content ul, .policy-content li { color: var(--fg-muted); font-size: 16px; line-height: 1.7; margin-bottom: 16px; }
      .policy-content ul { padding-left: 24px; }
      .policy-content li { margin-bottom: 8px; }
      .policy-content a { color: var(--teal-hover); text-decoration: underline; }
      .policy-content a:hover { color: #fff; }
      .text-col { max-width: 720px; margin: 0 auto; }
      .footer-links { display: flex; gap: 16px; align-items: center; }
      .footer-links a { color: var(--fg-faint); font-size: 13.5px; transition: color 0.2s; }
      .footer-links a:hover { color: var(--fg); }
      .footer-divider { width: 1px; height: 12px; background: var(--line-strong); }
      @media (max-width:640px) {
        .footer-links { flex-direction: column; gap: 12px; margin-top: 24px; }
        .footer-divider { display: none; }
      }
    </style>
`;

const footer = `
  <footer class="footer">
    <div class="wrap footer-inner">
      <a class="brand" href="/">
        <img src="/logo.png" alt="AI &amp; Digital Division" />
      </a>
      <div class="footer-links">
        <a href="/privacy">Privacy Policy</a>
        <span class="footer-divider"></span>
        <a href="/terms">Terms of Service</a>
      </div>
      <p class="footer-copy">&copy; 2026 Crescent Nova International &middot; AI &amp; Digital Division</p>
    </div>
  </footer>
  <script>
    (function () {
      'use strict';
      var nav = document.getElementById('nav');
      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();
  </script>
</body>
</html>
`;

const privacyContent = `
  <main class="policy-content">
    <div class="wrap text-col">
      <h1>Privacy Policy</h1>
      <div class="last-updated">Crescent Nova International — AI &amp; Digital Division | Product: Postly | Last updated: September 17, 2026</div>

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

      <h2>3. YouTube API Services</h2>
      <p>Postly uses <strong>YouTube API Services</strong> to allow team members to upload videos to YouTube channels owned or managed by CNI.</p>
      <ul>
        <li><strong>Google Privacy Policy:</strong> By using the YouTube integration, users agree to be bound by the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.</li>
        <li><strong>Data Accessed:</strong> Postly accesses only the authenticated channel's ID, title, and the ability to upload videos (with titles and descriptions). <strong>No other user's or public YouTube data is accessed.</strong> Postly does not scrape, harvest analytics, or perform bulk collection.</li>
        <li><strong>Revoking Access:</strong> You can revoke Postly's access to your YouTube account at any time via the <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer">Google Security Settings page</a>. Revoking access immediately stops Postly's ability to upload to that channel.</li>
        <li><strong>Deletion:</strong> Disconnecting a YouTube account within Postly removes the stored connection and its encrypted token from our database. Videos already uploaded remain on YouTube and can only be removed via YouTube Studio.</li>
      </ul>

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
      <p>Material changes to this policy will update the "Last updated" date and account holders will be notified internally.</p>
    </div>
  </main>
`;

const termsContent = `
  <main class="policy-content">
    <div class="wrap text-col">
      <h1>Terms of Service</h1>
      <div class="last-updated">Crescent Nova International — AI &amp; Digital Division | Product: Postly | Last updated: September 17, 2026</div>

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
      <p>Postly is provided "as is" without any warranties. CNI does not guarantee uninterrupted publishing and is not liable for failures, API changes, or downtime originating from third-party social platforms.</p>

      <h2>7. Termination</h2>
      <p>CNI reserves the right to suspend or terminate access to Postly for any team member who misuses the platform or violates these terms.</p>

      <h2>8. Changes to Terms</h2>
      <p>We may update these terms periodically. Continued use of Postly after any changes indicates acceptance of the new terms.</p>

      <h2>9. Contact</h2>
      <p>If you have questions regarding these Terms of Service, please contact <a href="mailto:admin@aidigitaldivision.com">admin@aidigitaldivision.com</a>.</p>
    </div>
  </main>
`;

const newHead = topPart.replace('</style>', extraCss + '</style>');

fs.writeFileSync('public/privacy.html', newHead + nav + privacyContent + footer);
fs.writeFileSync('public/terms.html', newHead + nav + termsContent + footer);
