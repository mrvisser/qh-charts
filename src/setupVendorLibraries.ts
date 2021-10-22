import * as Highcharts from 'highcharts';
import brokenAxis from 'highcharts/modules/broken-axis';
import exportData from 'highcharts/modules/export-data';
import exporting from 'highcharts/modules/exporting';

import 'moment-duration-format';

/** React date range styles. */
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

/** Highcharts setup. */
brokenAxis(Highcharts);
exporting(Highcharts);
exportData(Highcharts);
