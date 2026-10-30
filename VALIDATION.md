# Local validation

Version 0.1.0-beta.2, prepared 30 October 2026.

19 browser-test groups passed using fictional HA state fixtures. No observed JavaScript exceptions, external requests or device-service calls. The added regression verifies that graphic edits preserve native HA layout and visibility settings.

Covered: independent companion instances, changing media titles, HTML-as-text protection, pause/offline/missing/unavailable states, compatible entity filters, visual configuration, custom greeting, size/color/personality/bubble options, reduced motion, language and renderer removal/reconnect. Layouts checked at widths 320, 390, 1024, 1440 and 1920 pixels. Documentation links and distribution privacy checks passed.

Build: one self-contained `dist/lumo-cards.js` file plus SHA-256 checksum. Development test runner matched locally available Playwright 1.62.1. GitHub Actions also passed for the initial published code commit: https://github.com/bchristoph1985-crypto/lumo-cards/actions/runs/41078914468.

This exact bundle was manually installed in a separate real HA test dashboard. Its HTTP-served SHA-256 matched the package. Both visual editors showed compatible entities; a player selection and subsequent accent-color edit persisted. Full-width native Sections layout survived saving. Desktop and 390-pixel browser layouts were visually checked. The live test found a lost-layout bug in beta.1, corrected in beta.2. All existing dashboard/resource entries and the two main dashboard configurations were compared before/after and preserved. Private screenshots and entity mappings remain outside this repository.

Limits: live music was idle, so dancing was verified with fixtures rather than starting household playback. Physical phone/TV checks, real HACS installation, representative older browsers and real HACS installation remain pending. The earlier Lumo Lab panel is a different build. These checks do not guarantee compatibility with every HA version or TV browser. MIT licensing for code and robot artwork was approved by the project owner on 30 October 2026.
