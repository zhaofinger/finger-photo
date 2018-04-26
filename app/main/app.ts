import { app, BrowserWindow } from 'electron';
// import * as path from "path";
// import * as url from "url";
let mainWindow: Electron.BrowserWindow;
// and load the index.html of the app.
const winUrl = 'http://localhost:3000/';

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });
  mainWindow.loadURL(winUrl);
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
});