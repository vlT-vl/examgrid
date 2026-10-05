<p align="center">
  <img src="res/examgrid.svg" alt="examgrid" width="120" />
</p>

<p align="center">
  Timed professional exam simulator — multi-choice quizzes, remote catalog, downloadable report<br/>
  <sub>Frontend React · Build Vite · Deploy GitHub Pages</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.2--R051026-b23b3f?style=flat-square" alt="version"/>
  <img src="https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="react"/>
  <img src="https://img.shields.io/badge/vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="vite"/>
  <img src="https://img.shields.io/badge/license-proprietary-critical?style=flat-square" alt="license"/>
  <img src="https://img.shields.io/badge/deploy-GitHub%20Pages-black?style=flat-square&logo=github" alt="deploy"/>
</p>

---

## Overview

**examgrid** is a timed professional exam simulator: the candidate logs in — the session persists across a page reload — browses a catalog of exams as cards on the home screen, opens one for its details, and sits a multi-choice quiz against a countdown and an elapsed-time clock, ending in a pass/fail summary with a downloadable report. The interface is bilingual (Italian/English).

There is no application backend. The exam catalog, the account list and every exam's question content are fetched live at runtime from a companion public registry, **[examgrid.exams](https://github.com/vlT-vl/examgrid.exams)** — the same role [nxget.packages](../nxget.packages) plays for `nxget-app-portal`: plain files, no server, no API beyond raw GitHub content. The catalog itself is public; the account list and each exam's actual content are protected, and starting an exam requires a voucher obtained from the administrator (see Features → Voucher).

---

## Features

