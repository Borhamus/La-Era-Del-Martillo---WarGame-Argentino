# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | C:\Users\Administrator\.claude\skills\judgment-day\SKILL.md |
| When writing Go tests, using teatest, or adding test coverage | go-testing | C:\Users\Administrator\.claude\skills\go-testing\SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | C:\Users\Administrator\.claude\skills\skill-creator\SKILL.md |
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | C:\Users\Administrator\.claude\skills\branch-pr\SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | C:\Users\Administrator\.claude\skills\issue-creation\SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### judgment-day
- Launch TWO judge sub-agents in parallel (async), never sequential — orchestrator NEVER reviews code itself
- Inject Project Standards (from skill registry) into BOTH judge prompts AND the fix agent prompt
- Classify every WARNING: "real" = triggers bug/security under normal usage; "theoretical" = requires contrived scenario → report as INFO, do NOT fix
- Fix Agent is a SEPARATE delegation — never reuse a judge as the fixer
- APPROVED = 0 confirmed CRITICALs + 0 confirmed real WARNINGs (theoretical warnings and suggestions may remain)
- After 2 fix iterations, ASK user before continuing — never auto-escalate
- Never push/commit after fixes until re-judgment completes
- Suspect findings (only one judge) are reported but NOT automatically fixed

### go-testing
- Use table-driven tests: `[]struct{ name, input, expected string; wantErr bool }` with `t.Run(tt.name, ...)`
- Test Bubbletea models by calling `m.Update()` directly for state transition assertions
- Use `teatest.NewTestModel()` for full interactive TUI flow tests
- Use golden files for visual output (`testdata/*.golden`); update with `-update` flag
- Mock system deps via structs (e.g. `SystemInfo`); use `t.TempDir()` for file operations
- Test both success and error paths; use `(err != nil) != tt.wantErr` idiom
- Run: `go test ./...`, `-v` verbose, `-cover` coverage, `-short` skip integration

### skill-creator
- Structure: `skills/{name}/SKILL.md` (required) + `assets/` + `references/` (optional)
- Frontmatter required: `name`, `description` (include Trigger), `license: Apache-2.0`, `metadata.author: gentleman-programming`, `metadata.version`
- `references/` must point to LOCAL file paths — never web URLs
- Start SKILL.md content with Critical Patterns — the most important rules AI must know
- Do NOT create for one-off tasks, trivial patterns, or when docs already exist
- After creating, add entry to `AGENTS.md`

### branch-pr
- Every PR MUST link an approved issue (`Closes #N` / `status:approved` label) — no exceptions
- Every PR MUST have exactly one `type:*` label
- Branch naming regex: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- Commit format: `type(scope): description` — conventional commits only, no `Co-Authored-By` trailers
- PR body must include: `Closes #N`, PR type checkbox, summary bullets, changes table, test plan
- Run `shellcheck scripts/*.sh` on any modified shell scripts before pushing

### issue-creation
- Blank issues disabled — MUST use Bug Report or Feature Request template
- Every issue gets `status:needs-review` automatically; maintainer MUST add `status:approved` before any PR
- Questions go to Discussions, NOT issues
- Search for duplicates with `gh issue list --search "keyword"` before creating
- Bug report required fields: Bug Description, Steps to Reproduce, Expected/Actual Behavior, OS, Agent/Client, Shell
- Feature request required fields: Problem Description, Proposed Solution, Affected Area

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| GEMINI.md | C:\Users\Administrator\Desktop\Wargame - Keitros - La era de la Martillo\GEMINI.md | Project-level Gemini CLI config (currently empty) |
