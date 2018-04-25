import { app, BrowserWindow } from 'electron';

console.log(app);

let mainWindow = new BrowserWindow({width: 800, height: 600});

mainWindow.loadURL('../render/public/index.html');