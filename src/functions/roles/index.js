import ParseData from '@aacassandra/parse-config';
import { ParseDependency, ParseHandleError, ParseObjectSet } from '../../helper';
import Initialize from '../initialize';
import Objects from '../objects';

const { XMLHttpRequest } = require('xmlhttprequest');

const Index = {
  createRole: (
    roleName = '',
    options = { acl: {}, users: [], roles: [], include: [], masterKey: false }
  ) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async res => {
      const Config = ParseData.config;
      let response = ParseDependency([roleName]);
      if (!response.status) {
        res(response);
      }

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
        data.push(['addRelation', 'users', options.users]);
      }

      if (options.roles.length) {
        data.push(['addRelation', 'roles', options.roles]);
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
          res(response);
        }

        const output = JSON.parse(xhr.responseText);
        const getResponse = await Objects.retrieve('_Role', output.objectId, options);
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
  retrieveRole: async (roleName = '', options = { include: [], masterKey: false }) => {
    const role = await Objects.retrieves('_Role', {
      where: [{
        object: 'name',
        equalTo: roleName
      }],
      include: options.include,
      masterKey: options.masterKey,
      relation: ['users', 'roles']
    });

    if (role.status) {
      return {
        output: role.output[0],
        status: true
      };
    }
    return role;
  },
  updateRole: (roleName = '', data = [], options = { include: [] }) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async res => {
      const Config = ParseData.config;
      let response = ParseDependency([roleName, data]);
      if (!response.status) {
        res(response);
      }

      const role = await Index.retrieveRole(roleName, {
        include: options.include,
        masterKey: true
      });
      if (!role.status) {
        res(role);
      }

      const { objectId } = role.output;

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
          res(response);
        }

        const output = JSON.parse(xhr.responseText);
        const getResponse = await Objects.retrieve('_Role', objectId, options);
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
  deleteRole: (roleName = '', options = { sessionToken: '', masterKey: '' }) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async res => {
      const Config = ParseData.config;
      let response = ParseDependency([roleName, options]);
      if (!response.status) {
        res(response);
      }

      const role = await Index.retrieveRole(roleName, {
        masterKey: options.masterKey
      });
      if (!role.status) {
        res(role);
      }

      const { objectId } = role.output;

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
          res(response);
        }

        res({
          output: 'Role has been removed',
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
