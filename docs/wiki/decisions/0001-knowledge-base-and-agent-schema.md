---
type: Decision
title: "0001 — Knowledge base and agent schema"
description: Adopt docs/wiki as an OKF v0.2 llm-wiki bundle, docs/raw as a sibling immutable source layer, and AGENTS.md as the single schema for every agent.
tags: [decision, wiki, okf, llm-wiki, agents]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: raw-rebuild
    resource: ../../raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
  - id: llm-wiki
    resource: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
    title: Karpathy — LLM Wiki
  - id: okf
    resource: https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md
    title: Open Knowledge Format v0.2
---

# Context

The owner wants documentation that is usable by humans and by every agentic tool (Claude Code, OpenCode, Pi, Gemini, Codex, Cursor). The previous state had separate, partly contradictory instructions (`GEMINI.md` described Tailwind and React Compiler), no shared schema, and a wiki that was OKF-shaped but stale.

# Decision

1. `docs/wiki/` is the knowledge bundle, a sibling of `docs/raw/`. It follows the llm-wiki three-layer pattern: immutable raw sources, an agent-maintained wiki, and a schema.
2. `docs/raw/` is read-only. Agents never edit it.
3. The schema is the repository-root `AGENTS.md`. `CLAUDE.md` and `GEMINI.md` are pointers, not rule copies.
4. The bundle targets OKF v0.2: `type` frontmatter on every concept, reserved `index.md`/`log.md`, bundle-relative links, `draft | stable | deprecated` lifecycle. `docs/raw/` sits outside the bundle and is intentionally frontmatter-free; references to it use `../../raw/...`.
5. Every change runs [The Usual Loop](/rules/workflow.md), which requires a source summary, concept updates, index update, and a log entry in the same PR.
6. Reusable agent behavior lives in `.agents/skills/` (discovered by OpenCode and Pi); `.claude/skills/usual-loop` symlinks the canonical skill for Claude Code.

# Consequences

- One read order and one definition of done for every agent.
- The wiki is a required part of the change, not an afterthought.
- Tool-specific files stay tiny and cannot drift.
- Agents must tolerate unknown page types and broken links per OKF §11, but should fix them when found.
- Documentation-only churn is acceptable when it prevents contradictory instructions.

# Links

- [AGENTS.md](https://github.com/AlexDevsTheWeb/alessandrotorri.it/blob/development/AGENTS.md)
- [The Usual Loop](/rules/workflow.md)
- [Docs audit 2026-10-29](/reviews/2026-10-29-docs-audit.md)
- [Source summary](/sources/2026-10-29-rebuild.md)
