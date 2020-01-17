/* eslint-disable no-async-promise-executor */
import ParseData from '@aacassandra/parse-config';
import { ParseDependency, ParseHandleError } from '../../helper';
import Initialize from '../initialize';
import Tools from '../../tools';

const { XMLHttpRequest } = require('xmlhttprequest');

const CloudCode = (data = {}) => {
  return new Promise(async res => {
    const Config = ParseData.config;
    let response = ParseDependency([data]);
    if (!response.status) {
      res(response);
    } else {
      // Binary is blob file, from base64(data uri) to blob
      const xhr = new XMLHttpRequest();

      let url = Initialize();
      url = `${url}/functions/cloud`;
      url = encodeURI(url);

      xhr.open('POST', url, true);
      xhr.setRequestHeader(Config.headerAppId, Config.appId);
      xhr.setRequestHeader(Config.headerResKey, Config.resKey);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (data.options.masterKey) {
        xhr.setRequestHeader(Config.headerMasterKey, Config.masterKey);
      }

      xhr.onload = async () => {
        response = ParseHandleError(xhr);
        if (!response.status) {
          res(response);
        }

        const output = JSON.parse(xhr.responseText);
        if (output.result.status) {
          res({
            output: output.result.output,
            status: true
          });
        } else {
          res({
            output: output.result.output,
            status: false
          });
        }
      };

      xhr.onerror = () => {
        res({
          xhr,
          status: false
        });
      };

      xhr.send(JSON.stringify(data));
    }
  });
};

export default {
  UpdateUser: async (objectId = '', data = [], options = { include: [], masterKey: false }) => {
    const newData = [];
    const promises = data.map(async dat => {
      if (dat[0] === 'image') {
        const file = await Tools.get.file.property(dat[2]);
        if (file.status) {
          const { nameImg } = file.output;
          const { base64Img } = file.output;
          newData.push([
            'image',
            dat[1],
            {
              fileName: nameImg,
              base64: base64Img
            }
          ]);
        }
      } else {
        newData.push(dat);
      }
    });

    await Promise.all(promises);
    const cloud = await CloudCode({
      objectId,
      data: newData,
      options,
      functionName: 'ParseUpdateUser'
    });
    return cloud;
  },
  Update: async (
    className = '',
    objectId = '',
    data = [],
    options = { include: [], masterKey: false }
  ) => {
    const cloud = await CloudCode({
      className,
      objectId,
      data,
      options,
      functionName: 'ParseUpdate'
    });
    return cloud;
  },
  Retrieve: async (
    className = '',
    objectId = '',
    options = { where: [], include: [], relation: [], masterKey: false }
  ) => {
    const cloud = await CloudCode({
      className,
      objectId,
      options,
      functionName: 'ParseRetrieve'
    });
    return cloud;
  },
  Retrieves: async (
    className = '',
    options = { where: [], include: [], relation: [], masterKey: false }
  ) => {
    const cloud = await CloudCode({
      className,
      options,
      functionName: 'ParseRetrieves'
    });
    return cloud;
  }
};
