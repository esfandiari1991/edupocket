# Versioning

EduPocket uses simple semantic versioning for production releases.

- Patch releases fix bugs, polish UI, improve SEO, or update content without changing the public architecture.
- Minor releases add new public sections, workflows, content systems, or major interaction surfaces.
- Major releases are reserved for breaking structural changes such as a new CMS, auth system, payment layer, or routing model.

Release checklist:

1. Keep the working tree clean before starting a release.
2. Run `pnpm lint`, `pnpm check`, and `pnpm build`.
3. Run `BASE_URL=http://localhost:3001 pnpm verify:routes` against a production local server.
4. Update `CHANGELOG.md` and bump `package.json`.
5. Commit with a clear release-oriented message.
6. Tag the release as `vX.Y.Z`.
7. Push the branch and tag to GitHub.
8. Deploy production and record the live URL in `DEPLOYMENT_REPORT.md`.
