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
  batch(data = [], options = { masterKey: false }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async res => {
      const Config = ParseData.config;
      let response = ParseDependency([data]);
      if (!response.status) {
        res(response);
      }

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
    });
  },
  delete(className = '', objectId = '', options = { masterKey: false }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async res => {
      const Config = ParseData.config;
      let response = ParseDependency([className, objectId]);
      if (!response.status) {
        res(response);
      }

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
          res(response);
        }

        res({
          output: 'Object has been removed',
          status: true
        });
      };

      xhr.onerror = () => {
        response = ParseHandleError(xhr);
        res(response);
      };

      xhr.send(null);
    });
  },
  update(
    className = '',
    objectId = '',
    data = [],
    options = { where: [], include: [], masterKey: false }
  ) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async res => {
      const Config = ParseData.config;
      let response = ParseDependency([className, objectId, data]);
      if (!response.status) {
        res(response);
      }

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
          res(response);
        }

        const output = JSON.parse(xhr.responseText);
        const getResponse = await Index.retrieve(className, objectId, options);
        if (getResponse.status) {
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
    });
  },
  save(className = '', data = [], options = { where: [], include: [], masterKey: false }) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async res => {
      const Config = ParseData.config;
      let response = ParseDependency([className, data]);
      if (!response.status) {
        res(response);
      }

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
          res(response);
        }

        const output = JSON.parse(xhr.responseText);
        const getResponse = await Index.retrieve(className, output.objectId, options);
        if (getResponse.status) {
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
    });
  },
  retrieve(
    className = '',
    objectId = '',
    options = { where: [], include: [], relation: [], masterKey: false }
  ) {
    return new Promise(res => {
      const Config = ParseData.config;
      let response = ParseDependency([className]);
      if (!response.status) {
        res(response);
      }
      let url = Initialize();
      url = `${url}/classes/${className}?limit=10000`;

      if (options.where && options.where.length) {
        options.where.push({
          object: 'objectId',
          equalTo: objectId
        });
        url = `${url}&where=${ParseConditional(options.where)}`;
      } else {
        const createOptions = {
          where: [
            {
              object: 'objectId',
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
          res(response);
        }

        const output = JSON.parse(xhr.responseText);
        if (options.relation && options.relation.length) {
          const promises = options.relation.map(async rel => {
            let onClassName = '';
            Object.keys(output.results[0]).forEach(key => {
              if (rel === key) {
                onClassName = output.results[0][key].className;
              }
            });

            const getRelation = await Queries.retrievesRelation(className, objectId, {
              name: rel,
              className: onClassName
            });

            if (getRelation.status) {
              output.results[0][rel] = getRelation.output;
            }
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
        res(response);
      };

      xhr.send(null);
    });
  },
  retrieves(className = '', options = { where: [], include: [], relation: [], masterKey: false }) {
    return new Promise(res => {
      const Config = ParseData.config;
      let response = ParseDependency([className]);
      if (!response.status) {
        res(response);
      }
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
          res(response);
        }

        const output = JSON.parse(xhr.responseText);
        if (options.relation && options.relation.length) {
          const promises1 = output.results.map(async item => {
            // eslint-disable-next-line prefer-const
            let inItem = item;
            const promises2 = options.relation.map(async rel => {
              let onClassName = '';
              Object.keys(inItem).forEach(key => {
                if (rel === key) {
                  onClassName = inItem[key].className;
                }
              });

              const getRelation = await Queries.retrievesRelation(className, item.objectId, {
                name: rel,
                className: onClassName
              });

              if (getRelation.status) {
                inItem[rel] = getRelation.output;
              }
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
        res(response);
      };

      xhr.send(null);
    });
  }
};

export default Index;
