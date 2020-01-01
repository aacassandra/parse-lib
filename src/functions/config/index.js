import ParseData from '@aacassandra/parse-config';

const Index = (
  config = {
    mode: '',
    protocol: '',
    host: '',
    port: '',
    socket: '',
    surl: '',
    appId: '',
    clientKey: '',
    jsKey: '',
    resKey: '',
    masterKey: '',
    revocableSession: '',
    headerAppId: '',
    headerClientKey: '',
    headerResKey: '',
    headerMasterKey: '',
    headerRevocableSession: '',
    headerSessionToken: ''
  }
) => {
  ParseData.setConfig(config);
};

export default Index;
