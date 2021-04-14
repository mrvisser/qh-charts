import * as Highcharts from 'highcharts';
import brokenAxis from 'highcharts/modules/broken-axis';
import 'moment-duration-format';

/** React date range styles. */
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

/** Highcharts setup. */
brokenAxis(Highcharts);
