# MOROway App Development Tools

[![MOROway App](https://img.shields.io/badge/MOROway-App-303030?labelColor=d2781b&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAgMAAAAOFJJnAAAACVBMVEVHcEzd3d0aEBBbVPhdAAAAAXRSTlMAQObYZgAAAGhJREFUGNO9z8EJgDAMheHg0U3sPq9gJpBO0SV691JI35QmghUX8D99gVye0JNoogO6hr+AOnS8YJsojjwUrVg87w+i4w+wg4SasKEQ2WRpODbk+kW60WEJ6hjZ1s4a4897qSS/eMrsAtAOYJYAOeqSAAAAAElFTkSuQmCC&style=for-the-badge)](https://moroway.github.io/moroway-app-dev/)
[![App Info](https://img.shields.io/badge/App-Info-303030?labelColor=d2781b&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAALVBMVEX///9HcEz///////////////////////////////////////////////////9BL+/kAAAADnRSTlNnAANQAczHZj/9PhkqaXhiy9QAAAA4SURBVAjXYxCEAgZBQZkLvAfBDIF37xhRGcJhqYZghoiSkiMqAy6FqYsYhvjLeYVghnTXio2CggBFbhzkAel6fgAAAABJRU5ErkJggg==&style=for-the-badge)](https://moroway.de/moroway-app/app-info/)
[![10 Years](https://img.shields.io/badge/10-Years-303030?labelColor=d2781b&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAn1BMVEVHcEz////////////////////////5KSn5KSn////////////////////////////////////////////////////////////////////////////////////////////////4KCj5KSn5KSn5Nzf////7gYH5KSn5KSn5KSn5KSn5KSn5KSn5KSn////4JCT8lJT5KSn4KCj4JSX8lZVvuPG2AAAALnRSTlMAnUViB9EWIOL6vBTsCZow8KoKefQbAeNnVjv5eB/iAnSAEByJ4dtAcYLoyARwTnjJiQAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAH9JREFUGNNjYEAHSrqa6gwMLGyibCwQAXYOQ0V5JkZWcVZGJhaIgJGKAo8epwCnHo+wEFjAWE2Ak4tZipmLU0RCDCSgb6DHxw2U4ubTY5WFCKjyg43jl5OWBAuYCPKCBXgF9WSwC2BoQTcUw1oMh6E5XVlbSwPFczrK7ErIvgcAVx4OEk6I7TQAAAAASUVORK5CYII=&style=for-the-badge)](https://moroway.github.io/10years/)

## General

This repository provides the build tools for MOROway App. The code here is used to build the ready-to-use versions of MOROway App.

## Platforms

[![Webapp](https://img.shields.io/github/release/MOROway/moroway-app.svg?label=web&labelColor=d2781b&color=303030)](https://app.moroway.de)
[![Microsoft Store](https://img.shields.io/badge/windows-Microsoft%20Store-303030?labelColor=d2781b)](https://www.microsoft.com/p/moroway-app/9nb7t5b9rd91)
[![Play Store](https://img.shields.io/badge/android-Play%20Store-303030?labelColor=d2781b)](https://play.google.com/store/apps/details?id=appinventor.ai_Jonathan_Herrmann_Engel.MOROway)
[![F-Droid](https://img.shields.io/f-droid/v/de.moroway.oc.svg?label=oc&color=303030&labelColor=d2781b)](https://f-droid.org/de/packages/de.moroway.oc/)
[![Snap Store](https://img.shields.io/badge/snap-Snap%20Store-303030?labelColor=d2781b)](https://snapcraft.io/moroway-app)

- The "web"-platform is the main platform and can be used with any modern web browser. The ready-to-use code for the "web"-platform can be found [here](https://github.com/MOROway/moroway-app).<sup>[1](#morowayrepoautoupdate)</sup>
- The "windows"-platform provides the PWA available at Microsoft Store (packaged by [PWABuilder](https://www.pwabuilder.com/)).
- The "android"-platform is used within the Android Wrapper App available at Google Play Store. The wrapper app can be found [here](./wrapper/android). This wrapper app contains a [already built version](./wrapper/android/app/src/main/assets/animation) of the "android"-platform.
- The "oc"-platform is used within the Apache Cordova Android Wrapper App available at F-Droid. The wrapper app can be found [here](https://github.com/MOROway/moroway-app-oc). This wrapper app contains a [already built version](https://github.com/MOROway/moroway-app-oc/tree/master/moroway-app-oc) of the "oc"-platform.
- The "snap"-platform is used within the Apache Cordova Electron Wrapper App available at Ubuntu&apos;s Snap Store. The wrapper app can be found [here](./wrapper/snap). This wrapper app contains a [already built version](./wrapper/snap/www) of the "snap"-platform.

<a name="morowayrepoautoupdate">&#91;1&#93;</a> Auto updated by a [Github Action](https://github.com/MOROway/moroway-app-dev/actions/workflows/moroway-app-tag-and-sync-repos.yml). This action uses code derived from the action [github-action-push-to-another-repository](https://github.com/cpina/github-action-push-to-another-repository/) (License: MIT, by Carles Pina Estany). Furthermore the action [action-create-tag](https://github.com/rickstaa/action-create-tag) is used (License: MIT, by rickstaa).

## Weblate

[![Weblate](https://hosted.weblate.org/widgets/moroway-app/-/287x66-black.png)](https://hosted.weblate.org/engage/moroway-app/)

MOROway App uses Weblate for translations.

## Directories

- app = core files for all platform
  - src/lib: included open source [components](./app/src/lib/README.md).
- app_platforms = platform specific files
  - All directories containing files end with "\_platform".
  - &#91;PLATFORM&#93;/core_excludes: core files not used by platform.
  - &#91;PLATFORM&#93;/sw_excludes: files not used in service worker.
- build = build script
  - Linux-based OS, Bash and common CLI-tools required
  - Usage: bash build.sh &#91; -p PLATFORM &#93; &#91; -d DEBUG &#93;
    - -p (platform):
      - One of the platforms listed above.
      - Omitting builds all.
    - -d (debug):
      - Activate debug mode (-d 1).
      - Prefer conf options prefixed "debug:"
      - Use unencrypted connections (as this mode is designed for a local test setup)
  - conf-files: _conf_ and _conf_local_ (for local override)
    - version: MAJOR.MINOR.PATCH
    - beta: 0 for release / beta off; 1,2,3,… for beta number
    - sharelink: Share link displayed to users when creating a multiplayer game
    - serverlink: Link to server backend without protocol
- out = ready-to-use MOROway App output
  - generated by build script
  - build logs at out/build_logs
  - out/&#91;PLATFORM&#93;/latest = last build (release or beta)
  - out/&#91;PLATFORM&#93;/current = last release build
- wrapper = platform wrapper apps
  - android: [here](./wrapper/android)
  - oc: [Extra repository](https://github.com/MOROway/moroway-app-oc)
  - snap: [here](./wrapper/snap)
