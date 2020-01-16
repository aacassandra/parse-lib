/* eslint-disable import/no-cycle */
/* eslint-disable no-async-promise-executor */
import ParseData from '@aacassandra/parse-config';
import ObjectSet from './objectSet';

const Index = (data, masterKey = false) => {
  const Config = ParseData.config;
  return new Promise(async resolve => {
    const json = {
      requests: []
    };

    let url;
    if (Config.surl && Config.surl !== 'none') {
      url = `/${Config.surl}`;
    } else {
      url = '';
    }

    const promises = data.map(async item => {
      const method = item.method.toUpperCase();
      if (method === 'POST') {
        const body = await ObjectSet(item.data, masterKey);
        json.requests.push({
          method,
          path: `${url}/classes/${item.className}`,
          body
        });
      } else if (method === 'PUT') {
        const body = await ObjectSet(item.data, masterKey);
        json.requests.push({
          method,
          path: `${url}/classes/${item.className}/${item.objectId}`,
          body
        });
      } else if (method === 'DELETE') {
        json.requests.push({
          method,
          path: `${url}/classes/${item.className}/${item.objectId}`
        });
      }
    });

    await Promise.all(promises);
    resolve(json);
  });
};

export default Index;
