import ParseData from '@aacassandra/parse-config';
import { ParseDependency, ParseHandleError, ParseObjectSet } from '../../helper';
import Initialize from '../initialize';
import Objects from '../objects';
import Queries from '../queries';

//const { XMLHttpRequest } = require('xmlhttprequest');

const Index = {
  createRole: (
    roleName = '',
    options = { acl: {}, users: [], roles: [], include: [], masterKey: false }
  ) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([roleName]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/roles`;

        const data = [];
        data.push(['string', 'name', roleName]);
        if (Object.entries(options.acl).length) {
          data.push(['acl', options.acl]);
        } else {
          data.push([
            'acl',
            {
              default: {
                read: true
              }
            }
          ]);
        }

        if (options.users.length) {
          data.push(['addRelation', 'users', options.users, '_User']);
        }

        if (options.roles.length) {
          data.push(['addRelation', 'roles', options.roles, '_Role']);
        }

        let json = await ParseObjectSet(data, options.masterKey);
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

          const output = JSON.parse(xhr.responseText);
          await Objects.retrieveObject('_Role', output.objectId, options)
            .then(onResponse => {
              res(onResponse);
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
  retrieveRole: async (roleName = '', options = { include: [], masterKey: false }) => {
    return new Promise((res, rej) => {
      const run = async () => {
        await Queries.basic('_Role', {
          where: [
            {
              column: 'name',
              equalTo: roleName
            }
          ],
          include: options.include,
          masterKey: options.masterKey,
          relation: ['users', 'roles']
        })
          .then(onResponse => {
            res({
              output: onResponse.output[0],
              status: true
            });
          })
          .catch(onError => {
            rej(onError);
          });
      };

      run();
    });
  },
  updateRole: (roleName = '', data = [], options = { include: [] }) => {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([roleName, data]);
      if (!response.status) {
        rej(response);
      } else {
        const run = async () => {
          await Index.retrieveRole(roleName, {
            include: options.include,
            masterKey: true
          })
            .then(async onResponse => {
              const { objectId } = onResponse.output;

              let url = Initialize();
              url = `${url}/roles/${objectId}`;

              let json = await ParseObjectSet(data, true);
              json = JSON.stringify(json);

              url = encodeURI(url);

              const xhr = new XMLHttpRequest();
              xhr.open('PUT', url, true);
              xhr.setRequestHeader(Config.headerAppId, Config.appId);
              xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
              xhr.setRequestHeader('Content-Type', 'application/json');

              xhr.onload = async () => {
                response = ParseHandleError(xhr);
                if (!response.status) {
                  rej(response);
                }

                const output = JSON.parse(xhr.responseText);
                await Objects.retrieveObject('_Role', objectId, options)
                  .then(onChildResponse => {
                    res(onChildResponse);
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
            })
            .catch(onError => {
              rej(onError);
            });
        };

        run();
      }
    });
  },
  deleteRole: (roleName = '', options = { sessionToken: '', masterKey: '' }) => {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([roleName, options]);
      if (!response.status) {
        rej(response);
      } else {
        const run = async () => {
          await Index.retrieveRole(roleName, {
            masterKey: options.masterKey
          })
            .then(onResponse => {
              const { objectId } = onResponse.output;

              let url = Initialize();
              url = `${url}/roles/${objectId}`;

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
            })
            .catch(onError => {
              rej(onError);
            });
        };

        run();
      }
    });
  }
};

export default Index;
