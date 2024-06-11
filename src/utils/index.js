"use strict";

const _ = require("lodash");
const getInforData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const ToColumnDataSelect = (select = []) => {
  const objectSelect = Object.fromEntries(select.map((item) => [item, 1]));
  return objectSelect;
};

const ToColumnDataUnSelect = (select = []) => {
  const objectUnSelect = Object.fromEntries(select.map((item) => [item, 0]));
  return objectUnSelect;
};

// const RemoveUndefined = (object = {})=>{
//     return _.pickBy(object, _.identity);
// }

const RemoveUndefined = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      newObj[key] = RemoveUndefined(obj[key]);
    } else if (obj[key] !== undefined && obj[key] !== null) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

const FlattenObject = (obj, parent, res = {}) => {
    for(let key in obj) {
        let propName = parent ? parent + '.' + key : key;
        if(typeof obj[key] == 'object') {
            FlattenObject(obj[key], propName, res);
        } else {
            res[propName] = obj[key];
        }
    }
    return res;
}

module.exports = {
  getInforData,
  ToColumnDataSelect,
  ToColumnDataUnSelect,
  RemoveUndefined,
  FlattenObject
};
