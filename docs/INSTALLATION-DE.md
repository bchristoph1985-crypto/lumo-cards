# Lumo Cards in deinem Home Assistant

Frühe Beta 0.2.0-beta.1. [GitHub-Quellpaket herunterladen](https://github.com/bchristoph1985-crypto/lumo-cards/archive/refs/heads/main.zip). Noch nicht im HACS-Standardkatalog; die HACS-Installation ist noch nicht getestet.

Du kannst nur den Roboter einbauen oder ein zusätzliches Dashboard mit den passenden Karten anlegen. Dein bisheriges Dashboard muss dafür nicht verändert werden.

## Manuelle Testinstallation

1. Sichere eine eventuell bereits vorhandene Lumo-Ressource und die Konfiguration der Ansicht, die du bearbeiten möchtest. Für den ersten Test ein **neues Dashboard** verwenden.
2. Kopiere `dist/lumo-cards.js` nach `www/lumo/lumo-cards.js` in deiner HA-Konfiguration. Die Datei enthält alle benötigten Grafiken bereits; keine weitere Datei oder externe Bibliothek ist nötig.
3. Falls der Ordner `www` erstmals angelegt wird, ist laut HA-Dokumentation ein HA-Neustart nötig. Diesen vorher bewusst einplanen. Bei unserer lokalen Vorbereitung wurde kein HA neu gestartet.
4. Unter Einstellungen → Dashboards → Ressourcen eine Ressource hinzufügen: URL `/local/lumo/lumo-cards.js?v=0.2.0-beta.1`, Typ **JavaScript-Modul**. Bei einer YAML-verwalteten Ressourcenliste den vorhandenen Verwaltungsweg nutzen.
5. HA im Browser vollständig neu laden. Genau eine Version der Lumo-Ressource laden, keine alte Einzelkarte zusätzlich registrieren.

Die Datei liegt anschließend unter `/local/`. Dort dürfen keine Passwörter, Tokens oder privaten Konfigurationsdateien abgelegt werden: Ressourcen sind ohne Anmeldung abrufbar. [Offizielle HA-Ressourcenanleitung](https://contributors.home-assistant.io/frontend/custom-ui/resources/).

## Nur die Figur

Im neuen Testdashboard „Karte hinzufügen“ öffnen und **Lumo · Companion** wählen. Die grafische Einrichtung bietet Name, Musikgerät, Sprache, Akzentfarbe, Größe, Temperament, eigene Begrüßung, Sprechblase und reduzierte Bewegung.

Ein Musikgerät ist optional. Ohne Musikgerät schwebt Lumo trotzdem. Bei gemeldeter Wiedergabe tanzt er; Musiktitel erscheinen als Text. Er spielt selbst keinen Ton ab und hört nicht zu.

Das Beispiel `examples/robot-only.yaml` ist für den manuellen Karteneditor gedacht. Für normale Anpassungen ist kein JavaScript nötig.

## Statuskarten

Über „Karte hinzufügen → Lumo · Status“ zuerst den Inhalt wählen: Sensor, Raumklima, Wetter, Licht oder Musik. Danach erscheinen die dazu passenden eigenen Entitäten in der Auswahl. Beim Wechsel des Inhalts wird die vorherige Geräteauswahl geleert.

Nicht konfigurierte Karten zeigen einen Einrichtungshinweis. Fehlende oder nicht verfügbare Quellen werden gekennzeichnet; es gibt keine erfundenen Ersatzwerte. Nicht benötigte Karten einfach weglassen oder entfernen.

Die Karten zeigen Zustände. Optional öffnet Antippen den vorhandenen HA-Detaildialog. Sie senden keine eigenen Gerätebefehle; für direkte Schalter können zusätzlich native HA-Karten verwendet werden. Bestehende HA-Berechtigungen bleiben maßgeblich.

## Komplettes zusätzliches Dashboard

1. Unter Einstellungen → Dashboards ein neues, leeres Dashboard anlegen. Einen eigenen Pfad wie `lumo-test` verwenden; das Hauptdashboard unverändert lassen und keine Standardansicht umstellen.
2. Im neuen Dashboard den Konfigurationseditor öffnen und `examples/dashboard-starter.yaml` übernehmen. Vor einem Ersetzen bereits vorhandenen Inhalts zuerst sichern; die Vorlage ist für ein neues Dashboard gedacht.
3. Die Karten einzeln grafisch bearbeiten und eigene Quellen auswählen. Es sind absichtlich keine Geräte aus einem bestimmten Haushalt eingetragen.
4. Karten verschieben, hinzufügen oder entfernen. Die Vorlage nutzt native HA-Abschnitte, damit sie sich nach der verfügbaren Breite anordnen.

Die Vorlage ist ein Startpunkt für den Look; sie ist kein Nachbau aller Funktionen unseres privaten Dashboards. Eine Energiekarte lässt sich beispielsweise als Sensorkarte mit deinem tatsächlichen Leistungs- oder Verbrauchssensor ergänzen; Kosten werden nicht erfunden oder automatisch berechnet.

## Updates und Rückweg

Vorherige Datei sichern, neue Version ersetzen und den Versionszusatz der Ressourcen-URL ändern. Anschließend den Browser neu laden. Bei Problemen die gesicherte Datei und vorherige Ressourcen-URL wiederherstellen.

Zum vollständigen Rückbau nur die neu angelegten Lumo-Karten beziehungsweise das zusätzliche Dashboard und den zugehörigen Ressourceneintrag entfernen. Andere Ansichten und Ressourcen erhalten. Keine vollständige HA-Wiederherstellung für eine einzelne Karte.

## Fernseher

Lies [So kommt das Dashboard auf den Fernseher](TV-DE.md). Die Anzeige eines HA-Dashboards und die Installation unserer speziellen Samsung-App sind unterschiedliche Wege.
