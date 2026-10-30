# Before the first public GitHub release

The implementation is a local release candidate, not a published community release.

## Implemented locally

- Independent companion and status cards; visual editors; no household-specific entity IDs.
- Self-contained distribution bundle, checksum, HACS metadata, source and example dashboard.
- German/English installation and TV guides; configuration and rollback instructions.
- Automated browser checks and a prepared GitHub Actions workflow.

## Still required before public distribution

- Completed: owner approved **Lumo Cards** and the **MIT License** for code and robot artwork on 30 October 2026. The repository license and asset notes record the scope.
- Select/create the actual GitHub repository and publish a specific, reviewed release. Proposed repository name: `lumo-cards`, matching `dist/lumo-cards.js`. No repository URL has been invented in the docs.
- Completed: exact bundle installed manually in a separate real HA test dashboard, both visual editors checked, entity/color selections persisted, and beta.1 updated to beta.2 with matching checksum. Native full-width layout preserved after editing. Previous file and dashboard snapshot retained. Executing rollback remains untested. See `VALIDATION.md`.
- Test physical mobile devices and representative TV routes. Record tested models and browser versions instead of claiming universal TV support.
- Validate installation through a real HACS custom repository. Repository preparation does not mean acceptance into HACS's default catalog.
- Add public screenshots only from fictional data. Never publish household backups, private certificates, access tokens or signed Samsung packages.

Reference structure: [HACS Dashboard plugin requirements](https://hacs.dev/docs/publish/plugin/), [general HACS repository requirements](https://www.hacs.dev/docs/publish/start/).
