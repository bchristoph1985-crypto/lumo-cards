# Install Lumo Cards in your Home Assistant

Early beta 0.1.0-beta.2. [Download the GitHub source package](https://github.com/bchristoph1985-crypto/lumo-cards/archive/refs/heads/main.zip). Not in the default HACS catalog; HACS installation is not yet tested.

## Manual test setup

1. Back up any previous Lumo file and the dashboard you plan to edit. Use a **new dashboard** for your first test.
2. Copy `dist/lumo-cards.js` into `www/lumo/` in your HA configuration directory.
3. Register `/local/lumo/lumo-cards.js?v=0.1.0-beta.2` as a JavaScript module in dashboard resources. Preserve an existing YAML-managed resource setup instead of switching its mode.
4. Reload HA in the browser. Load only this bundle, not an older standalone Lumo card at the same time.
5. Add **Lumo · Companion** or **Lumo · Status** in the card picker. Their visual editors let you choose your own entities and appearance.

The bundle includes its artwork; no other runtime library is needed. If `www` was newly created, plan any required HA restart separately. Never put secrets there. See the [official resource guide](https://contributors.home-assistant.io/frontend/custom-ui/resources/).

## Choose your own setup

The companion has an optional music player, name, language, accent color, size, personality, greeting, speech bubble and reduced-motion setting. It floats without a music player. When the chosen player reports `playing`, it dances; the card itself produces no sound.

The status card supports sensors/binary sensors, climate entities, weather, lights and media players. Choose the content type first. Changing it clears the old entity selection. Missing data is labelled; no fallback measurements are invented. Unconfigured cards show a setup prompt. Simply leave out cards you do not need.

Status cards only display data and optionally open existing HA details. Use native HA cards alongside them for direct controls. No separate HA tokens or backend integration are needed.

## A separate full dashboard

Create a new empty dashboard with its own path, such as `lumo-test`. Leave your main dashboard and default selection unchanged. Open the new dashboard's raw configuration editor and paste `examples/dashboard-starter.yaml`. The template is for a new dashboard; save any existing content before replacing it.

Open each card's visual editor to select your own devices. The template deliberately contains no household-specific entities. Native HA sections let you move, add and remove cards and adapt their arrangement to available width.

## Update or remove

Keep the previous bundle, replace the file, change the version suffix in its resource URL and reload the browser. Restore that file and URL if needed. To remove Lumo, remove only the cards/new dashboard and its resource registration. Preserve unrelated resources and dashboards.

For a television, see [the TV guide](TV-EN.md). The Samsung developer-app installation is a separate path.
