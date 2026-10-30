# Before the first public GitHub release

The first public source beta is available at https://github.com/bchristoph1985-crypto/lumo-cards. The checklist distinguishes completed checks from remaining device/installation work.

## Implemented locally

- Independent companion and status cards; visual editors; no household-specific entity IDs.
- Self-contained distribution bundle, checksum, HACS metadata, source and example dashboard.
- German/English installation and TV guides; configuration and rollback instructions.
- Automated browser checks and a prepared GitHub Actions workflow.

## Still required before public distribution

- Completed: owner approved **Lumo Cards** and the **MIT License** for code and robot artwork on 30 October 2026. The repository license and asset notes record the scope.
- Completed: public repository `bchristoph1985-crypto/lumo-cards`, exact bundle read back with matching SHA-256, first GitHub Actions run successful. Versioned beta release: `v0.1.0-beta.2`.
- Completed: exact bundle installed manually in a separate real HA test dashboard, both visual editors checked, entity/color selections persisted, and beta.1 updated to beta.2 with matching checksum. Native full-width layout preserved after editing. Previous file and dashboard snapshot retained. Executing rollback remains untested. See `VALIDATION.md`.
- Test physical mobile devices and representative TV routes. Record tested models and browser versions instead of claiming universal TV support.
- Validate installation through a real HACS custom repository. Repository preparation does not mean acceptance into HACS's default catalog.
- Add public screenshots only from fictional data. Never publish household backups, private certificates, access tokens or signed Samsung packages.

Reference structure: [HACS Dashboard plugin requirements](https://hacs.dev/docs/publish/plugin/), [general HACS repository requirements](https://www.hacs.dev/docs/publish/start/).
