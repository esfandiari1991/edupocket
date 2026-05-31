# CI Workflow Template

GitHub rejected direct workflow creation from the current OAuth token because it does not have `workflow` scope. Keep this template as the intended CI setup.

When a GitHub token with workflow permission is available, create `.github/workflows/ci.yml` with:

```yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main
      - feature/edupocket-final-by-codex
      - "codex/**"

jobs:
  verify:
    name: Lint, Typecheck, Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.28.2

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm check

      - name: Build
        run: pnpm build
```
