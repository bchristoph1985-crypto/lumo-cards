# How do I get Lumo onto my TV?

**Install Lumo Cards in Home Assistant first. Your TV is the display.** This package is not a Samsung app installer or a replacement for the TV's operating system.

## Option A: The TV's browser

Set up your additional Lumo dashboard on a current computer, phone or tablet browser first. Then open the TV browser, visit your known HA address on the home network, sign in normally and open the new dashboard. Save a bookmark if supported.

Check login, graphics, scrolling and remote-control navigation. A supported mouse or keyboard can help with initial setup. Old TV browsers may fail to run today's HA frontend; the cards cannot fix that. We have not validated every model. HA maintains its own [browser targets](https://github.com/home-assistant/frontend/blob/dev/.browserslistrc).

Do not put credentials or tokens in the URL. Do not change firmware, bypass security or reset the TV to try to make a dashboard work.

## Option B: A browser on an HDMI-connected device

An existing computer with a suitable current browser can show HA through the TV's HDMI input. Test existing hardware before buying anything. Other devices require their own checks for browser support, sign-in and input methods. No particular TV app, casting feature or companion app is assumed by Lumo.

Automatic startup, screen sleep and controlling the interface with a TV remote are separate, device-dependent tasks.

## Option C: Our separate Samsung app

The personal TV project has been tested on a 2019 Samsung Q950R with Tizen 5.0. Its native Netflix launch and radio player belong to that separate app. There is no `.wgt` or general Samsung installer in this card package.

Samsung's developer-installation route involves a PC, Developer Mode, a network connection and a signing setup for the target TV. It is a more involved process. See Samsung's guides for [connecting a TV](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html) and [certificates](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html).

The personal setup's external HA startup automation is not a universal startup feature shipped with these cards. Other models and firmware combinations are not certified by this project.

For support, provide the model, year, which option you tried and where it failed. Remove passwords, tokens and full device identifiers from screenshots.
