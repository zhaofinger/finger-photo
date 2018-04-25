import { BrowserWindow } from 'electron';

const mainWindow = new BrowserWindow({width: 800, height: 600});

mainWindow.loadURL('../render/public/index.html');