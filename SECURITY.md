# Security and privacy

Lumo Cards receives selected entity states from the existing Home Assistant frontend. It does not ask for HA account tokens, send device-service calls, record audio or contact an external service. Status-card taps can request the normal HA more-info dialog; subsequent user actions in that dialog belong to HA's existing controls.

All entity values, greetings and names are rendered as plain text. A card's visibility is not an authorization boundary. HA permissions and the authenticated session remain authoritative.

Do not place credentials in card configuration, greetings, screenshots or `www/`. When reporting a problem, remove private data and provide only the affected card configuration and relevant error, not a full HA backup.

No public security-reporting address has been configured while this project is a local candidate. Add an appropriate repository reporting route before release; do not invent a contact address.
