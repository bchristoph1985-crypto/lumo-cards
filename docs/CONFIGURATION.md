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
