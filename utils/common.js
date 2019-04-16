const moment = require('moment');

const formatDateString = (dateString,formatString) =>
  moment(dateString).format(formatString)

  var gpfn = (acc,current,prop) => {
    if(acc[current[prop]]) { 
     acc[current[prop]].push(current); return acc}
     else { acc[current[prop]] = [current]
            return acc
    }
 }
 const groupByArrayOfObjects = (arr,prop) => {
   if(arr.constructor !== Array) throw new Error("input should be array")
   if(prop === undefined || prop === null || typeof prop !== 'string') throw new Error("prop should be string and mandatory")
   return  arr.reduce((acc,current) => gpfn(acc,current,prop),{})
 }

 const getOrDefaultValue = (data,defaultValue) =>  data ? data : defaultValue 

 const getJavascriptData = (jsonString) => {
   try {
     return  {data: JSON.parse(jsonString), isValid: true}   
   } catch (error) {
     return { data: null, isValid: false}
   }
 }

module.exports = { formatDateString, groupByArrayOfObjects,getOrDefaultValue, getJavascriptData}