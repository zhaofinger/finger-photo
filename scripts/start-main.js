'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const { spawn } = require('child_process');
const path = require('path');
const electron = require('electron');
const webpack = require('webpack');
const webpackHotMiddleware = require('webpack-hot-middleware');

const startRender = require('./start-render');

const electronConfig = require('../config/webpack.config.electron');
const paths = require('../config/paths');

let electronProcess = null;
let manualRestart = false;
// let hotMiddleware;

function startMain() {
  return new Promise((resolve, reject) => {
    // electronConfig.entry.main = [path.join(__dirname, '../src/main/index.dev.js')].concat(electronConfig.entry.main);

    const compiler = webpack(electronConfig);

    compiler.plugin('watch-run', (compilation, done) => {
      console.log('Main', 'compiling...');
      // hotMiddleware.publish({ action: 'compiling' });
      done();
    });

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log('Main', stats);

      if (electronProcess && electronProcess.kill) {
        manualRestart = true;
        process.kill(electronProcess.pid);
        electronProcess = null;
        startElectron();

        setTimeout(() => {
          manualRestart = false;
        }, 5000);
      }

      resolve();
    });
  });
}

function startElectron() {
  electronProcess = spawn(electron, ['--inspect=5858', path.join(paths.mainBuild, './app.js')]);

  electronProcess.stdout.on('data', data => {
    console.log(data);
  });
  electronProcess.stderr.on('data', data => {
    console.log(data);
  });
  electronProcess.on('close', () => {
    if (!manualRestart) process.exit();
  });
}

function init() {
  Promise.all([startRender(), startMain()])
    .then(() => {
      startElectron();
    })
    .catch(err => {
      console.error(err);
    });
}

init();