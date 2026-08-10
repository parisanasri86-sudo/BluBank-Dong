# Repository Guidelines

## Project Purpose

BluBank Dong — UX/UI Case Study is an existing portfolio case study about redesigning and improving "Dong", BluBank's shared-expense and collaborative payment experience. The goal is not to redesign the website from scratch. Preserve the current visual identity while progressively improving it into a polished, interactive, portfolio-grade case study suitable for international Product Design and UX/UI job applications.

The final deliverable must remain publishable as a website through GitHub Pages.

## Existing Design Is the Baseline

Treat the current implementation as the visual baseline. Do not arbitrarily change primary colors, typography, existing copy, imagery, illustration style, art direction, or visual personality. Major visual changes require explicit approval.

Improvements may target hierarchy, spacing, consistency, responsive behavior, accessibility, storytelling, interaction, motion, layout, component reuse, and code architecture.

## Project Structure & Module Organization

The primary page is `index.html`, which is self-contained and works offline. `BluBank Dong Case Study.dc.html` appears to be an exported or alternate case-study artifact; keep it unless explicitly replacing the export. Shared images live in `assets/` and currently use names such as `img-01.png`, `img-02.png`, and `img-03.png`. `README.md` contains local viewing and GitHub Pages publishing notes.

There is no dedicated `src/`, `tests/`, or build output directory. Keep the structure minimal unless the project grows enough to justify extraction.

## Case Study Design System

There is currently no complete Figma design system for the case-study website. Do not assume Figma Style Guide or Components pages are the source of truth; those components were primarily created for BluBank app screens and are incomplete.

Infer and progressively formalize the case-study design system from the existing website. Reuse observed colors, typography, spacing, grid, radius, shadows, component patterns, layout patterns, and motion patterns. Prefer reusable tokens and components over duplicated hard-coded styles, but avoid over-engineering.

## Figma Role

A Figma file exists and may be connected separately. Use Figma primarily as a reference for BluBank application UI, redesigned product screens, user flows, interaction flows, product components, and visual assets. Do not treat the incomplete Figma component library as the case-study website source of truth.

## Four Required States

The entire case study must work from one shared implementation in all four combinations:

- English + Light
- English + Dark
- Persian + Light
- Persian + Dark

Never create four separate component or page versions unless technically unavoidable. Use shared components and tokens with `theme = light | dark`, `locale = en | fa`, and `direction = ltr | rtl`. Every meaningful UI change must be checked in all four states. Persian layouts must support RTL correctly.

## Content Integrity

Never invent research findings, user quotes, participant numbers, usability-test results, business metrics, adoption metrics, statistics, or outcomes. If evidence or content is missing, flag it as `CONTENT NEEDED` instead of fabricating information.

Do not rewrite existing case-study copy without a clear UX/storytelling reason or explicit instruction.

## UX Storytelling Priority

This is a Product Design / UX case study, not a visual-effects demo. Recruiters and hiring managers may scan quickly. The first 10-15 seconds should clearly communicate what the project is, the core problem, the designer's role, the proposed solution/value, and why the project is worth exploring.

Use strong hierarchy and progressive disclosure for detailed content. Avoid long, undifferentiated text blocks.

## Interaction and Motion Direction

Contemporary portfolio patterns are allowed when they improve storytelling or comprehension: subtle 3D depth, layered compositions, scroll-triggered storytelling, sticky narrative sections, sparing parallax, animated device mockups, meaningful micro-interactions, interactive product flows, smooth theme transitions, before/after interactions, and progressive disclosure.

Do not add animation or 3D purely for decoration. Respect `prefers-reduced-motion`, prioritize performance, and avoid unnecessary heavy dependencies.

## Build, Test, and Development Commands

No package manager or build system is configured.

```bash
open index.html
```

Opens the case study directly in a browser on macOS.

```bash
python3 -m http.server
```

Serves the repository at `http://localhost:8000` for local browser testing.

## Coding Style & Naming Conventions

Use plain HTML, CSS, and JavaScript unless a build step is deliberately introduced. Match the existing inline, single-page style in `index.html`. Prefer 2-space indentation for nested HTML/CSS blocks, descriptive class names, readable section comments for large page regions, and lowercase sequential asset names such as `assets/img-04.png`.

If dependencies or tooling become necessary, document install and run commands in `README.md` and update this guide.

## Testing Guidelines

There is no automated test suite. Before submitting changes, manually verify that `index.html` opens without console errors, images load correctly, offline viewing still works when expected, and layouts behave on desktop and mobile widths.

For meaningful UI changes, verify all four required states: English Light, English Dark, Persian Light, and Persian Dark. Check RTL behavior for Persian and respect reduced-motion settings for animated work.

## Working Method

Work incrementally. Do not perform a full redesign or large refactor without approval. For major tasks: inspect the current implementation, explain findings, propose changes, identify risks to existing design or behavior, wait for approval when the task is audit/planning only, implement approved changes, and verify relevant states and responsive behavior.

Preserve working functionality whenever possible.

## Commit & Pull Request Guidelines

Git history is not available in this workspace, so use clear, imperative commit messages such as `Update case study imagery` or `Fix mobile section spacing`. Pull requests should include a short summary, screenshots for visual changes, verification notes for the four required states when relevant, linked issues if available, and publishing notes. Mention whether both `index.html` and `BluBank Dong Case Study.dc.html` should be updated.

## Deployment Notes

The README describes GitHub Pages deployment from the repository root. Keep `index.html` at the root so Pages can serve it as the default page.

## Final Quality Target

The final website should feel premium, contemporary, interactive, visually sophisticated, recruiter-friendly, portfolio-grade, and internationally competitive while still clearly feeling like the same BluBank Dong case study.