/* eslint-disable prefer-destructuring */
import ParseData from '@aacassandra/parse-config';
import { ParseDependency, ParseHandleError, ParseConditional } from '../../helper';
import Initialize from '../initialize';

const { XMLHttpRequest } = require('xmlhttprequest');

const Index = {
  basic: (
    className = '',
    options = {
      where: [],
      include: [],
      relation: [],
      masterKey: false
    }
  ) => {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([className]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/classes/${className}?limit=10000`;
        if (options.where && options.where.length) {
          url = `${url}&where=${ParseConditional(options.where)}`;
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
            const promises1 = output.results.map(async item => {
              // eslint-disable-next-line prefer-const
              let inItem = item;
              const promises2 = options.relation.map(async rel => {
                let onClassName = '';
                let columnName;
                let relInclude;
                let relSplit;
                if (rel.indexOf('|') >= 1) {
                  relSplit = rel.split('|');
                  columnName = relSplit[0];
                  relInclude = JSON.parse(relSplit[1]);
                } else {
                  columnName = rel;
                }

                Object.keys(inItem).forEach(key => {
                  if (columnName === key) {
                    onClassName = inItem[key].className;
                  }
                });

                await Index.retrievesRelation(
                  className,
                  item.objectId,
                  {
                    name: columnName,
                    className: onClassName
                  },
                  {
                    include: relInclude || [],
                    masterKey: options.masterKey
                  }
                ).then(onResponse => {
                  inItem[columnName] = onResponse.output;
                });
              });

              await Promise.all(promises2);
            });

            await Promise.all(promises1);
          }
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
      }
    });
  },
  retrievesRelation: (
    className = '',
    objectId = '',
    colomn = { name: '', className: '' },
    options = { include: [], masterKey: false }
  ) => {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([className, objectId, colomn.name, colomn.className]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/classes/${colomn.className}?where=`;
        let where = {
          $relatedTo: {
            object: {
              __type: 'Pointer',
              className,
              objectId
            },
            key: colomn.name
          }
        };
        where = JSON.stringify(where);
        url += where;
        if (options.include && options.include.length) {
          url = `${url}&include=${options.include}`;
        }

        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        if (options.masterKey) {
          xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
        }

        xhr.onload = () => {
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
      }
    });
  },
  countingObjects: (className = '', options = { where: [], masterKey: false }) => {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([className]);
      if (!response.status) {
        rej(response);
      } else {
        let url = Initialize();
        url = `${url}/classes/${className}?count=1&limit=0`;

        if (options.where && options.where.length) {
          url = `${url}&where=${ParseConditional(options.where)}`;
        }

        url = encodeURI(url);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        if (options.masterKey) {
          xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
        }

        xhr.onload = () => {
          response = ParseHandleError(xhr);
          if (!response.status) {
            rej(response);
          }

          const output = JSON.parse(xhr.responseText);

          res({
            output: output.count,
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
