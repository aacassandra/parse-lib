const Index = where => {
  let conditional = {};
  where.forEach(wh => {
    Object.keys(wh).forEach(key => {
      if (key === 'equalTo') {
        conditional = {
          ...conditional,
          [wh.column]: wh.equalTo
        };
      } else if (key === 'equalToPointer') {
        conditional = {
          ...conditional,
          [wh.column]: {
            __type: 'Pointer',
            objectId: wh.objectId,
            className: wh.className
          }
        };
      } else if (key === 'notEqualTo') {
        conditional = {
          ...conditional,
          [wh.column]: {
            $ne: wh.notEqualTo
          }
        };
      } else if (key === 'notEqualToPointer') {
        conditional = {
          ...conditional,
          [wh.column]: {
            $ne: {
              __type: 'Pointer',
              objectId: wh.objectId,
              className: wh.className
            }
          }
        };
      } else if (key === 'containedIn') {
        conditional = {
          ...conditional,
          [wh.column]: {
            $in: wh.containedIn // in array
          }
        };
      } else if (key === 'notContainedIn') {
        conditional = {
          ...conditional,
          [wh.column]: {
            $nin: wh.notContainedIn // in array
          }
        };
      } else if (key === 'greaterThan') {
        let i = 0;
        Object.keys(conditional).forEach(con => {
          if (con === wh.column) {
            i += 1;
          }
        });

        if (i) {
          conditional[wh.column] = {
            ...conditional[wh.column],
            $gt: wh.greaterThan
          };

          if (wh.lessThan) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $lt: wh.lessThan
            };
          } else if (wh.lessThanOrEqualTo) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $lte: wh.lessThanOrEqualTo
            };
          }
        } else {
          conditional = {
            ...conditional,
            [wh.column]: {
              $gt: wh.greaterThan
            }
          };

          if (wh.lessThan) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $lt: wh.lessThan
            };
          } else if (wh.lessThanOrEqualTo) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $lte: wh.lessThanOrEqualTo
            };
          }
        }
      } else if (key === 'greaterThanOrEqualTo') {
        let i = 0;
        Object.keys(conditional).forEach(con => {
          if (con === wh.column) {
            i += 1;
          }
        });

        if (i) {
          conditional[wh.column] = {
            ...conditional[wh.column],
            $gte: wh.greaterThanOrEqualTo
          };

          if (wh.lessThan) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $lt: wh.lessThan
            };
          } else if (wh.lessThanOrEqualTo) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $lte: wh.lessThanOrEqualTo
            };
          }
        } else {
          conditional = {
            ...conditional,
            [wh.column]: {
              $gte: wh.greaterThanOrEqualTo
            }
          };

          if (wh.lessThan) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $lt: wh.lessThan
            };
          } else if (wh.lessThanOrEqualTo) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $lte: wh.lessThanOrEqualTo
            };
          }
        }
      } else if (key === 'lessThan') {
        let i = 0;
        Object.keys(conditional).forEach(con => {
          if (con === wh.column) {
            i += 1;
          }
        });

        if (i) {
          conditional[wh.column] = {
            ...conditional[wh.column],
            $lt: wh.lessThan
          };

          if (wh.greaterThan) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $gt: wh.greaterThan
            };
          } else if (wh.greaterThanOrEqualTo) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $gte: wh.greaterThanOrEqualTo
            };
          }
        } else {
          conditional = {
            ...conditional,
            [wh.column]: {
              $lt: wh.lessThan
            }
          };

          if (wh.greaterThan) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $gt: wh.greaterThan
            };
          } else if (wh.greaterThanOrEqualTo) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $gte: wh.greaterThanOrEqualTo
            };
          }
        }
      } else if (key === 'lessThanOrEqualTo') {
        let i = 0;
        Object.keys(conditional).forEach(con => {
          if (con === wh.column) {
            i += 1;
          }
        });

        if (i) {
          conditional[wh.column] = {
            ...conditional[wh.column],
            $lte: wh.lessThanOrEqualTo
          };

          if (wh.greaterThan) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $gt: wh.greaterThan
            };
          } else if (wh.greaterThanOrEqualTo) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $gte: wh.greaterThanOrEqualTo
            };
          }
        } else {
          conditional = {
            ...conditional,
            [wh.column]: {
              $lte: wh.lessThanOrEqualTo
            }
          };

          if (wh.greaterThan) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $gt: wh.greaterThan
            };
          } else if (wh.greaterThanOrEqualTo) {
            conditional[wh.column] = {
              ...conditional[wh.column],
              $gte: wh.greaterThanOrEqualTo
            };
          }
        }
      }
    });
  });

  conditional = JSON.stringify(conditional);
  return conditional;
};

export default Index;
