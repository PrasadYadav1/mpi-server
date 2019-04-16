const m = require("moment");

const today = outPutFormatString => m().format(outPutFormatString);

const thisWeek = (weekStartDayInt, weekEndDayInt, outPutFormatString) => {
  // const startOfWeek = m()
  //   .startOf("isoWeek")
  //   .isoWeekday(weekStartDayInt);
  const startOfWeek = [0,6,5,4].indexOf(m().day())!= -1 ?
              m()
                .add(1,'weeks')
                .startOf("isoWeek")
                .isoWeekday(-6)
              : m()
              .startOf("isoWeek")
              .isoWeekday(-6)
              
  return {
   // start: startOfWeek.format(outPutFormatString),
   start: m(startOfWeek).format(outPutFormatString),
    end: m(startOfWeek).add(6, "days").format(outPutFormatString)
  };
};

const thisMonth = outPutFormatString => ({
  start: m()
    .startOf("month")
    .format(outPutFormatString),
  end: m()
    .endOf("month")
    .format(outPutFormatString)
});

const previousWeek = (weekStartDayInt, weekEnddayInt, outPutFormatString) => ({
  start: m()
    .subtract(1, "weeks")
    .startOf("isoWeek")
    .isoWeekday(weekStartDayInt)
    .format(outPutFormatString),
  end: m()
    .subtract(1, "weeks")
    .endOf("isoWeek")
    .isoWeekday(weekEnddayInt)
    .format(outPutFormatString)
});

const yearTillDate = outPutFormatString => ({
  start: m()
    .startOf("year")
    .format(outPutFormatString),
  end: m().format(outPutFormatString)
});

const lastMonth = outPutFormatString => ({
  start: m()
    .subtract(1, "month")
    .startOf("month")
    .format(outPutFormatString),
  end: m()
    .subtract(1, "month")
    .endOf("month")
    .format(outPutFormatString)
});

const Q1 = outPutFormatString => ({
  start: m()
    .month(0)
    .startOf("month")
    .format(outPutFormatString),
  end: m()
    .month(2)
    .endOf("month")
    .format(outPutFormatString)
});

const Q2 = outPutFormatString => ({
  start: m()
    .month(3)
    .startOf("month")
    .format(outPutFormatString),
  end: m()
    .month(5)
    .endOf("month")
    .format(outPutFormatString)
});

const Q3 = outPutFormatString => ({
  start: m()
    .month(6)
    .startOf("month")
    .format(outPutFormatString),
  end: m()
    .month(8)
    .endOf("month")
    .format(outPutFormatString)
});

const Q4 = outPutFormatString => ({
  start: m()
    .month(9)
    .startOf("month")
    .format(outPutFormatString),
  end: m()
    .month(11)
    .endOf("month")
    .format(outPutFormatString)
});

const thisyear = outPutFormatString => ({
  start: m()
    .startOf("year")
    .format(outPutFormatString),
  end: m()
    .endOf("year")
    .format(outPutFormatString)
});

const ByWeek = (weekNo,outPutFormatString,startOfWeekDayString) => {
 const start = m().day(startOfWeekDayString).week(weekNo)
 return {start: start.format(outPutFormatString),
         end: start.add(6,'days').format(outPutFormatString) } 
};

const ByMonth = (monthNo,outPutFormatString) => {
  const year = m().year().toString();
  const start = m( year +"-" + monthNo.toString() + "-" + "01")
 return {start: start.format(outPutFormatString),
         end: m(year+"-"+monthNo.toString()+ "-"+ start.daysInMonth()).format(outPutFormatString) } 
};

module.exports = {
  today,
  thisWeek,
  thisMonth,
  previousWeek,
  yearTillDate,
  lastMonth,
  Q1,
  Q2,
  Q3,
  Q4,
  thisyear,
  ByWeek,
  ByMonth
};
