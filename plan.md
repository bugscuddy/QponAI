1) Connect Consent Screen (single-screen copy — use as the gateway before accepting credentials)
Title: Connect your ShopRite account
Body:
By connecting your ShopRite account, you authorize QponAI to log in on your behalf to retrieve and manage digital coupons and related shopping data. QponAI will:

Access only the coupon and offers sections of your ShopRite account;

Store your credentials in encrypted form;

Execute actions you request (for example, “Clip All”); and

Never share your credentials with third parties without your explicit permission.

Checkboxes (both required):

☐ I confirm I am the owner of this ShopRite account and authorize QponAI to access it on my behalf.

☐ I have read and accept the QponAI Terms of Service and Privacy Policy.

Primary CTA: Connect ShopRite account
Secondary CTA (optional): Learn more about security

2) Terms of Service — Key Clause (to paste under “Account Connections / User-Authorized Access”)
User-Authorized Account Access.
By choosing to connect a third-party retail account (such as ShopRite) to QponAI, you explicitly authorize QponAI to access that account on your behalf using the credentials you provide or via an integration method you approve. You represent and warrant that (1) you are the account owner or otherwise have legal authority to grant QponAI access, and (2) you consent to QponAI performing any actions you request (for example, retrieving coupon information and “clipping” coupons).

QponAI will:

Use your credentials solely to access and manage that account for your benefit;

Store credentials encrypted and use them only when necessary to perform the requested action; and

Not share your credentials with third parties without your explicit consent.

You acknowledge that connecting your account may be subject to the third party’s terms of service; QponAI is not responsible for that third party’s actions, policies, or enforcement. If the third party restricts or blocks QponAI’s access, our ability to provide service may be limited.

3) Privacy Policy — Relevant Sections (ready-to-paste)
a) What data we collect
When you connect a ShopRite account, QponAI may collect and store the following data to provide service:

Credentials (username/email and password) — stored encrypted and used only to access the account upon your request;

Session cookies or tokens obtained during login (for session reuse), if applicable;

Coupon data (titles, descriptions, expiration dates, discount values, activation/clip status);

Minimal browsing metadata (timestamps, request/response codes) for troubleshooting; and

Usage logs (actions you performed such as “Fetch Coupons”, “Clip All”).

We do not collect payment information from the third-party account unless you explicitly provide it to us.

b) How we use your data
We use the data to:

Retrieve, display, and manage your coupons;

Execute actions you request (e.g., activate/clip) on your behalf;

Improve our product (aggregate, anonymized usage analytics); and

Provide customer support and troubleshooting.

We will not use your credentials to access other areas of your account unrelated to coupons or promotions.

c) How we store and protect your credentials
Credentials are encrypted at rest using industry-standard AES-256 encryption.

Decryption occurs only in-memory by the scraping/automation process for the duration needed; credentials are never written to disk in plaintext and are never logged.

Encryption keys are stored in secure environment variables (secrets management) and rotated periodically.

Access to production secrets and decryption routines is limited to authorized backend services and operations staff under strict audit.

d) Third-party services and sharing
We may use third-party providers for hosting, queueing, and monitoring (e.g., cloud providers, job queues). We will only share the minimum data required for those services to function. We do not sell your personal data. Any third-party service that has access to decrypted credentials is contractualized to meet our security requirements.

e) Data retention
If your account is active, we retain your encrypted credentials and coupon history to provide the service.

If you disconnect a ShopRite account, we will delete your credentials within 30 days unless you request otherwise; coupon history may be retained for up to 180 days for analytics and dispute resolution unless you request deletion sooner.

You may request full deletion of all personal data at any time via account settings or by contacting privacy@qponai.example.

f) User rights
You have the right to: access, correct, export, or delete your personal data. To exercise these rights, contact privacy@qponai.example or use the account settings page.

# QponAI Project Plan

## Project Overview
QponAI is an AI-assisted coupon app for Shoprite that helps users save money by automating coupon discovery and application.

## Technology Stack

### Frontend
- **Framework**: React Native with Expo
- **State Management**: React Query
- **UI Kit**: React Native Paper
- **Navigation**: React Navigation
- **Form Handling**: Formik with Yup validation
- **API Client**: Axios
- **Authentication**: JWT (JSON Web Tokens)

## Core Features

### 1. Coupon Integration
- **Digital Coupons**
  - Browse available Shoprite coupons
  - Clip/unclip coupons with one tap
  - View coupon details and expiration dates
  
- **Smart Matching**
  - AI-powered coupon recommendations
  - Personalized deals based on shopping history
  - Automatic coupon application at checkout

### 2. User Experience
- **Authentication**
  - Secure login and registration
  - Social login options
  - Password recovery

- **UI/UX**
  - Clean, intuitive interface
  - Dark/Light mode support
  - Accessible design (WCAG 2.1 compliant)
  - Offline support for saved coupons

