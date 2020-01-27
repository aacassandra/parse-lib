/* eslint-disable import/no-cycle */
/* eslint-disable no-async-promise-executor */
import ParseData from '@aacassandra/parse-config';
import Tools from '../../tools';
import { ParseDependency, ParseHandleError } from '../../helper';

import Initialize from '../initialize';

const { XMLHttpRequest } = require('xmlhttprequest');

const Index = (
  files = null,
  options = {
    masterKey: false
  }
) => {
  return new Promise(async res => {
    const Config = ParseData.config;
    let response = ParseDependency([files]);
    if (!response.status) {
      res(response);
    } else {
      const file = await Tools.get.file.property(files);
      if (file.status) {
        // Binary is blob file, from base64(data uri) to blob
        const binary = file.output.binaryImg;
        const fileName = file.output.nameImg;
        const fileType = file.output.typeImg;

        const xhr = new XMLHttpRequest();

        let url = Initialize();
        url = `${url}/files/${fileName}`;
        url = encodeURI(url);

        xhr.open('POST', url, true);
        xhr.setRequestHeader(Config.headerAppId, Config.appId);
        xhr.setRequestHeader(Config.headerResKey, Config.resKey);
        xhr.setRequestHeader('Content-Type', fileType);
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
          res({
            xhr,
            status: false
          });
        };

        xhr.send(binary);
      }
    }
  });
};

export default Index;
