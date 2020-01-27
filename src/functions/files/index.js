/* eslint-disable import/no-cycle */
import ParseData from '@aacassandra/parse-config';
import Tools from '../../tools';
import { ParseDependency, ParseHandleError } from '../../helper';

import Initialize from '../initialize';

const { XMLHttpRequest } = require('xmlhttprequest');

const Index = {
  upload: (
    files = null,
    options = {
      masterKey: false
    }
  ) => {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency([files]);
      if (!response.status) {
        rej(response);
      } else {
        const run = async () => {
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
                rej(response);
              }

              const output = JSON.parse(xhr.responseText);
              res({
                output,
                status: true
              });
            };

            xhr.onerror = () => {
              rej(
                new Error({
                  xhr,
                  status: false
                })
              );
            };

            xhr.send(binary);
          }
        };

        run();
      }
    });
  },
  delete: (fileUrl, options = { masterKey: false }) => {
    return new Promise((res, rej) => {
      const Config = ParseData.config;
      let response = ParseDependency(fileUrl);
      if (!response.status) {
        rej(response);
      } else {
        const run = async () => {
          let newFileUrl = fileUrl.split('/');
          newFileUrl = newFileUrl[newFileUrl.length - 1];

          let url = Initialize();
          url = `${url}/files/${newFileUrl}`;

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
              output: 'Object has been removed',
              status: true
            });
          };

          xhr.onerror = () => {
            response = ParseHandleError(xhr);
            rej(new Error(response));
          };

          xhr.send(null);
        };

        run();
      }
    });
  }
};

export default Index;
