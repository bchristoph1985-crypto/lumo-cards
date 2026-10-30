# Contributing

This is currently a local candidate. A contribution workflow can be used after its repository is published.

Keep changes scoped to Lumo cards. Do not modify HA globals, patch other card prototypes, request account tokens or introduce arbitrary device-service execution. Entity values, names and custom greetings must be treated as text, never HTML.

Use fictional fixtures and block network/device actions in tests. Keep animation instances independent; stop timers and renderers on removal. Respect reduced motion and label unknown/offline states accurately.

Build with `node build.cjs`; run `npm test` after installing the pinned development dependencies and browser. Include relevant regressions and document limits. Avoid private household screenshots in issues and test output.
