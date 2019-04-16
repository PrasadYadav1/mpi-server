const t = require("tcomb");
const m = require('moment');

const StringNumber = t.refinement(t.String, s => !isNaN(s),'should be Number');
const StringPositiveInteger = t.refinement(
  t.String,
  s => !isNaN(s) && s % 1 === 0 && parseInt(s) > 0,
  "Should be Integer which is greater than 0"
);
const PositiveInteger = t.refinement(
  t.Number,
  n => n % 1 === 0 && n > 0,
  "Integer Should be Positive"
);
const EmptyOrElementsList = type =>
  t.refinement(
    t.list(type),
    list => list.length >= 0,
    "should be empty list or valid list of elements"
  );

  const NonEmptyString = t.refinement(
    t.String,
    s => s.replace(/\s/g, '')!=="",
    "string should not be empty"
  );
  
  const EmptyString = t.refinement(
    t.String,
    s => s.replace(/\s/g, '') === "",
    ""
  );

  const FormatedDate = dateFormat => t.refinement(t.String, ds => m(ds,dateFormat,true).isValid(),`should be valid date of format ${dateFormat}`)

const EmptyOrFormatedDate = dateFormat => t.refinement(t.String,ds => ds === '' || m(ds,dateFormat,true).isValid(),"should be either empty or it should be in " + dateFormat + " format")

const Range = (from,to,step=1) => {
  if(from === null || from === undefined) throw new Error("from is required")
  if(isNaN(from)) throw new Error("from shpuld be integer")
  if(from < 0) throw new Error("from shpuld be positive integer")
  if(to === null || to === undefined) throw new Error("to is required")
  if(isNaN(to)) throw new Error("to shpuld be integer")
  if(to < 0) throw new Error("to should be positive integer")
  if(isNaN(step)) throw new Error("step shpuld be integer")
  
  return Array((to-from)/step).fill(from).map((x,y) => x+y*step)
}

const SpecifiedNumberOfElementsList = (type, noOfElements) =>
  t.refinement(
    t.list(type),
    list => list.length === noOfElements,
    `should be list with ${noOfElements} Elements`
  );

const SpecificStringsList = (allowedElements) =>
  t.refinement(
    t.list(t.String),
    list => list.length > 0 && list.every((e) => allowedElements.some((se) => se === e)),
    `should be array of strings with ${allowedElements.join()} values`
  )

  const NonEmptyList = type =>
  t.refinement(
    t.list(type),
    list => list.length > 0,
    "should not be empty array"
  );

  const isArray = (value) => value && typeof value === 'object' && value.constructor === Array;

module.exports = {
  StringNumber,
  PositiveInteger,
  StringPositiveInteger,
  EmptyOrElementsList,
  NonEmptyString,
  FormatedDate,
  EmptyOrFormatedDate,
  EmptyString,
  Range,
  SpecifiedNumberOfElementsList,
  SpecificStringsList,
  NonEmptyList,
  isArray
};
