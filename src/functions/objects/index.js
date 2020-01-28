/* eslint-disable prefer-destructuring */
import ParseData from '@aacassandra/parse-config';
import {
  ParseConditional,
  ParseDependency,
  ParseHandleError,
  ParseObjectSet,
  ParseBatchConditional
} from '../../helper';
import Initialize from '../initialize';
import Queries from '../queries';

const { XMLHttpRequest } = require('xmlhttprequest');

const Index = {
  creatingObject(
    className = '',
    data = [],
    options = {
      include: [],
      relation: [],
      masterKey: false
    }
  ) {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([className, data]);
      if (!response.status) {
        rej(response);
      } else {
        const run = async () => {
          let url = Initialize();
          url = `${url}/classes/${className}`;

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
              // rej(response);
            }

            const output = JSON.parse(xhr.responseText);

            res({
              output,
              status: true
            });
            // await Index.retrieveObject(className, output.objectId, options)
            //   .then(onResponse => {
            //     res(onResponse);
            //   })
            //   .catch(() => {
            //     res({
            //       output,
            //       status: true
            //     });
            //   });
          };

          xhr.onerror = () => {
            response = ParseHandleError(xhr);
            // rej(response);
          };

          xhr.send(json);
        };

        run();
      }
    });
  },
  retrieveObject(
    className = '',
    objectId = '',
    options = {
      where: [],
      include: [],
      relation: [],
      masterKey: false
    }
  ) {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([className]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/classes/${className}?limit=10000`;

        if (options.where && options.where.length) {
          options.where.push({
            column: 'objectId',
            equalTo: objectId
          });
          url = `${url}&where=${ParseConditional(options.where)}`;
        } else {
          const createOptions = {
            where: [
              {
                column: 'objectId',
                equalTo: objectId
              }
            ]
          };
          url = `${url}&where=${ParseConditional(createOptions.where)}`;
        }

        if (options.include && options.include.length) {
          url = `${url}&include=${JSON.stringify(options.include)}`;
        }

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
          if (options.relation && options.relation.length) {
            const promises = options.relation.map(async rel => {
              let onClassName = '';
              let columnName;
              // eslint-disable-next-line prefer-const
              let relInclude = [];
              let relSplit;
              if (rel.indexOf('|') >= 1) {
                relSplit = rel.split('|');
                columnName = relSplit[0];
                let incSplitter;
                if (relSplit[1].indexOf(',')) {
                  incSplitter = relSplit[1].split(',');
                  incSplitter.forEach(inc => {
                    relInclude.push(inc);
                  });
                } else {
                  relInclude.push(relSplit[1]);
                }
              } else {
                columnName = rel;
              }
              Object.keys(output.results[0]).forEach(key => {
                if (columnName === key) {
                  onClassName = output.results[0][key].className;
                }
              });

              await Queries.retrievesRelation(
                className,
                objectId,
                {
                  name: columnName,
                  className: onClassName
                },
                {
                  include: relInclude || [],
                  masterKey: options.masterKey
                }
              ).then(onResponse => {
                output.results[0][columnName] = onResponse.output;
              });
            });

            await Promise.all(promises);
          }

          res({
            output: output.results[0],
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
  updateObject(
    className = '',
    objectId = '',
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
      let response = ParseDependency([className, objectId, data]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/classes/${className}/${objectId}`;

        let json = await ParseObjectSet(data, options.masterKey);
        json = JSON.stringify(json);

        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
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
          await Index.retrieveObject(className, objectId, options)
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
  deleteObject(className = '', objectId = '', options = { masterKey: false }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([className, objectId]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/classes/${className}/${objectId}`;

        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', url, true);
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
  },
  batch(data = [], options = { masterKey: false }) {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([data]);
      if (!response.status) {
        rej(response);
      } else {
        const run = async () => {
          let json = await ParseBatchConditional(data, options.masterKey);
          json = JSON.stringify(json);

          let url = Initialize();
          url = `${url}/batch`;
          url = encodeURI(url);

          const xhr = new XMLHttpRequest();
          xhr.open('POST', url, true);
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

          xhr.send(json);
        };

        run();
      }
    });
  }
};

export default Index;
