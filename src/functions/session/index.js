import ParseData from '@aacassandra/parse-config';
import { ParseDependency, ParseHandleError, ParseObjectSet } from '../../helper';
import Initialize from '../initialize';

//const { XMLHttpRequest } = require('xmlhttprequest');

const Index = {
  createSession: () => {
    //
  },
  retrieveSession(objectId = '', options = { sessionToken: '', masterKey: false }) {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([objectId]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/sessions/${objectId}`;
        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        if (options.masterKey) {
          xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
        } else {
          xhr.setRequestHeader(Config.headerSessionToken, options.sessionToken);
        }

        xhr.onload = async () => {
          response = ParseHandleError(xhr);
          if (!response.status) {
            rej(response);
          }

          const output = JSON.parse(xhr.responseText);
          res({
            output,
            status: true
          });
        };

        xhr.onerror = () => {
          response = ParseHandleError(xhr);
          rej(response);
        };

        xhr.send(null);
      }
    });
  },
  updateSession(objectId = '', data = [], options = { sessionToken: '', masterKey: false }) {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([objectId, data]);
      if (!response.status) {
        rej(response);
      } else {
        const run = async () => {
          let url = Initialize();
          url = `${url}/sessions/${objectId}`;

          let json = await ParseObjectSet(data, options.masterKey);
          json = JSON.stringify(json);

          url = encodeURI(url);

          const xhr = new XMLHttpRequest();
          xhr.open('PUT', url, true);
          xhr.setRequestHeader(Config.headerAppId, Config.appId);
          xhr.setRequestHeader(Config.headerResKey, Config.resKey);
          if (options.masterKey) {
            xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
          } else {
            xhr.setRequestHeader(Config.headerSessionToken, options.sessionToken);
          }
          xhr.setRequestHeader('Content-Type', 'application/json');

          xhr.onload = async () => {
            response = ParseHandleError(xhr);
            if (!response.status) {
              rej(response);
            }

            const output = JSON.parse(xhr.responseText);
            res({
              output,
              status: true
            });
          };

          xhr.onerror = () => {
            response = ParseHandleError(xhr);
            rej(response);
          };

          xhr.send(json);
        };

        run();
      }
    });
  },
  retrievesSession(options = { sessionToken: '', masterKey: false }) {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([options]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/sessions`;
        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        if (options.masterKey) {
          xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
        } else {
          xhr.setRequestHeader(Config.headerSessionToken, options.sessionToken);
        }

        xhr.onload = async () => {
          response = ParseHandleError(xhr);
          if (!response.status) {
            rej(response);
          }

          const output = JSON.parse(xhr.responseText);
          res({
            output,
            status: true
          });
        };

        xhr.onerror = () => {
          response = ParseHandleError(xhr);
          rej(response);
        };

        xhr.send(null);
      }
    });
  },
  deleteSession(objectId = '', options = { sessionToken: '', masterKey: false }) {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([objectId, options]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/sessions/${objectId}`;
        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        if (options.masterKey) {
          xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
        } else {
          xhr.setRequestHeader(Config.headerSessionToken, options.sessionToken);
        }

        xhr.onload = async () => {
          response = ParseHandleError(xhr);
          if (!response.status) {
            rej(response);
          }

          const output = JSON.parse(xhr.responseText);
          res({
            output,
            status: true
          });
        };

        xhr.onerror = () => {
          response = ParseHandleError(xhr);
          rej(response);
        };

        xhr.send(null);
      }
    });
  }
};

export default Index;
