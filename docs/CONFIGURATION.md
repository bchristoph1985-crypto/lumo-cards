# Card configuration

Use the visual editor for everyday changes. YAML is optional.

## Companion

| Field | Default | Choices / meaning |
|---|---|---|
| `type` | required | `custom:lumo-companion-card` |
| `entity` | empty | Optional `media_player` selected from your HA |
| `name` | `Lumo` | Up to 60 characters |
| `language` | `auto` | `auto`, `de`, `en`; auto follows HA language |
| `color` | `aqua` | `aqua`, `violet`, `amber` |
| `size` | `medium` | `small`, `medium`, `large`; constrained by available card width |
| `mood` | `lively` | `quiet`, `lively`, `playful` |
| `show_bubble` | `true` | Show or hide the speech bubble |
| `greeting` | empty | Optional plain text, up to 240 characters; no HTML or templates |
| `roaming` | `false` | Allow optional trips across the active dashboard |
| `roaming_area` | `cards` | `cards` (visit card edges) or `edges` |
| `roaming_frequency` | `normal` | `relaxed`, `normal`, `often`; rest between trips |
| `reduced_motion` | `false` | Reduce movement; system reduced-motion preferences also apply |

The optional player controls the dance state, not audio output. Names, greetings and media titles are plain text. The character does not use a microphone or audible speech.

## Status

| Field | Default | Choices / meaning |
|---|---|---|
| `type` | required | `custom:lumo-status-card` |
| `kind` | `sensor` | `sensor`, `climate`, `weather`, `light`, `media` |
| `entity` | empty | Select your own compatible entity |
| `name` | entity name | Optional custom label |
| `language` | `auto` | `auto`, `de`, `en` |
| `color` | `aqua` | `aqua`, `violet`, `amber` |
| `open_more_info` | `true` | Open the existing HA detail dialog when tapped |

Domains: sensor cards accept `sensor` and `binary_sensor`; the other kinds accept `climate`, `weather`, `light` and `media_player` respectively. Switching kind in the editor clears the old entity selection.

No secrets, arbitrary service commands, JavaScript or Jinja templates are accepted as card options. HA's regular permissions still apply. Additional direct controls can be native HA cards placed beside Lumo.

## Dashboard trips (0.2 beta)

Enable **Fly across the dashboard** in the companion visual editor. Choose the area and frequency. The card also has **Start a trip / Come back** controls. Flight is off for existing configurations by default. The starter examples opt in.

Lumo moves the original Canvas into a temporary decorative overlay, visits the visible dashboard, and returns home. The home space stays reserved so the layout does not jump. Only one character travels at a time; other companion cards stay in place. The overlay accepts no pointer input. New song or unavailable-state text is refreshed immediately.

Clicks, scrolling, keyboard navigation, resizing, visible dialogs and edit mode return Lumo home or prevent departure. Reduced motion disables travel. The traveler is removed when its card disconnects or the URL changes. Normal rest is roughly 40 seconds; relaxed roughly 75, often roughly 20, with small variations. Trips take 6–10.5 seconds per leg and pauses vary.

The route prefers empty space near card borders. In dense layouts it may briefly overlap content; pauses are shortened and the floating speech bubble is suppressed at crowded stops. This is decorative, not a way to operate other cards. Geometry sampling has a fixed budget; not every nested third-party layout can be discovered. Native Sections, Masonry and Panel view containers are supported; closed shadow roots and embedded third-party dashboards are not guaranteed. Phones use a smaller traveler and may have little free space.
