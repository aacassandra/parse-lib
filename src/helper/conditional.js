const Index = where => {
  let conditional = {};
  where.forEach(wh => {
    Object.keys(wh).forEach(key => {
      if (key === 'equalTo') {
        conditional = {
          ...conditional,
          [wh.object]: wh.equalTo
        };
      } else if (key === 'equalToPointer') {
        conditional = {
          ...conditional,
          [wh.object]: {
            __type: 'Pointer',
            objectId: wh.objectId,
            className: wh.className
          }
        };
      } else if (key === 'notEqualTo') {
        conditional = {
          ...conditional,
          [wh.object]: {
            $ne: wh.notEqualTo
          }
        };
      } else if (key === 'notEqualToPointer') {
        conditional = {
          ...conditional,
          [wh.object]: {
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
          [wh.object]: {
            $in: wh.containedIn // in array
          }
        };
      } else if (key === 'notContainedIn') {
        conditional = {
          ...conditional,
          [wh.object]: {
            $nin: wh.notContainedIn // in array
          }
        };
      } else if (key === 'greaterThan') {
        let i = 0;
        Object.keys(conditional).forEach(con => {
          if (con === wh.object) {
            i += 1;
          }
        });

        if (i) {
          conditional[wh.object] = {
            ...conditional[wh.object],
            $gt: wh.greaterThan
          };

          if (wh.lessThan) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $lt: wh.lessThan
            };
          } else if (wh.lessThanOrEqualTo) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $lte: wh.lessThanOrEqualTo
            };
          }
        } else {
          conditional = {
            ...conditional,
            [wh.object]: {
              $gt: wh.greaterThan
            }
          };

          if (wh.lessThan) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $lt: wh.lessThan
            };
          } else if (wh.lessThanOrEqualTo) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $lte: wh.lessThanOrEqualTo
            };
          }
        }
      } else if (key === 'greaterThanOrEqualTo') {
        let i = 0;
        Object.keys(conditional).forEach(con => {
          if (con === wh.object) {
            i += 1;
          }
        });

        if (i) {
          conditional[wh.object] = {
            ...conditional[wh.object],
            $gte: wh.greaterThanOrEqualTo
          };

          if (wh.lessThan) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $lt: wh.lessThan
            };
          } else if (wh.lessThanOrEqualTo) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $lte: wh.lessThanOrEqualTo
            };
          }
        } else {
          conditional = {
            ...conditional,
            [wh.object]: {
              $gte: wh.greaterThanOrEqualTo
            }
          };

          if (wh.lessThan) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $lt: wh.lessThan
            };
          } else if (wh.lessThanOrEqualTo) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $lte: wh.lessThanOrEqualTo
            };
          }
        }
      } else if (key === 'lessThan') {
        let i = 0;
        Object.keys(conditional).forEach(con => {
          if (con === wh.object) {
            i += 1;
          }
        });

        if (i) {
          conditional[wh.object] = {
            ...conditional[wh.object],
            $lt: wh.lessThan
          };

          if (wh.greaterThan) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $gt: wh.greaterThan
            };
          } else if (wh.greaterThanOrEqualTo) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $gte: wh.greaterThanOrEqualTo
            };
          }
        } else {
          conditional = {
            ...conditional,
            [wh.object]: {
              $lt: wh.lessThan
            }
          };

          if (wh.greaterThan) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $gt: wh.greaterThan
            };
          } else if (wh.greaterThanOrEqualTo) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $gte: wh.greaterThanOrEqualTo
            };
          }
        }
      } else if (key === 'lessThanOrEqualTo') {
        let i = 0;
        Object.keys(conditional).forEach(con => {
          if (con === wh.object) {
            i += 1;
          }
        });

        if (i) {
          conditional[wh.object] = {
            ...conditional[wh.object],
            $lte: wh.lessThanOrEqualTo
          };

          if (wh.greaterThan) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $gt: wh.greaterThan
            };
          } else if (wh.greaterThanOrEqualTo) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $gte: wh.greaterThanOrEqualTo
            };
          }
        } else {
          conditional = {
            ...conditional,
            [wh.object]: {
              $lte: wh.lessThanOrEqualTo
            }
          };

          if (wh.greaterThan) {
            conditional[wh.object] = {
              ...conditional[wh.object],
              $gt: wh.greaterThan
            };
          } else if (wh.greaterThanOrEqualTo) {
            conditional[wh.object] = {
              ...conditional[wh.object],
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
