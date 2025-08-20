# 3suite-browser


## usage

to specify arguments during development:

```
npm run start -- -- -- -f config.json5
```

### macOS

unsure about signing still. to specify arguments to a build:

```
open -n 3suite-browser.app --args -f config.json5
```

unsure about folder access--but the app currently can't access folders in Downloads, Desktop, or Documents unless opened directly from inside the app bundle.

```
./3suite-browser.app/Contents/MacOS/3suite-browser -f config.json5
```

### creating a release

ensure that you are in a fully committed state before creating a tag.
run `npm run release` (or `bun run release`) and follow the prompts.

### macOS builds

we currently do not support notarization for macOS builds.
to run mac builds, flag them as safe for gatekeeper with the following command:

`xattr -c <path_to_mac_executable>`
