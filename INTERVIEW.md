# PhishLens interview notes

Live demo: https://phishlens-check.maythamlucky.chatgpt.site

## Short introduction

I developed PhishLens with AI-assisted coding to investigate suspicious domains and emails. It combines phishing-pattern detection, live DNS and domain-age checks, threat intelligence, attachment hashing, and supported DKIM verification. Results explain warning signs while email and attachment contents stay in the browser.

## Project achievements

- Delivered a web app and a Chrome/Edge extension.
- Integrated DNS, RDAP, malware DNS intelligence, and optional VirusTotal reports.
- Added tests for valid and tampered DKIM signatures and provider failures.
- Made unavailable results explicit instead of treating them as safe.

## Demo

Scan example.com, try the built-in suspicious example, explain the findings, and download the report. Open the validation panel to run 12 curated functional checks and export the results. Explain that passing these checks is not evidence of real-world detection accuracy.

## Limits to explain

This assists investigation; it does not guarantee safety or replace antivirus. VirusTotal needs API access. SPF and overall DMARC are not independently verified. The extension uses the hosted web app for live checks. AI assisted implementation; describe only the work and technical decisions you can explain confidently.
