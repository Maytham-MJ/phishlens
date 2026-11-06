# PhishLens

A Matrix-style phishing checker with a web app and a Chrome/Edge extension.

**[Open the live app](https://phishlens-check.maythamlucky.chatgpt.site)** (owner-private; sign in with an account granted access).

## Features

- Explain suspicious URLs, lookalike domains and phishing language in emails.
- Query live A, AAAA, MX, SPF TXT and DMARC TXT records through Google DNS.
- Check Cloudflare Families malware DNS intelligence.
- Retrieve domain registration dates through authoritative RDAP services.
- Optionally query existing VirusTotal domain and attachment-hash reports.
- Hash attachments locally and flag basic risky file types.
- Verify the first supported full-body RSA-SHA256 DKIM signature in an original `.eml`, using its public DNS key.
- Download a plain-text report.

## Run locally

Use Node.js 24 or newer. Builds and tests need no application dependencies.

```sh
node scripts/build.mjs
node tests/checks.mjs
npx wrangler dev
```

Open the URL Wrangler prints. Wrangler needs internet access on its first installation. Live checks require outbound internet. The website and its `/api/*` routes must share an origin.

To deploy to your Cloudflare account, authenticate Wrangler, choose a unique name in `wrangler.jsonc`, then run `npx wrangler deploy`. The live app linked above is deployed separately through Sites. This repository does not automatically redeploy it.

## Browser extension

1. Visit `chrome://extensions` or `edge://extensions`.
2. Enable Developer mode and select **Load unpacked**.
3. Select this repository's `extension/` folder.
4. Pin PhishLens and choose **Use current page**, or paste a domain or email.

The extension performs offline pattern checks. **Live checks in web app** opens the hosted app for DNS, registration, reputation, attachments and DKIM. The extension requests only `activeTab`; it does not scan in the background or request browsing history. To point it to your own deployment, change the hosted origin in `extension/index.html` and `extension/extension.js`.

The packaged extension is at `web/phishlens-extension.zip`. It is an unpacked developer extension, not a browser-store listing.

## VirusTotal

An optional key can be entered in the app for a session. It is sent over HTTPS through the backend to VirusTotal, and is not stored by the app. Never commit API keys.

For a server-side default, use `npx wrangler secret put VIRUSTOTAL_API_KEY`. For local development, set the same variable in an ignored `.dev.vars` file. Provider quotas and report availability depend on your account. Files and URLs are never submitted for new scans.

## Privacy and limitations

Email and attachment bytes stay in the browser. Live checks share domain names with DNS, RDAP and threat providers. Optional attachment reputation shares SHA-256 hashes with VirusTotal. Turn off live checks for offline analysis.

This educational security aid is not antivirus or a safety guarantee. Unknown hashes and unlisted domains can be malicious. Attachment checks do not unpack archives, inspect macros or execute files. Domain age is not a trust score. Provider failures are shown as unavailable.

DKIM supports complete-body RSA-SHA256 signatures with simple/relaxed canonicalization in original email files. Other signatures are explicitly unsupported. SPF cannot be verified without trusted SMTP metadata; this app does not issue overall DMARC authentication passes. Pasted Authentication-Results headers are not trusted as proof.

## Source layout

| Folder | Purpose |
| --- | --- |
| `web/` | UI, local patterns, DKIM verification and attachment checks |
| `worker/` | DNS, RDAP and reputation backend |
| `extension/` | Unpacked Manifest V3 extension |
| `scripts/` | Dependency-free Worker bundler |
| `tests/` | DKIM valid/tampered fixtures, provider mocks and routing tests |

The build embeds web assets in `dist/server/index.js`. Generated output and deployment identity are excluded from Git.
