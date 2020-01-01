import ParseData from '@aacassandra/parse-config';
import { ParseDependency, ParseHandleError, ParseConditional } from '../../helper';
import Initialize from '../initialize';

const { XMLHttpRequest } = require('xmlhttprequest');

const Index = {
  basic: (className = '', options = { include: [], masterKey: false }) => {
    return new Promise(res => {
      const Config = ParseData.config;
      let response = ParseDependency([className]);
      if (!response.status) {
        res(response);
      }

      let url = Initialize();
      url = `${url}/classes/${className}`;
      if (options.include && options.include.length) {
        url = `${url}?include=${options.include}`;
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
  },
  retrievesRelation: (
    className = '',
    objectId = '',
    colomn = { name: '', className: '' },
    options = { include: [], masterKey: false }
  ) => {
    return new Promise(res => {
      const Config = ParseData.config;
      let response = ParseDependency([className, objectId, colomn.name, colomn.className]);
      if (!response.status) {
        res(response);
      }

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
        url = `${url + where}&include=${options.include}`;
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
  },
  countingObjects: (className = '', options = { where: [], include: [], masterKey: false }) => {
    return new Promise(res => {
      const Config = ParseData.config;
      let response = ParseDependency([className]);
      if (!response.status) {
        res(response);
      }

      let url = Initialize();
      url = `${url}/classes/${className}?count=1&limit=0`;

      if (options.where && options.where.length) {
        url = `${url}&where=${ParseConditional(options.where)}`;
      }

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
          res(response);
        }

        const output = JSON.parse(xhr.responseText);
        res({
          output: output.count,
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
