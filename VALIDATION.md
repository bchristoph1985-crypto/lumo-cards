# Validation

Version 0.2.0-beta.1, 30 October 2026.

20 core browser-test groups and 16 dashboard-trip groups passed with fictional HA fixtures. No observed JavaScript exceptions, external requests or device-service calls. Core coverage: independent instances, real drawing, text safety, source/permission changes, offline states, all visual options, native layout/visibility preservation, five viewport widths, and renderer cleanup.

Flight coverage: disabled-by-default compatibility, same canvas and renderer while traveling, stable home layout, running 6–10.5-second animations, a stop outside the owner card, pointer pass-through, immediate withdrawal of old song text, dialogs, input cooldown, scrolling, system reduced motion, multiple owners, deletion, navigation, editing, phone bounds, automatic departure and resize. Actual timed flight is exercised, not just CSS declarations.

This exact distribution bundle is manually installed on a separate real HA test dashboard; its HTTP-served SHA-256 matches the package. Live automatic and manual trips, current settings, header controls and the graphical editor are checked there. Private household configuration/screenshots remain outside the repository. Existing cards, user configuration and unrelated dashboards/resources are preserved. No household commands are used as tests.

The traveler prefers empty space but can briefly overlap content in dense layouts; its overlay does not intercept clicks. Geometry discovery is bounded and cannot guarantee every third-party or closed-shadow layout. Small screens have limited free space. These tests are not a guarantee for every HA release or browser.

The prior 0.1 code passed GitHub Actions. Each release’s Actions page records current remote results. Physical phone/TV checks, representative old browsers and actual HACS installation remain unvalidated. The private Samsung app and earlier Lumo Lab panel are separate projects. MIT covers code and original robot artwork.
