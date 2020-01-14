/* eslint-disable no-async-promise-executor */
import ParseData from '@aacassandra/parse-config';

// import Initialize from '../initialize';

const { XMLHttpRequest } = require('xmlhttprequest');

const Index = blob => {
  return new Promise(async res => {
    const Config = ParseData.config;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open('POST', 'http://localhost:1337/parse/files/percobaan1.jpg', true);
    xhr.setRequestHeader(Config.headerAppId, Config.appId);
    xhr.setRequestHeader(Config.headerResKey, Config.resKey);

    xhr.onload = async () => {
      res({
        xhr,
        status: true
      });
    };

    xhr.onerror = () => {
      res({
        xhr,
        status: false
      });
    };

    xhr.send(blob);
  });
};

export default Index;