### 3. Notifications
- **Push Notifications**
  - New coupon alerts
  - Expiring coupon reminders
  - Personalized deal notifications
  - Shopping cart suggestions

## Development Roadmap

### Phase 1: MVP (Weeks 1-4)
- [x] Set up Expo project
- [x] Implement authentication flow
- [x] Design and build main screens
- [x] Integrate with Shoprite API
- [x] Implement basic coupon browsing

### Phase 2: Core Features (Weeks 5-8)
- [ ] Add user profiles and preferences
- [ ] Implement push notifications
- [ ] Build shopping list integration
- [x] Add barcode scanner
- [ ] Implement search and filters

### Phase 3: Advanced Features (Weeks 9-12)
- [ ] AI-powered recommendations
- [ ] Price comparison tool
- [ ] Loyalty program integration
- [ ] Social sharing features
- [ ] Advanced analytics dashboard

## Success Metrics
- User acquisition rate
- Coupon redemption rate
- Average savings per user
- User retention rate
- App store ratings

## Future Enhancements
- Integration with other grocery chains
- AI-powered shopping list generator
- Social sharing features
- Voice assistant integration

4) Security & Operational Practices (plain-language summary for legal + marketing)
Encrypted storage: All user-provided ShopRite credentials are encrypted with AES-256 at rest.

In-memory usage only: Credentials are decrypted only in memory by the scraping service and never stored in plaintext.

Scoped access: QponAI accesses only the sections of your ShopRite account necessary to retrieve and manage coupons.

Least-privilege: Backend systems and staff have minimal privileges and access is logged.

Periodic key rotation & audits: Encryption keys are rotated and access logs are audited regularly.

Breach procedure: See the Breach Notification section below.

5) Revocation & Disconnect Flow (user-facing + internal steps)
User-facing microcopy (in settings)
Disconnect ShopRite account — Disconnecting will revoke QponAI’s access to your ShopRite account. QponAI will queue deletion of your stored credentials and stop all scheduled fetches. Coupon history may remain for up to 180 days unless you choose full deletion.

Buttons:

Disconnect account

Disconnect and delete all data (permanent)

Backend steps on Disconnect (developer ops checklist)
Mark connection status as revoked in DB.

Remove scheduled jobs related to this connection (cron / job queue).

Delete encryption keys or overwrite stored credential record (rotate to prevent reuse).

Remove cached session cookies and tokens.

Notify user via email: “Your ShopRite connection was disconnected.”

If user requested full deletion, remove coupon history and logs within 30 days.

6) Breach Notification Template & Plan
When: If QponAI determines that user credentials or other personal data were exposed due to a breach.

Plan:

Contain & Assess: Immediately halt scraping jobs, rotate compromised credentials/secrets, and identify affected users.

Notify affected users within 72 hours of confirmation (or sooner, if required by law).

Provide remediation guidance: Recommend password change at ShopRite, revoke QponAI connection, how to request deletion.

Report to authorities as required by law (state breach statutes, GDPR/DPA as applicable).

Notification email copy (short):
Subject: Important security notice from QponAI — action recommended
Body: We detected a security incident that may have affected your QponAI account and ShopRite connection. We have contained the issue and revoked access where appropriate. Please change your ShopRite password immediately and consider disconnecting your ShopRite account from QponAI. For help or to request deletion of your data, contact privacy@qponai.example. We apologize and are here to help.

7) Liability & Disclaimer (to include in ToS)
QponAI provides tools to retrieve and manage coupons from third-party retail accounts at your direction. We are not responsible for third-party account changes, temporary outages, or any action taken by the third party (including account suspensions). Use of QponAI to access third-party accounts is at your own risk. QponAI’s liability for damages is limited to the amount you have paid to QponAI in the prior 12 months, except where prohibited by law.

8) Minimal Audit & Logging Requirements (for compliance + support)
Log each time credentials are decrypted and used (include timestamp, connection id, and action) — keep logs for 90 days.

Log IP and user-agent of automated login attempts for troubleshooting (do not log credentials).

Keep an immutable audit trail of user consent actions (when user connected account, checkboxes ticked, TOS version accepted).

9) Recommended Microcopy & UX Prompts (short snippets for in-app use)
Before connect: “We’ll only use these credentials to fetch and manage YOUR coupons. We won’t save or share them in plaintext.”

During fetch: “Fetching your coupons now — we’ll only access coupon and offers sections.”

If fetch fails: “Couldn’t fetch coupons — try reconnecting or check your ShopRite credentials.”

When requesting premium upgrade: “Upgrade to AutoFetch to refresh your coupons daily and auto-clip new savings.”

10) Practical tips for legal safety & partnerships
Offer an alternative non-login flow (e.g., manual CSV uploads or mailer parsing) for users uncomfortable providing credentials.

Keep communications transparent: display last fetch time and last action performed on their behalf.

Reach out to ShopRite/partners early if you plan to scale — securing official integration/partnership avoids risk.

Consider using OAuth-like flows if ShopRite or their coupon network supports it in the future.

