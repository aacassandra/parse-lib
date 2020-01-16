/* eslint-disable import/no-cycle */
import ParseData from '@aacassandra/parse-config';
import Conditional from './conditional';
import ObjectSet from './objectSet';
import BatchConditional from './batchConditional';

const Helper = {
  parse: {
    handleParseError(xhr) {
      let response = {
        output: {},
        status: true
      };
      if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 201)) {
        const output = JSON.parse(xhr.responseText);
        if (
          output.results &&
          output.results.constructor &&
          output.results.constructor.name === 'Array'
        ) {
          if (!output.results.length) {
            if (!output.count) {
              response = {
                output: {
                  code: 404,
                  message: 'No data available'
                },
                status: false
              };
            }
          }
        }
      } else if (xhr.responseText === 'TypeError: Failed to fetch') {
        response = {
          output: {
            code: 0,
            message: 'Connection refused'
          },
          status: false
        };
      } else {
        const output = JSON.parse(xhr.responseText);
        if (output.code && output.error) {
          response = {
            output: {
              code: output.code,
              message: output.error
            },
            status: false
          };
        } else if (xhr.statusText) {
          response = {
            output: {
              code: xhr.status,
              message: xhr.statusText
            },
            status: false
          };
        } else if (output.error) {
          response = {
            output: {
              code: xhr.status,
              message: output.error
            },
            status: false
          };
        } else {
          response = {
            output: {
              code: xhr.status,
              message: ''
            },
            status: false
          };
        }
      }
      Helper.parse.logWritter(response);
      return response;
    },
    logWritter(response) {
      if (!response.status) {
        if (ParseData.mode === 'development') {
          console.error(response);
        }
      }
    },
    dependecyRequired(dependency = []) {
      let i = 0;
      dependency.forEach(dep => {
        if (dep === '') {
          i += 1;
        }

        if (dep.length === 0) {
          i += 1;
        }

        if (Object.keys(dep).length === 0) {
          if (!dep.name && !dep.size) {
            i += 1;
          } else {
            // If file as a image
          }
        }
      });

      if (i) {
        const res = {
          output: 'Dependency is invalid',
          status: false
        };
        Helper.parse.logWritter(res);
        return res;
      }
      return {
        output: '',
        status: true
      };
    }
  }
};

const ParseBatchConditional = BatchConditional;
const ParseObjectSet = ObjectSet;
const ParseConditional = Conditional;
const ParseHandleError = Helper.parse.handleParseError;
const ParseDependency = Helper.parse.dependecyRequired;
export {
  ParseConditional,
  ParseHandleError,
  ParseDependency,
  ParseObjectSet,
  ParseBatchConditional
};
