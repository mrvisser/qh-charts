import * as Highcharts from 'highcharts';
import brokenAxis from 'highcharts/modules/broken-axis';
import moment from 'moment-timezone';

brokenAxis(Highcharts);
Highcharts.setOptions({
  time: {
    timezoneOffset: moment.tz('America/Toronto').toDate().getTimezoneOffset(),
  },
});
