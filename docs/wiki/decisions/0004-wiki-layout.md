---
type: Decision
title: "0004 — Wiki layout under docs/wiki"
description: Move the OKF bundle to docs/wiki as a sibling of docs/raw, and enforce a fixed section layout for generated knowledge.
tags: [decision, wiki, structure, okf, organization]
status: stable
generated: { by: opencode/deepseek-v4.1-flash, at: 2026-10-29T00:00:00Z }
sources:
  - id: raw-rebuild
    resource: ../../raw/2026-10-29-rebuild.md
    title: Personal Website Rebuild (raw, immutable)
---

# Context

The first foundation pass put the OKF bundle at the root of `docs/`, with `docs/raw/` nested inside it. That mixed the two llm-wiki layers and made it unclear which files were sources and which were generated knowledge. The owner wants the wiki to be a folder named `wiki` under `docs/`, a sibling of `raw/`, and wants the wiki kept organized as the project grows.

The loop also needs to accept **GitHub issues** as inputs, not only files dropped in `docs/raw/`.

# Decision

1. `docs/raw/` and `docs/wiki/` are siblings. `docs/wiki/` is the OKF v0.2 bundle root.
2. The wiki keeps a fixed layout:
   - root: `index.md`, `log.md`, `overview.md`, `rebuild-plan.md` only;
   - sections: `concepts/`, `rules/`, `decisions/`, `sources/`, `reviews/`, each with an `index.md`.
3. New knowledge goes into the matching section; no loose pages at the wiki root.
4. Raw sources stay immutable and frontmatter-free. References from the wiki use `../../raw/<file>`.
5. The usual loop accepts either a raw file or a GitHub issue. An issue gets a `sources/YYYY-MM-DD-gh-issue-<n>.md` summary with the issue URL in `sources[].resource`.
6. `AGENTS.md`, the workflow playbook, and the usual-loop skill describe the same layout.

# Consequences

- The source layer and the generated layer are unambiguous.
- OKF conformance applies to `docs/wiki/` only; raw files cannot break it.
- Agents have one obvious destination for every page type.
- The wiki stays navigable through root and section indexes.
- Any future restructure needs a new decision record and a link migration.

# Links

- [The Usual Loop](/rules/workflow.md)
- [Decision 0001 — Knowledge base and agent schema](/decisions/0001-knowledge-base-and-agent-schema.md)
- [Knowledge bundle index](/index.md)
- [Source summary](/sources/2026-10-29-rebuild.md)
