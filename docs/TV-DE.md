# Wie kommt Lumo auf meinen Fernseher?

**Lumo Cards wird in Home Assistant installiert. Der Fernseher ist der Bildschirm dafür.** Ob dein TV das direkt anzeigen kann, hängt von seinem Browser und seiner Bedienung ab.

## Welchen Weg meinst du?

| Weg | Was auf dem TV läuft | Einrichtung |
|---|---|---|
| HA-Dashboard im TV-Browser | Dein normales HA-Dashboard mit Lumo-Karten | HA-Adresse öffnen und anmelden; Kompatibilität prüfen |
| Zuspieler am HDMI-Eingang | Ein geeigneter Rechner oder anderes Gerät mit passendem Browser | HA dort öffnen und das Bild am TV anzeigen |
| Unsere private Samsung-App | Eine gesonderte Tizen-App | Entwicklerwerkzeuge, Entwicklermodus und gerätebezogene Signierung |

Die GitHub-Karten machen aus einem Fernseher keine neue Systemoberfläche. Sie installieren weder einen Samsung-Launcher noch einen Netflix-Starter.

## Weg A: Im vorhandenen TV-Browser ausprobieren

1. Lumo zuerst in HA auf einem aktuellen PC-, Smartphone- oder Tablet-Browser einrichten. Dort prüfen, dass dein eigenes zusätzliches Dashboard funktioniert.
2. Am TV dessen Browser öffnen. TV und HA müssen über dein vorhandenes Heimnetz erreichbar sein.
3. Deine bekannte Home-Assistant-Adresse aufrufen und normal anmelden. Kein Token und kein Passwort gehören in die URL oder in Kartencode.
4. Das zusätzliche Lumo-Dashboard öffnen und, falls der Browser es unterstützt, als Lesezeichen speichern.
5. Prüfen: Anmeldung, Figur, Layout, Scrollen und Bedienung der Karten. Eine unterstützte Maus/Tastatur kann beim ersten Test helfen. Eine reine Fernbedienungsbedienung ist nicht für alle Modelle bestätigt.
6. Musik wie gewohnt am eigenen Musikgerät starten. Lumo reagiert auf dessen HA-Status; die Figur selbst spielt keinen Ton ab.

**Alte TV-Browser können schon an der heutigen HA-Oberfläche scheitern.** Die Karten umgehen diese Grenze nicht. Falls HA leer bleibt, die Anmeldung nicht funktioniert oder die Grafik fehlt: keine Firmwareänderung, keine Sicherheitsumgehung und kein Zurücksetzen versuchen. Das genaue Modell und den Fehler notieren.

HA pflegt eine eigene Browser-Zielliste; daraus folgt keine Freigabe jedes Smart-TV-Browsers. [Offizielle Frontend-Browserkonfiguration](https://github.com/home-assistant/frontend/blob/dev/.browserslistrc).

## Weg B: Ein separates Gerät über HDMI

Wenn der TV-Browser nicht geeignet ist, kann ein bereits vorhandener Rechner mit aktuellem Browser am HDMI-Eingang das Dashboard darstellen. HA und Lumo laufen dann im Browser dieses Geräts; der TV zeigt dessen Bild.

Vor einem Kauf möglichst mit vorhandener Hardware testen. Bei anderen Zuspielern erst prüfen, ob sie einen geeigneten Browser, die Anmeldung und die gewünschte Bedienung tatsächlich unterstützen. Eine bestimmte TV-App, Casting-Funktion oder Companion-App wird durch dieses Projekt nicht vorausgesetzt oder zugesagt.

Fernbedienung, automatischer Start, Bildschirmruhe und HDMI-Steuerung sind zusätzliche, geräteabhängige Themen. Sie funktionieren nicht allein deshalb, weil die Oberfläche auf dem TV sichtbar ist.

## Weg C: Unsere private Samsung-App

Unsere bestätigte private Referenz ist ein Samsung Q950R von 2019 mit Tizen 5.0. Die dortige App besitzt unter anderem einen nativen Netflix-Start und einen eigenen Radioplayer. Sie ist ein separates Projekt; das Lumo-Kartenpaket enthält keine `.wgt`-Datei.

Für den offiziellen Entwicklerweg werden PC und TV im selben Netz verbunden, der Entwicklermodus freigeschaltet und eigene Samsung-Zertifikate für den Ziel-TV erstellt. Das bedeutet deutlich mehr Vorbereitung als eine Dashboard-Karte. Eine beliebige signierte Datei lässt sich nicht auf jedem fremden Fernseher installieren. [Samsung: TV-Verbindung](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html), [Samsung: Zertifikate](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html).

Es gibt in diesem Community-Paket keinen allgemeinen Samsung-Installer. Andere Samsung-Modelle und Firmwares wurden hier nicht freigegeben. Keine Firmware flashen, kein Rooting, kein Servicemenü und keine bestehenden Apps löschen.

## Startet das beim Einschalten automatisch?

Nicht durch die Karten allein. Auf unserem privaten Samsung-Aufbau funktioniert ein externer Start über HA. Das ist keine übertragbare Zusicherung für andere TVs und keine fertige Einschaltautomation in diesem Paket.

## Welche Daten helfen bei einer Frage?

Modell, Baujahr, verwendeter Weg (TV-Browser/HDMI/Samsung-App), gegebenenfalls Browser-/Tizen-Version und der konkrete Schritt, an dem es nicht weitergeht. Screenshots ohne Passwörter, Tokens oder vollständige Gerätekennungen teilen.