| Section | Description |
|---|---|
| **Login** | Full-screen gate in front of the app; accounts come from the live account list on [examgrid.exams](https://github.com/vlT-vl/examgrid.exams), fetched on startup. The session (just the username) is kept in `localStorage`, so a page reload lands back on the Home screen, not on the login form |
| **Navbar** | Persistent top bar (hidden only during an active exam, to avoid mid-test distractions), brand centered between two symmetric side columns via `AnimatedLogo` (its icon draws itself in one grid line at a time, then "examgrid" enters one letter at a time — see Architecture): a language toggle, a light/dark theme toggle, info and exam-history icon buttons, the logged-in username, and a logout button on the right; clicking the brand goes back home |
| **Home** | A left-hand column of category filter pills (icon + label, one per category + "All") next to a fluid exam card grid, sourced from the live catalog on [examgrid.exams](https://github.com/vlT-vl/examgrid.exams) and filtered down to what the logged-in account is allowed to see (`examAccess` on its account record, see Permissions below). Each category carries the vendor's own logo and brand color where the registry provides one (e.g. Red Hat, Nutanix, Proxmox, VMware), falling back to a generated shade of green otherwise. Each card shows the exam's icon, category, code, title, description, its duration/question count and, when the registry provides one, a small pill with the exam content's last-update date. A search field next to the title (an icon that expands on hover) filters by title, code, description or category, combined with the active category pill. Title, filter column and cards animate in on load, cards staggered one after another. On desktop, the navbar, footer and category filters stay fixed while only the card grid scrolls, with its scrollbar visually hidden; on narrow screens the filter column stacks above the grid and the whole page scrolls normally |
| **Exam detail** | One card with everything about the picked exam: icon, category (next to it, the same last-update pill as on the card, when available), code, title, description, duration/question count and the candidate identity (read from the logged-in account, no separate field). A voucher request sits below it, gating the rest (see Voucher); once unlocked, per-account settings appear in the same card — a question range (defaults to the full set), randomizing question and answer order (off by default), and, only for accounts explicitly authorized for it, showing correct answers while answering — followed by "Avvia Esame" to start |
| **Voucher** | Starting a specific exam requires a voucher obtained from the administrator **for that exam** — a voucher only unlocks the exam it was issued for, not the rest of the catalog. Collapsed into a small pill by default inside the exam detail card — clicking it cross-fades into the full panel, styled after the same interaction in [`nxget-app-portal`](../nxget-app-portal). The candidate's name and the target exam are read automatically (no typing it in); a request code is generated to send to the administrator, who issues the voucher in return. Once entered, the voucher stays usable on that device for that exam until it expires — no need to enter it again until then |
| **Exam** | A single centered panel, widening further on large screens, with its own header (exam title, countdown and elapsed-time clocks, an "End exam" action that asks for confirmation and jumps straight to the summary, scored on whatever answers were given so far) and footer (question counter, Back/Next/Finish). Multi-choice questions (the required number of answers per question is validated before advancing) with full-width, lettered answer rows, drawn from the range chosen on the exam detail page, a countdown timer based on the duration declared in the exam file (fallback 120 minutes). If "show correct answers" was enabled, each question gets an eye-icon button that reveals that one question's correct answer on click — hidden again on the next question, never shown automatically. The whole attempt (questions, answers given so far, elapsed/remaining time) is continuously snapshotted to `sessionStorage`; an accidental page reload or browser close resumes the exam exactly where it left off instead of losing it, and the browser's own "leave site?" prompt guards against navigating away mid-exam by mistake |
| **Summary** | Animated entrance for the whole report card. Final score out of 500, pass/fail outcome (350 threshold), elapsed and remaining time, a button to download a self-contained HTML report (styles included, same language as the interface) named after the candidate and the date/time. Accounts explicitly authorized for it also get a collapsible "Review answers" section, inside the card and the downloaded report alike, with a per-question table of the question, the candidate's answer and the correct one |
| **History** | Per-user history of completed attempts for the current browser-tab session, opened from the `TbReport` icon in the navbar. Its compact modal presents each attempt as a two-tier card with six fields per tier — no horizontal table scrollbar — and can reopen the complete interactive report and answer review. The navbar badge counts only unseen attempts and clears as soon as the history is opened. Full snapshots, including questions and selected answers, can be exported as JSON and loaded again later; imported attempts are merged by ID with attempts already in the browser and with all newly completed ones. The archive uses `sessionStorage`, is isolated by username and is lost when the tab session ends unless exported |
| **Interface** | Bilingual (Italian/English, `src/uiText.jsx`) with a toggle on the login screen and in the navbar; light/dark theme with a toggle on the login screen and in the navbar; a version/build info modal — styled after [`nxget-app-portal`](../nxget-app-portal)'s, with its own large `AnimatedLogo` — opens both from the navbar's info button and from the version pill in the footer; fully responsive layout (desktop and mobile), footer pinned to the bottom of the viewport on short pages, centered (logo, copyright, version pill). Interface text is not selectable, except for the voucher request code and the full-voucher input where selection/copying is required |

---

## Data source — examgrid.exams

Everything examgrid shows — the exam catalog, the account list, the actual question content behind each exam — lives in [`examgrid.exams`](https://github.com/vlT-vl/examgrid.exams), a separate public repository with no application backend either: plain files served over GitHub's raw content, fetched by `src/dataContext.jsx` on startup.

- **The catalog** — public, one entry per exam with its category, title, description, duration and, when available, the date the exam's question content was last updated.
- **Each exam's actual question content** — protected; only reachable through the app once a candidate has a valid voucher for it.
- **The account list** — protected; each account has a display name, which exams it's allowed to see (used to filter the Home grid), and which of the per-exam settings it's authorized to use — randomizing question order, picking a question range, revealing correct answers while taking an exam (see Features → Exam detail), and reviewing every question's answer after the exam (see Features → Summary).

See [examgrid.exams's own README](https://github.com/vlT-vl/examgrid.exams) for what that repository publishes.

---

## Architecture

```
examgrid/
├── .github/workflows/deploy.yml   # build + deploy to GitHub Pages on push to sourcecode
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx              # view state machine, remote catalog, exam decoration, exam flow
    ├── uiText.jsx            # IT/EN dictionary + LanguageProvider/useLang — every UI string lives here
    ├── dataContext.jsx       # fetches the catalog and account list from examgrid.exams, exposes useData()
    ├── voucherContext.jsx    # voucher request/redeem, local persistence, expiry check, exposes useVoucher()
    ├── lib/
    │   ├── examsCrypto.js     # reads protected data from examgrid.exams (client side)
    │   ├── voucher.js         # voucher request + redemption (client side)
    │   ├── examHistory.js     # per-user sessionStorage archive, JSON validation/merge/export helpers
    │   └── examProgress.js    # per-user sessionStorage snapshot of the exam in progress, resumed after an accidental reload
    ├── css/
    │   ├── styles.css         # the whole app's styles
    │   └── AnimatedLogo.css   # AnimatedLogo.jsx's own stylesheet — still a separate file, see below
    └── components/
        ├── Login.jsx         # full-screen gate, credentials checked against the account list
        ├── ExamgridLogo.jsx  # shared static inline logo (theme-aware, used by Login/footer)
        ├── AnimatedLogo.jsx  # animated logo — icon draws in, wordmark enters letter by letter
        ├── LanguageToggle.jsx # IT/EN switch, used in Login + Navbar
        ├── Navbar.jsx        # centered brand, language/theme/info/history actions, logged-in user, logout
        ├── Home.jsx           # exam card grid + category filter + search
        ├── SearchBar.jsx     # icon that expands into a search field on hover
        ├── ExamCard.jsx
        ├── ExamDetail.jsx     # single card: icon/category/code/description/stats/candidate, voucher gate below, then permission-gated options (range/random/show-answers) once unlocked
        ├── VoucherGate.jsx   # collapsed pill that expands into the voucher panel, cross-fade like nxget-app-portal's, nested inside ExamDetail
        ├── VoucherPanel.jsx  # request code (name prefilled) + redeem field, shown until a valid voucher exists
        ├── VersionModal.jsx  # version/build info (AnimatedLogo, large variant), opened from navbar + footer
        ├── HistoryModal.jsx  # complete per-session attempt table, report restore and JSON import/export
        ├── QuestionCard.jsx
        ├── Timer.jsx / ElapsedTimer.jsx
        ├── Summary.jsx      # score, outcome, downloadable HTML report
        └── AnswerReview.jsx # collapsible, permission-gated per-question answer table, nested inside Summary
```

`App.jsx` owns every piece of app logic (theme, exam flow, catalog decoration) directly — the extracted files are the two Context providers (`uiText.jsx`, `dataContext.jsx`, `voucherContext.jsx`, which structurally have to live outside `App.jsx` since `main.jsx` wraps `App` with all three) and `lib/` (crypto, verify-only). All CSS lives under `src/css/`: `styles.css` covers the whole app (including the voucher panel), `AnimatedLogo.css` is kept as its own file within that same folder — scoped to `AnimatedLogo.jsx` alone, not folded into the shared stylesheet, since its draw-in/letter-in keyframes only ever apply to that one component.

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.3.0 | UI framework |
| `react-dom` | ^19.3.0 | DOM renderer |
| `react-icons` | ^5.7.0 | Icon library |

| Dev | Version | Purpose |
|---|---|---|
| `vite` | ^8.3.1 | Build tool + dev server |
| `@vitejs/plugin-react` | ^6.1.1 | React Fast Refresh + JSX |

---

## Local Development

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
```

---

## Deploy — GitHub Pages

examgrid is a fully static build (`npm run build` → `dist/`), deployed automatically to GitHub Pages by `.github/workflows/deploy.yml` on every push to `sourcecode` (or manually via the workflow's "Run workflow" button).

The workflow installs dependencies, builds, then publishes `dist/` via the official `actions/upload-pages-artifact` + `actions/deploy-pages` actions. `vite.config.js` already hardcodes `base: '/examgrid/'` (this repo is a GitHub Pages *project* page — served at `https://<user>.github.io/examgrid/`, not a `<user>.github.io` root — so every asset URL must carry that sub-path), so the workflow needs no extra build-time env var for it. GitHub Pages itself must be switched to **Source: GitHub Actions** once in the repo settings before the first run can publish anything.

The build step needs a small set of repository secrets to reach examgrid.exams and support login/vouchers, set once under **Settings → Secrets and variables → Actions** and injected into the build as env vars. For local development, the same variables go in a local `.env` (gitignored, never committed) — `npm run dev`/`npm run build` won't be able to reach examgrid.exams without it.

The repo has no committed `package-lock.json` yet, so the workflow runs a plain `npm install` rather than `npm ci`; once a lockfile is committed, switch the workflow to `npm ci` (reproducible, faster) and add `cache: npm` to the `actions/setup-node` step.

---

## Roadmap

Under design for the next phase, evolving the current interface toward the layout of [`nex-tech-hub`](../nex-tech-hub) while staying **backend-free**:

- More exams and categories on [examgrid.exams](https://github.com/vlT-vl/examgrid.exams) as they're written — the catalog, category set and per-account access grow independently of this app's own releases.
- A real per-candidate account system to replace today's fixed accounts on examgrid.exams, likely folded into the voucher issuing flow itself.

---

## Version and Build

| Field | Value |
|---|---|
| Version | 0.1.2 |
| Build | R051026 |
| Updated | 5 October 2026 |

---

## License

examgrid is distributed under a **Proprietary Source-Available License** — Copyright © 2025–2026 Veronesi Lorenzo (vlT). Full text in [`LICENSE`](./LICENSE).

The hosted web app is freely accessible to the public as an end user, no license or account required. The source code itself is source-available **on request**: it may be reviewed for personal study only with the copyright holder's prior authorization. Regardless of how access was obtained, modifying or creating derivative works, redistributing (copying, forking, republishing, repackaging), reverse engineering, and any commercial use all require the copyright holder's prior written permission. All intellectual property, including the name and logos, remains exclusively with Veronesi Lorenzo (vlT). The software is provided "as is", without warranty of any kind.

Governed by Italian law; exclusive jurisdiction: Milan (MI), Italy.

For licensing inquiries or to request access to the source code for study purposes: [veronesilorenzo@outlook.com](mailto:veronesilorenzo@outlook.com)

---

**Copyright © 2026 vlT di Veronesi Lorenzo. All rights reserved.**
