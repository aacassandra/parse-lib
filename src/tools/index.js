/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
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
