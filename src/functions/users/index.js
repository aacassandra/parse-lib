import ParseData from '@aacassandra/parse-config';
import { ParseDependency, ParseHandleError, ParseObjectSet } from '../../helper';
import Initialize from '../initialize';
import Objects from '../objects';

// const { XMLHttpRequest } = require('xmlhttprequest');

const Index = {
  signUp(
    userName = '',
    passWord = '',
    data = [],
    options = {
      include: [],
      relation: [],
      masterKey: false
    }
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([userName, passWord]);
      if (!response.status) {
        rej(response);
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
            rej(response);
          }

          const output = JSON.parse(xhr.responseText);
          let newOnResponse;
          await Objects.retrieveObject('_User', output.objectId, options)
            .then(onResponse => {
              newOnResponse = onResponse;
              newOnResponse.output = {
                ...newOnResponse.output,
                sessionToken: output.sessionToken
              };
              res(newOnResponse);
            })
            .catch(() => {
              res({
                output,
                status: true
              });
            });
        };

        xhr.onerror = () => {
          response = ParseHandleError(xhr);
          rej(response);
        };

        xhr.send(json);
      }
    });
  },
  signIn(userName = '', passWord = '') {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([userName, passWord]);
      if (!response.status) {
        rej(response);
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
  signOut(sessionToken = '') {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([sessionToken]);
      if (!response.status) {
        rej(response);
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
  verivy: (
    email = '',
    options = {
      masterKey: false
    }
  ) => {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([email]);
      if (!response.status) {
        rej(response);
      } else {
        const run = async () => {
          let url = Initialize();
          url = `${url}/verificationEmailRequest`;

          let json = { email };
          json = JSON.stringify(json);

          url = encodeURI(url);

          const xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);
          xhr.setRequestHeader(Config.headerAppId, Config.appId);
          xhr.setRequestHeader(Config.headerResKey, Config.resKey);
          xhr.setRequestHeader('Content-Type', 'application/json');
          if (options.masterKey) {
            xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
          }

          xhr.onload = async () => {
            response = ParseHandleError(xhr);
            if (!response.status) {
              rej(response);
            }

            res({
              status: true,
              output: 'sended'
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
  resetPassword: (
    email = '',
    options = {
      masterKey: false
    }
  ) => {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([email]);
      if (!response.status) {
        rej(response);
      } else {
        const run = async () => {
          let url = Initialize();
          url = `${url}/requestPasswordReset`;

          let json = { email };
          json = JSON.stringify(json);

          url = encodeURI(url);

          const xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);
          xhr.setRequestHeader(Config.headerAppId, Config.appId);
          xhr.setRequestHeader(Config.headerResKey, Config.resKey);
          xhr.setRequestHeader('Content-Type', 'application/json');
          if (options.masterKey) {
            xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
          }

          xhr.onload = async () => {
            response = ParseHandleError(xhr);
            if (!response.status) {
              rej(response);
            }

            res({
              status: true,
              output: 'sended'
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
  validateSession: (sessionToken = '') => {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([sessionToken]);
      if (!response.status) {
        rej(response);
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
  updateUser(
    objectId = '',
    data = [],
    options = { include: [], masterKey: false, sessionToken: '' }
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([objectId, data]);
      if (!response.status) {
        rej(response);
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
      }
    });
  },
  retrieveUser(objectId = '', options = { masterKey: false }) {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([objectId]);
      if (!response.status) {
        rej(response);
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
  retrieveUsers(options = { masterKey: false }) {
    return new Promise((res, rej) => {
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
          rej(response);
        }

        const output = JSON.parse(xhr.responseText);
        res({
          output: output.results,
          status: true
        });
      };

      xhr.onerror = () => {
        response = ParseHandleError(xhr);
        rej(response);
      };

      xhr.send(null);
    });
  },
  deleteUser: (
    objectId = '',
    options = {
      sessionToken: '',
      masterKey: false
    }
  ) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([objectId]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/users/${objectId}`;

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

          res({
            output: 'deleted',
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
