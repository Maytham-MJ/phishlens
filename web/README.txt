PhishLens live-check edition

Run on its hosted Worker for live lookups. Live checks share domains with Google DNS, Cloudflare Families malware DNS, RDAP registry services, and optionally VirusTotal. Attachment bytes and original email bytes remain local. Only file SHA-256 hashes are queried, never uploaded. An optional VirusTotal API key is used transiently and is not stored by the app.

DKIM verifies the first supported full-body RSA-SHA256 signature in an original .eml; other signatures are explicitly unsupported. SPF cannot be verified without trusted SMTP metadata; overall DMARC passes are not issued.

Browser extension: offline pattern checks; open Live checks in web app for online functions. Reload the unpacked extension after updating.

Build: node scripts/build.mjs
