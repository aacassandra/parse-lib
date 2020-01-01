import ParseData from '@aacassandra/parse-config';

const Index = () => {
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

export default Index;
