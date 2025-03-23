import config from "3lib-config";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {initialize, enable} = require('@electron/remote/main');

import * as electron from "electron";

config.init();
console.log(config.get());

const createWindow = () => {
  const win = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  win.webContents.on('dom-ready', (event)=> {
      let css = '* { cursor: none !important; }';
      win.webContents.insertCSS(css);
  });

  win.setFullScreen(true);
  enable(win.webContents);

  win.loadURL("http://localhost:8000");
};

electron.app.whenReady().then(() => {
  initialize();
  let win = createWindow();
});
electron.app.on("window-all-closed", () => {
  electron.app.quit();
});
