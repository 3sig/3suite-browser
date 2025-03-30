# 3suite-browser


## usage

to specify arguments during development:

```
npm run start -- -- -- -f config2.toml
```

### macOS

unsure about signing still. to specify arguments to a build:

```
open -n 3suite-browser.app --args -f config2.toml
```

unsure about folder access--but the app currently can't access folders in Downloads, Desktop, or Documents unless opened directly from inside the app bundle.

```
./3suite-browser.app/Contents/MacOS/3suite-browser -f config2.toml
```
