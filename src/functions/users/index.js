import ParseData from '@aacassandra/parse-config';
import { ParseDependency, ParseHandleError, ParseObjectSet } from '../../helper';
import Initialize from '../initialize';
import Objects from '../objects';

const { XMLHttpRequest } = require('xmlhttprequest');

const Index = {
  validateSession(sessionToken = '') {
    return new Promise(res => {
      const Config = ParseData.config;
      let response = ParseDependency([sessionToken]);
      if (!response.status) {
        res(response);
      } else {
        let url = Initialize();
        url = `${url}/users/me`;
        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        xhr.setRequestHeader(Config.headerSessionToken, sessionToken);

        xhr.onload = async () => {
          response = ParseHandleError(xhr);
          if (!response.status) {
            res(response);
          }

          const output = JSON.parse(xhr.responseText);
          res({
            output,
            status: true
          });
        };

        xhr.onerror = () => {
          response = ParseHandleError(xhr);
          res(response);
        };

        xhr.send(null);
      }
    });
  },
  signOut(sessionToken = '') {
    return new Promise(res => {
      const Config = ParseData.config;
      let response = ParseDependency([sessionToken]);
      if (!response.status) {
        res(response);
      } else {
        let url = Initialize();
        url = `${url}/logout`;
        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        xhr.setRequestHeader(Config.headerSessionToken, sessionToken);

        xhr.onload = async () => {
          response = ParseHandleError(xhr);
          if (!response.status) {
            res(response);
          }

          const output = JSON.parse(xhr.responseText);
          res({
            output,
            status: true
          });
        };

        xhr.onerror = () => {
          response = ParseHandleError(xhr);
          res(response);
        };

        xhr.send(null);
      }
    });
  },
  signUp(userName = '', passWord = '', data = [], options = { masterKey: false }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async res => {
      const Config = ParseData.config;
      let response = ParseDependency([userName, passWord]);
      if (!response.status) {
        res(response);
      } else {
        let url = Initialize();
        url = `${url}/users`;

        let json = {};
        if (data && data.length) {
          json = await ParseObjectSet(data, options.masterKey);
          json = {
            ...json,
            username: userName,
            password: passWord
          };
        } else {
          json = {
            ...json,
            username: userName,
            password: passWord
          };
        }

        json = JSON.stringify(json);

        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        xhr.setRequestHeader(Config.headerRevocableSession, Number(Config.revocableSession));
        xhr.setRequestHeader('Content-Type', 'application/json');
        if (options.masterKey) {
          xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
        }

        xhr.onload = async () => {
          response = ParseHandleError(xhr);
          if (!response.status) {
            res(response);
          }

          const output = JSON.parse(xhr.responseText);
          const getResponse = await Objects.retrieve('_User', output.objectId, options);
          if (getResponse.status) {
            getResponse.output = {
              ...getResponse.output,
              sessionToken: output.sessionToken
            };
            res(getResponse);
          } else {
            res({
              output,
              status: true
            });
          }
        };

        xhr.onerror = () => {
          response = ParseHandleError(xhr);
          res(response);
        };

        xhr.send(json);
      }
    });
  },
  signIn(userName = '', passWord = '') {
    return new Promise(res => {
      const Config = ParseData.config;
      let response = ParseDependency([userName, passWord]);
      if (!response.status) {
        res(response);
      } else {
        let url = Initialize();
        url = `${url}/login?username=${userName}&password=${passWord}`;
        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        xhr.setRequestHeader(Config.headerRevocableSession, Number(Config.revocableSession));

        xhr.onload = async () => {
          response = ParseHandleError(xhr);
          if (!response.status) {
            res(response);
          }

          const output = JSON.parse(xhr.responseText);
          res({
            output,
            status: true
          });
        };

        xhr.onerror = () => {
          response = ParseHandleError(xhr);
          res(response);
        };

        xhr.send(null);
      }
    });
  },
  updateUser(
    objectId = '',
    data = [],
    options = { include: [], masterKey: false, sessionToken: '' }
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async res => {
      const Config = ParseData.config;
      let response = ParseDependency([objectId, data]);
      if (!response.status) {
        res(response);
      } else {
        let url = Initialize();
        url = `${url}/users/${objectId}`;

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
            res(response);
          }

          const output = JSON.parse(xhr.responseText);
          res({
            output,
            status: true
          });
        };

        xhr.onerror = () => {
          response = ParseHandleError(xhr);
          res(response);
        };

        xhr.send(json);
      }
    });
  },
  retrieveUser(objectId = '', options = { masterKey: false }) {
    return new Promise(res => {
      const Config = ParseData.config;
      let response = ParseDependency([objectId]);
      if (!response.status) {
        res(response);
      } else {
        let url = Initialize();
        url = `${url}/users/${objectId}`;
        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        if (options.masterKey) {
          xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
        }

        xhr.onload = async () => {
          response = ParseHandleError(xhr);
          if (!response.status) {
            res(response);
          }

          const output = JSON.parse(xhr.responseText);
          res({
            output,
            status: true
          });
        };

        xhr.onerror = () => {
          response = ParseHandleError(xhr);
          res(response);
        };

        xhr.send(null);
      }
    });
  },
  retrievesUser(options = { masterKey: false }) {
    return new Promise(res => {
      const Config = ParseData.config;
      let response;
      let url = Initialize();
      url = `${url}/users`;
      url = encodeURI(url);

      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader(Config.headerAppId, Config.appId);
      xhr.setRequestHeader(Config.headerResKey, Config.resKey);
      if (options.masterKey) {
        xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
      }

      xhr.onload = async () => {
        response = ParseHandleError(xhr);
        if (!response.status) {
          res(response);
        }

        const output = JSON.parse(xhr.responseText);
        res({
          output: output.results,
          status: true
        });
      };

      xhr.onerror = () => {
        response = ParseHandleError(xhr);
        res(response);
      };

      xhr.send(null);
    });
  }
};

export default Index;
