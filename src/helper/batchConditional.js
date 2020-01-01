import * as jQuery from 'jquery';
import ObjectSet from './objectSet';
import ParseData from '@aacassandra/parse-config';

const $ = jQuery;

const Index = (data, masterKey = false) => {
  const Config = ParseData.config;
  return new Promise(resolve => {
    const json = {
      requests: []
    };

    const promises = [];
    data.forEach(async item => {
      const method = item.method.toUpperCase();
      if (method === 'POST') {
        const body = await ObjectSet(item.data, masterKey);
        json.requests.push({
          method,
          path: `/${Config.surl}/classes/${item.className}`,
          body
        });
      } else if (method === 'PUT') {
        const body = await ObjectSet(item.data, masterKey);
        json.requests.push({
          method,
          path: `/${Config.surl}/classes/${item.className}/${item.objectId}`,
          body
        });
      } else if (method === 'DELETE') {
        json.requests.push({
          method,
          path: `/${Config.surl}/classes/${item.className}/${item.objectId}`
        });
      }
    });

    $.when.apply(null, promises).done(() => {
      resolve(json);
    });
  });
};

export default Index;
