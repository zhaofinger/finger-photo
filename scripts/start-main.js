'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const { spawn } = require('child_process');
const path = require('path');
const electron = require('electron');
const webpack = require('webpack');
const webpackHotMiddleware = require('webpack-hot-middleware');
const chalk = require('chalk');

const startRender = require('./start-render');

const electronConfig = require('../config/webpack.config.electron');
const paths = require('../config/paths');

let electronProcess = null;
let manualRestart = false;
let hotMiddleware;

// 输出日志stats
function logStats(proc, data) {
  let log = '';

  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`);
  log += '\n\n';

  if (typeof data === 'object') {
    data.toString({
      colors: true,
      chunks: false
    }).split(/\r?\n/).forEach(line => {
      log += '  ' + line + '\n';
    });
  } else {
    log += `  ${data}\n`;
  }
  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n';
  console.log(log);
}

// electron 日志打印
function electronLog(data, color) {
  let log = '';
  data = data.toString().split(/\r?\n/);
  data.forEach(line => {
    log += `  ${line}\n`;
  });
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold('┏ Electron -------------------') +
      '\n\n' +
      log +
      chalk[color].bold('┗ ----------------------------') +
      '\n'
    );
  }
}

// 启动electron
function startElectron() {
  electronProcess = spawn(electron, ['--inspect=5858', path.join(paths.mainBuild, './app.js')]);

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue');
  });
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red');
  });
  electronProcess.on('close', () => {
    if (!manualRestart) process.exit();
  });
}


// 主进程启动
function startMain() {
  return new Promise((resolve, reject) => {
    // electronConfig.entry.main = [path.join(__dirname, '../src/main/index.dev.js')].concat(electronConfig.entry.main);
    const compiler = webpack(electronConfig);
    hotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
      heartbeat: 2500
    });

    compiler.plugin('watch-run', (compilation, done) => {
      logStats('Main', chalk.white.bold('compiling...'))
      hotMiddleware.publish({ action: 'compiling' });
      done();
    });

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        return;
      }

      logStats('Main', stats);

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

function init() {
  Promise.all([startRender(hotMiddleware), startMain()])
    .then(() => {
      startElectron();
    })
    .catch(err => {
      console.error(err);
    });
}

init();