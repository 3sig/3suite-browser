import config from "3lib-config";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {initialize, enable} = require('@electron/remote/main');

import * as electron from "electron";
import path from 'path';
import * as process from 'process';

let configArgs = process.argv;
console.log(configArgs);

let execPath = path.dirname(electron.app.getPath('exe'));
if (electron.app.isPackaged) {
  if (process.platform != 'win32') { // mac, haven't tested linux
    execPath = path.join(execPath, '../../..');
    configArgs = configArgs.slice(1);
  }
  else { // windows
    configArgs = configArgs.slice(1);
  }
}
else {
  execPath = path.join(execPath, '../../../../../..');
  configArgs = configArgs.slice(2);
}
console.log('Executable directory:', execPath);
process.chdir(execPath);

configArgs = ["", "3suite-browser", ...configArgs];
console.log(configArgs);
config.init(configArgs);

const createWindow = () => {
  const win = new electron.BrowserWindow({
    width: config.get("windowWidth", 800),
    height: config.get("windowHeight", 600),
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  if (config.get("disableCursor", false)) {
    win.webContents.on('dom-ready', (event)=> {
        let css = '* { cursor: none !important; }';
        win.webContents.insertCSS(css);
    });
  }

  win.setFullScreen(config.get("fullscreen", true));
  enable(win.webContents);

  win.loadURL(config.get("url"));
};

electron.app.whenReady().then(() => {
  initialize();
  let win = createWindow();
});
electron.app.on("window-all-closed", () => {
  electron.app.quit();
});
