import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import moment from 'moment-timezone';
import React from 'react';
import { map } from 'rxjs/operators';

import { useObservable } from '../hooks/useObservable';
import { MetricsStoreContext } from '../services/MetricsStore';

export const Charts: React.FC = () => {
  const metricsStore = React.useContext(MetricsStoreContext);
  const [bloodGlucoseData] = useObservable(
    () =>
      metricsStore.bloodGlucose$
        .pipe(
          map((ms) =>
            ms !== undefined
              ? ms.map(({ time, value }) => [time.getTime(), value] as const)
              : undefined,
          ),
        )
        .pipe(
          map((ms) => {
            if (ms !== undefined) {
              return _.chain(ms)
                .groupBy(([time]) => moment(time).format('YYYY-MM-DD'))
                .toPairs()
                .map(([day, data]) => ({ data, day }))
                .sortBy('day')
                .value();
            } else {
              return undefined;
            }
          }),
        ),
    [metricsStore],
  );
  return (
    <div>
      {bloodGlucoseData !== undefined
        ? bloodGlucoseData.map(({ day, data }) => {
            return (
              <div key={day}>
                <h2>
                  {moment.tz(day, 'America/Toronto').format('dddd, MMMM Do')}
                </h2>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'spline',
                    },
                    colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
                    plotOptions: {
                      series: {
                        marker: {
                          enabled: true,
                        },
                      },
                    },
                    series: [
                      {
                        data,
                        name: 'Blood Glucose',
                      },
                    ],
                    title: {
                      text: '',
                    },
                    xAxis: {
                      type: 'datetime',
                    },
                    yAxis: {
                      max: 10,
                      min: 2,
                      title: {
                        text: 'Blood Glucose (mmol/L)',
                      },
                    },
                  }}
                />
              </div>
            );
          })
        : undefined}
    </div>
  );
};
