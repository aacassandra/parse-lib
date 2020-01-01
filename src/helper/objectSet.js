import * as jQuery from 'jquery';
import ParseData from '@aacassandra/parse-config';
import Tools from '../tools';

const $ = jQuery;

const initialize = () => {
  let url = '';
  const Config = ParseData.config;
  if (Config.protocol && Config.host && Config.port) {
    if (Config.surl && Config.surl !== 'none') {
      url = `${Config.protocol}://${Config.host}:${Config.port}/${Config.surl}`;
    } else {
      url = `${Config.protocol}://${Config.host}:${Config.port}`;
    }
  }
  return url;
};

const Index = (data, masterKey = false) => {
  return new Promise(resolve => {
    let json = {};
    const promises = [];
    data.forEach(async dat => {
      if (dat[3]) {
        if (dat[0] === 'pointer') {
          const pointer = {
            __type: 'Pointer',
            className: dat[3],
            objectId: dat[2]
          };
          json = {
            ...json,
            [dat[1]]: pointer
          };
        }
      } else if (dat[0] === 'string') {
        json = {
          ...json,
          [dat[1]]: dat[2]
        };
      } else if (dat[0] === 'date') {
        let utc = false;
        let plusDate = 0;
        if (dat[3] && dat[3] === true) {
          utc = true;
        }
        if (dat[4]) {
          plusDate = Number(dat[4]);
        }

        json = {
          ...json,
          [dat[1]]: {
            __type: 'Date',
            iso: Tools.get.date(dat[2], utc, plusDate)
          }
        };
      } else if (dat[0] === 'number') {
        json = {
          ...json,
          [dat[1]]: Number(dat[2])
        };
      } else if (dat[0] === 'boolean') {
        let bool = false;
        if (dat[2] === 'True' || dat[2] === 'true' || dat[2] === true || dat[2] === 1) {
          bool = true;
        } else if (dat[2] === 'False' || dat[2] === 'false' || dat[2] === false || dat[2] === 0) {
          bool = false;
        }

        json = {
          ...json,
          [dat[1]]: bool
        };
      } else if (dat[0] === 'array') {
        json = {
          ...json,
          [dat[1]]: dat[2]
        };
      } else if (dat[0] === 'object') {
        json = {
          ...json,
          [dat[1]]: dat[2]
        };
      } else if (dat[0] === 'image') {
        const Config = ParseData.config;
        const file = dat[2];
        let serverUrl = initialize();
        serverUrl = `${serverUrl}/files/${file.name}`;
        const request = $.ajax({
          type: 'POST',
          beforeSend(req) {
            req.setRequestHeader(Config.headerAppId, Config.appId);
            req.setRequestHeader(Config.headerResKey, Config.resKey);
            req.setRequestHeader(Config.headerMasterKey, masterKey ? Config.masterKey : '');
            req.setRequestHeader('Content-Type', file.type);
          },
          url: serverUrl,
          data: file,
          processData: false,
          contentType: false,
          success(resx) {
            const filer = {
              __type: 'File',
              url: resx.url,
              name: resx.name
            };
            json = {
              ...json,
              [dat[1]]: filer
            };
          }
        });
        promises.push(request);
      } else if (dat[0] === 'addRelation') {
        json = {
          ...json,
          [dat[1]]: {
            __op: 'AddRelation',
            objects: []
          }
        };

        dat[2].forEach(objectId => {
          json[dat[1]].objects.push({
            __type: 'Pointer',
            objectId,
            className: '_User'
          });
        });
      } else if (dat[0] === 'removeRelation') {
        json = {
          ...json,
          [dat[1]]: {
            __op: 'RemoveRelation',
            objects: []
          }
        };

        dat[2].forEach(objectId => {
          json[dat[1]].objects.push({
            __type: 'Pointer',
            objectId,
            className: '_User'
          });
        });
      } else if (dat[0] === 'acl') {
        json = {
          ...json,
          ACL: {}
        };

        Object.keys(dat[1]).forEach(key => {
          const inKey = Tools.get.stringSplitter(key, ':', 0);
          if (inKey === 'default') {
            json.ACL = {
              ...json.ACL,
              '*': dat[1][key]
            };
          } else if (inKey === 'role' || inKey === 'user') {
            json.ACL = {
              ...json.ACL,
              [key]: dat[1][key]
            };
          }
        });
      }
    });

    $.when.apply(null, promises).done(() => {
      resolve(json);
    });
  });
};

export default Index;
