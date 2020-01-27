/* eslint-disable no-async-promise-executor */
import Tools from '../tools';
// eslint-disable-next-line import/no-cycle
import ParseFile from '../functions/files';

const Index = (data, masterKey = false) => {
  return new Promise(async resolve => {
    let json = {};
    const promises = data.map(async dat => {
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
        } else if (dat[0] === 'geopoint') {
          const geopoint = {
            __type: 'GeoPoint',
            latitude: dat[2] * 1,
            longitude: dat[3] * 1
          };

          json = {
            ...json,
            [dat[1]]: geopoint
          };
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
              className: dat[3]
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
              className: dat[3]
            });
          });
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
      } else if (dat[0] === 'file') {
        await ParseFile.upload(dat[2], {
          masterKey
        }).then(response => {
          const filer = {
            __type: 'File',
            url: response.output.url,
            name: response.output.name
          };
          json = {
            ...json,
            [dat[1]]: filer
          };
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

    await Promise.all(promises);
    resolve(json);
  });
};

export default Index;
