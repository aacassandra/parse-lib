import { ParseLQ } from '@aacassandra/parse-live-query';
import ParseData from '@aacassandra/parse-config';

export default () => {
  return new Promise(res => {
    const Config = ParseData.config;
    let serverURL;
    if (Config.surl && Config.surl !== 'none') {
      serverURL = `${Config.socket}://${Config.host}:${Config.port}/${Config.surl}`;
    } else {
      serverURL = `${Config.socket}://${Config.host}:${Config.port}`;
    }

    const ws = new ParseLQ(
      {
        serverURL,
        applicationId: Config.appId,
        javascriptKey: Config.jsKey,
        clientKey: Config.clientKey
      },
      ParseData.mode
    );

    res(ws);
  });
};
