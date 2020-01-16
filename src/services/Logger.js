import { DateTime } from 'luxon';
const Hook = require('console-hook');
const METHOD_NAMES = ['log', 'error', 'warn', 'info'];

class Logger {
  constructor() {

  }

  writeLog = (entry) => {
  	const message = `${entry} [${DateTime.fromJSDate(new Date()).toISO()}]\n`;

    return new Promise((resolve, reject) => {
      resolveLocalFileSystemURL(cordova.file.dataDirectory, (directoryEntry) => {
        directoryEntry.getFile('log.txt', { create : true }, (fileEntry) => {
            fileEntry.createWriter((fileWriter) => {
              fileWriter.onwriteend = function(e) {
                resolve();
              }

              fileWriter.onerror = function(e) {
                reject(e);
              }

              const blob = new Blob([message], { type : 'text/plain' })
              fileWriter.write(blob)
            }, (error) => {
              reject(error);
            })
          }, (error) => {
            reject(error);
          }
        )
      }, (error) => {
        reject(error);
      })
    })
  }

  hook = () => {
    if (!window.resolveLocalFileSystemURL) {
      return undefined;
    }

    const { writeLog } = this;

    this.interceptor = Hook().attach((method, args) => {
      try {
        const entry = `${[method.toUpperCase()].concat(Array.prototype.slice.call(args)).join(' ')}\n`;
        writeLog(entry);
      } catch (error) {
        alert(error);
      }
    });

    return this;
  }

  unhook = () => {
    if (this.interceptor) {
      this.interceptor.detach();
      this.interceptor = undefined;
    }
  }
}

export default Logger;
