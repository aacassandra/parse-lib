import ParseData from '@aacassandra/parse-config';
import { ParseDependency, ParseHandleError } from '../../helper';
import Initialize from '../initialize';
import Tools from '../../tools';

const { XMLHttpRequest } = require('xmlhttprequest');

const CloudCode = (data = {}) => {
  return new Promise((res, rej) => {
    const Config = ParseData.config;
    let response = ParseDependency([data]);
    if (!response.status) {
      rej(response);
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

      xhr.onload = async () => {
        response = ParseHandleError(xhr);
        if (!response.status) {
          rej(response);
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
        const errorResponse = {
          xhr,
          status: false
        };

        rej(errorResponse);
      };

      xhr.send(JSON.stringify(data));
    }
  });
};

export default {
  UpdateUser: async (
    objectId = '',
    data = [],
    options = { include: [], relation: [], masterKey: false }
  ) => {
    const newData = [];
    const promises = data.map(async dat => {
      if (dat[0] === 'file') {
        const file = await Tools.get.file.property(dat[2]);
        if (file.status) {
          const { nameImg } = file.output;
          const { base64Img } = file.output;
          newData.push([
            'file',
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
    return new Promise((res, rej) => {
      const run = async () => {
        await CloudCode({
          objectId,
          data: newData,
          options,
          functionName: 'ParseUpdateUser'
        })
          .then(onResponse => {
            res(onResponse);
          })
          .catch(onError => {
            rej(onError);
          });
      };

      run();
    });
  },
  DeleteUser: (objectId = '') => {
    return new Promise((res, rej) => {
      const run = async () => {
        await CloudCode({
          objectId,
          functionName: 'ParseDeleteUser'
        })
          .then(onResponse => {
            res(onResponse);
          })
          .catch(onError => {
            rej(onError);
          });
      };

      run();
    });
  },
  DeleteObject: (className = '', objectId = '') => {
    return new Promise((res, rej) => {
      const run = async () => {
        await CloudCode({
          className,
          objectId,
          functionName: 'ParseDeleteObject'
        })
          .then(onResponse => {
            res(onResponse);
          })
          .catch(onError => {
            rej(onError);
          });
      };

      run();
    });
  },
  UpdateObject: (
    className = '',
    objectId = '',
    data = [],
    options = { include: [], relation: [], masterKey: false }
  ) => {
    return new Promise((res, rej) => {
      const run = async () => {
        await CloudCode({
          className,
          objectId,
          data,
          options,
          functionName: 'ParseUpdate'
        })
          .then(onResponse => {
            res(onResponse);
          })
          .catch(onError => {
            rej(onError);
          });
      };

      run();
    });
  },
  RetrieveObject: (
    className = '',
    objectId = '',
    options = {
      where: [],
      include: [],
      relation: [],
      masterKey: false
    }
  ) => {
    return new Promise((res, rej) => {
      const run = async () => {
        await CloudCode({
          className,
          objectId,
          options,
          functionName: 'ParseRetrieve'
        })
          .then(onResponse => {
            res(onResponse);
          })
          .catch(onError => {
            rej(onError);
          });
      };

      run();
    });
  },
  RetrieveObjects: (
    className = '',
    options = {
      where: [],
      include: [],
      relation: [],
      masterKey: false
    }
  ) => {
    return new Promise((res, rej) => {
      const run = async () => {
        await CloudCode({
          className,
          options,
          functionName: 'ParseRetrieves'
        })
          .then(onResponse => {
            if (!onResponse.output.length) {
              const newError = {
                output: {
                  code: 101,
                  message: 'No data available'
                },
                status: false
              };

              rej(newError);
            } else {
              res(onResponse);
            }
          })
          .catch(onError => {
            rej(onError);
          });
      };

      run();
    });
  }
};
