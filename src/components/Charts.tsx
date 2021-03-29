import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import moment from 'moment-timezone';
import React from 'react';
import { map } from 'rxjs/operators';
import styled from 'styled-components';

import { useObservable } from '../hooks/useObservable';
import { MetricsStoreContext } from '../services/MetricsStore';

const ChartHeading = styled.h2`
  font-weight: 500;
  text-align: center;
  text-transform: 'uppercase';
`;

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
  const [highchartsOptions, setHighchartsOptions] = React.useState<
    {
      title: string;
      options: Highcharts.Options;
    }[]
  >();

  React.useEffect(() => {
    if (bloodGlucoseData !== undefined) {
      const allValues = bloodGlucoseData.flatMap((bg) =>
        bg.data.map((p) => p[1]),
      );
      const min = Math.min(4, ...allValues);
      const max = Math.max(7, ...allValues);
      const yMinMax = { max, min };
      setHighchartsOptions(
        bloodGlucoseData.map(({ data, day }) => {
          const m = moment.tz(day, 'America/Toronto');
          const xMinMax = {
            max: m.endOf('day').toDate().getTime(),
            min: m.startOf('day').toDate().getTime(),
          };
          return {
            options: createHighchartsOptionsForDay(data, xMinMax, yMinMax),
            title: m.format('dddd, MMMM, Do'),
          };
        }),
      );
    } else {
      setHighchartsOptions(undefined);
    }
  }, [bloodGlucoseData]);

  return (
    <div>
      {highchartsOptions !== undefined
        ? highchartsOptions.map(({ title, options }) => {
            return (
              <div key={title}>
                <ChartHeading>{title}</ChartHeading>
                <HighchartsReact highcharts={Highcharts} options={options} />
              </div>
            );
          })
        : undefined}
    </div>
  );
};

function createHighchartsOptionsForDay(
  data: (readonly [number, number])[],
  xMinMax: { min: number; max: number },
  yMinMax: {
    min: number;
    max: number;
  },
): Highcharts.Options {
  return {
    chart: {
      type: 'spline',
    },
    colors: ['rgba(255, 102, 102, 1)'],
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        gapSize: 30 * 60 * 1000,
        gapUnit: 'value',
        marker: {
          enabled: true,
          radius: 3,
        },
      },
    },
    series: [
      {
        data,
        name: 'mmol/L',
        type: 'spline',
      },
    ],
    title: {
      text: '',
    },
    xAxis: {
      ...xMinMax,
      dateTimeLabelFormats: {
        day: '%H:%M',
      },
      labels: {
        rotation: -45,
      },
      type: 'datetime',
    },
    yAxis: {
      ...yMinMax,
      plotBands: [
        {
          color: 'rgba(87, 220, 140, 0.2)',
          from: 4.1,
          to: 6,
        },
      ],
      tickInterval: 0.5,
      title: {
        text: '',
      },
    },
  };
}
