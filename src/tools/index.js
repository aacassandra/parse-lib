/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

// Convert a base64 string into a binary Uint8 Array
// https://gist.github.com/borismus/1032746
const convertDataURIToBinary = dataURI => {
  const BASE64_MARKER = ';base64,';
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
};

const init = (date = null) => {
  let _date;
  if (date == null) {
    _date = new Date();
  } else {
    _date = new Date(date);
  }
  return _date;
};

const property = (date = new Date(), utc = false, string = false) => {
  if (date === '' || date === null || date === undefined) {
    date = new Date();
  } else {
    date = new Date(date);
  }

  let _dd = utc ? date.getUTCDate() : date.getDate();
  let _mm = utc ? date.getUTCMonth() : date.getMonth(); // January is 0!
  let _yyyy = utc ? date.getUTCFullYear() : date.getFullYear();
  let _h = utc ? date.getUTCHours() : date.getHours();
  let _m = utc ? date.getUTCMinutes() : date.getMinutes();
  let _s = utc ? date.getUTCSeconds() : date.getSeconds();

  const fix = {
    string(d) {
      if (d <= 9) {
        d = `0${d}`;
      } else {
        let _dd_ = d;
        _dd_ = _dd_.toString();
        d = _dd_;
      }
      return d;
    }
  };

  if (string) {
    _yyyy = _yyyy.toString();
    _dd = fix.string(_dd);
    _mm = fix.string(_mm + 1);

    _h = fix.string(_h);
    _m = fix.string(_m);
    _s = fix.string(_s);
  }

  const fixProperty = {
    original: date,
    year: _yyyy,
    month: _mm,
    day: _dd,
    hour: _h,
    minute: _m,
    second: _s
  };
  return fixProperty;
};

const tools = {
  get: {
    file: {
      property: f => {
        return new Promise(resolve => {
          let blobURL;
          let fileName;
          let response = {
            status: false,
            output: null
          };
          if (f) {
            if (/(jpe?g|png|gif)$/i.test(f.type)) {
              const r = new FileReader();
              r.onload = e => {
                const base64Img = e.target.result;
                const binaryImg = convertDataURIToBinary(base64Img);
                const blob = new Blob([binaryImg], { type: f.type });
                blobURL = window.URL.createObjectURL(blob);
                fileName = f.name;

                const output = {
                  nameImg: fileName,
                  typeImg: f.type,
                  sizeImg: f.size,
                  base64Url: base64Img,
                  blobUrl: blobURL,
                  base64Img,
                  blobImg: blobURL,
                  binaryImg
                };

                response = {
                  status: true,
                  output
                };
                resolve(response);
              };
              r.readAsDataURL(f);
            } else {
              response.output = 'Failed file type';
              resolve(response);
            }
          } else {
            response.output = 'Failed to load file';
            resolve(response);
          }
        });
      }
    },
    stringSplitter: (str = '', spliter = '', row = 0) => {
      return str.split(spliter)[row];
    },
    date(date = null, utc = false, plusDate = 0) {
      const set = {
        date(
          _date = {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0
          }
        ) {
          const _yyyy = _date.year;
          let _mm = _date.month;
          let _dd = _date.day;
          let _h = _date.hour;
          let _m = _date.minute;
          let _s = _date.second;

          if (_dd < 10) {
            _dd = `0${_dd}`;
          }

          _mm += 1;
          if (_mm < 10) {
            _mm = `0${_mm}`;
          }

          if (_h < 10) {
            _h = `0${_h}`;
          }

          if (_m < 10) {
            _m = `0${_m}`;
          }

          if (_s < 10) {
            _s = `0${_s}`;
          }

          const fix = `${_yyyy}-${_mm}-${_dd} ${_h}:${_m}:${_s}`;
          return fix;
        }
      };

      date = init(date);
      if (plusDate) {
        date.setDate(date.getDate() + plusDate);
      }
      date = property(date, utc);
      date = set.date(date);
      return date;
    }
  }
};

export default tools;
