import config from "3lib-config";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {initialize, enable} = require('@electron/remote/main');

import * as electron from "electron";
import path from 'path';
import * as process from 'process';

let configArgs = process.argv;
let execPath = path.dirname(electron.app.getPath('exe'));

if (electron.app.isPackaged) {
  if (process.platform != 'win32') {
    execPath = path.join(execPath, '../../..');
    configArgs = configArgs.slice(1);
  }
  else {
    configArgs = configArgs.slice(1);
  }
}
else {
  if (process.platform == 'linux') {
    execPath = path.join(execPath, '../../..')
  }
  else {
    execPath = path.join(execPath, '../../../../../..');
  }
  configArgs = configArgs.slice(2);
}

process.chdir(execPath);
configArgs = ["", "3suite-browser", ...configArgs];
config.init(configArgs);

console.log(`3suite-browser starting on ${process.platform}`);
if (config.get("verbose")) {
  console.log(`Arguments: ${JSON.stringify(configArgs)}`);
  console.log(`Executable directory: ${execPath}`);
  console.log(`App packaged: ${electron.app.isPackaged}`);
}

const createWindow = () => {
  const windowConfig = {
    width: config.get("windowWidth", 800),
    height: config.get("windowHeight", 600),
    webPreferences: { nodeIntegration: true, contextIsolation: false, webSecurity: false },
  };

  console.log(`Creating window ${windowConfig.width}x${windowConfig.height}`);
  if (config.get("verbose")) {
    console.log(`Window config: ${JSON.stringify(windowConfig)}`);
  }

  const win = new electron.BrowserWindow(windowConfig);

  const disableCursor = config.get("disableCursor", false);
  if (disableCursor) {
    console.log("Cursor disabled");
    win.webContents.on('dom-ready', (event)=> {
        let css = '* { cursor: none !important; }';
        win.webContents.insertCSS(css);
        if (config.get("verbose")) {
          console.log("Cursor CSS injected");
        }
    });
  }

  const fullscreen = config.get("fullscreen", true);
  console.log(`Setting fullscreen: ${fullscreen}`);
  win.setFullScreen(fullscreen);

  enable(win.webContents);

  const url = config.get("url");
  console.log(`Loading URL: ${url}`);
  if (config.get("verbose")) {
    console.log(`WebSecurity disabled, nodeIntegration enabled, contextIsolation disabled`);
  }

  win.loadURL(url);

  return win;
};

electron.app.commandLine.appendSwitch('ozone-platform-hint', 'auto');
if (config.get("verbose")) {
  console.log("Chromium flag added: ozone-platform-hint=auto");
}

electron.app.whenReady().then(() => {
  console.log("Electron app ready");
  if (config.get("verbose")) {
    console.log(`Electron version: ${process.versions.electron}`);
    console.log(`Chrome version: ${process.versions.chrome}`);
    console.log(`Node version: ${process.versions.node}`);
  }

  initialize();
  if (config.get("verbose")) {
    console.log("Electron remote initialized");
  }

  let win = createWindow();
});

electron.app.on("window-all-closed", () => {
  console.log("All windows closed, quitting app");
  electron.app.quit();
});
