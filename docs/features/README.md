# Feature Documentation

This directory contains architectural documentation for major features.

## Purpose

Feature docs provide:
- Visual flow diagrams (Mermaid)
- User experience descriptions
- Technical implementation details
- Decision points and edge cases

**Target audience:** Product managers, developers, and stakeholders who need to understand how features work.

## When to Create Feature Docs

Create documentation when a feature:
- Has complex state management or flows
- Involves multiple components or systems
- Has non-obvious behavior or edge cases
- Requires PM/stakeholder understanding
- You'll need to explain it 2+ times

## Template

Use `TEMPLATE.md` as the starting point for all feature documentation. The template includes:
- Mermaid flow diagrams with color-coded node styles
- User experience sections for PM clarity
- Technical details for developers
- Decision points and edge cases

## Naming Convention

- Use kebab-case: `dual-cache-system.md`
- Be descriptive but concise
- Match feature name in code when possible

## Examples

Good feature doc names:
- `authentication-flow.md`
- `real-time-notifications.md`
- `offline-sync-strategy.md`

## Maintenance

Review feature docs when:
- Implementation changes significantly
- Edge cases are discovered
- User feedback reveals confusion
- Feature is deprecated (then archive with `features-` prefix)

