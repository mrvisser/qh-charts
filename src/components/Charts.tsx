import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import moment from 'moment-timezone';
import React from 'react';
import { map } from 'rxjs/operators';
import styled from 'styled-components';

import { useMatchMedia } from '../hooks/useMatchMedia';
import { useObservable } from '../hooks/useObservable';
import { MetricsStoreContext } from '../services/MetricsStore';

const nChartsPerPage = 3;

const ChartsContainer = styled.div`
  margin: auto;
`;

const PageGroup = styled.div`
  break-after: always;
  break-inside: avoid;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  @media print {
    height: 8.5in;
    width: 11in;
  }
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px;

  &.hidden {
    display: none;
  }

  @media print {
    &.hidden {
      display: flex;
      visibility: hidden;
    }
  }
`;

const ChartHeading = styled.h2`
  font-weight: 600;
  margin: 5px 0 0 0;
  text-align: center;
  text-transform: uppercase;
`;

const Chart = styled.div`
  flex: 1;
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
      hidden: boolean;
      options: Highcharts.Options;
      title: string;
    }[][]
  >();
  const chartsRef = React.useRef<{ [title: string]: Highcharts.Chart }>({});
  const isPrintMedia = useMatchMedia('print');

  React.useEffect(() => {
    Object.values(chartsRef.current).forEach((c) => {
      c.reflow();
    });
  }, [chartsRef, isPrintMedia]);

  React.useEffect(() => {
    if (bloodGlucoseData !== undefined) {
      const allValues = bloodGlucoseData.flatMap((bg) =>
        bg.data.map((p) => p[1]),
      );
      const min = Math.floor(Math.min(4, ...allValues));
      const max = Math.ceil(Math.max(7, ...allValues));
      const yMinMax = { max, min };
      setHighchartsOptions(
        _.chunk(
          bloodGlucoseData.map(({ data, day }) => {
            const m = moment.tz(day, 'America/Toronto');
            const xMinMax = {
              max: m.endOf('day').toDate().getTime(),
              min: m.startOf('day').toDate().getTime(),
            };
            return {
              hidden: false,
              options: createHighchartsOptionsForDay(data, xMinMax, yMinMax),
              title: m.format('dddd, MMMM Do'),
            };
          }),
          nChartsPerPage,
        ),
      );
    } else {
      setHighchartsOptions(undefined);
    }
  }, [bloodGlucoseData]);

  return (
    <ChartsContainer>
      {highchartsOptions !== undefined
        ? highchartsOptions.map((pageGroup) => (
            <PageGroup key={`page-group-${pageGroup[0].title}`}>
              {pageGroup
                .concat(
                  new Array(nChartsPerPage - pageGroup.length).fill({
                    ...pageGroup[0],
                    hidden: true,
                  }),
                )
                .map(({ hidden = false, title, options }, i) => {
                  return (
                    <ChartContainer
                      className={hidden ? 'hidden' : 'visible'}
                      key={i}
                    >
                      <ChartHeading>{title}</ChartHeading>
                      <Chart>
                        <HighchartsReact
                          callback={(chart: Highcharts.Chart) =>
                            (chartsRef.current[title] = chart)
                          }
                          highcharts={Highcharts}
                          key={`chart-${title}`}
                          options={options}
                        />
                      </Chart>
                    </ChartContainer>
                  );
                })}
            </PageGroup>
          ))
        : undefined}
    </ChartsContainer>
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
  const values = data.map((p) => p[1]);
  const dayMax = Math.max(...values);
  const dayAvg =
    values.length > 0
      ? Math.round(
          (values.reduce((acc, v) => acc + v, 0) * 10) / values.length,
        ) / 10
      : undefined;
  const dayMin = Math.min(...values);
  let maxLabel: Highcharts.SVGElement | undefined = undefined;
  let avgLabel: Highcharts.SVGElement | undefined = undefined;

  return {
    chart: {
      events: {
        render() {
          if (maxLabel !== undefined) {
            maxLabel.destroy();
            maxLabel = undefined;
          }

          if (avgLabel !== undefined) {
            avgLabel.destroy();
            avgLabel = undefined;
          }

          if (dayMax !== undefined) {
            maxLabel = this.renderer.label(dayMax.toString(), -100).add();
            maxLabel.attr({
              style: 'font-weight: bold',
              x: this.plotWidth + this.plotLeft,
              y:
                this.yAxis[0].toPixels(dayMax, false) -
                maxLabel.getBBox().height / 2,
            });
          }

          if (dayAvg !== undefined) {
            avgLabel = this.renderer.label(dayAvg.toString(), -100).add();
            avgLabel.attr({
              x: this.plotWidth + this.plotLeft,
              y:
                this.yAxis[0].toPixels(dayAvg, false) -
                avgLabel.getBBox().height / 2,
            });
          }
        },
      },
      height: 200,
      margin: [10, 50, 50, 50],
      style: {
        fontFamily: 'Poppins',
      },
      type: 'spline',
    },
    colors: ['rgba(255, 102, 102, 1)'],
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        gapSize: 30 * 60 * 1000,
        gapUnit: 'value',
        marker: {
          enabled: true,
          radius: 2,
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
      plotLines: _.compact([
        dayMax !== undefined
          ? {
              color: '#aaa',
              dashStyle: 'Dot',
              value: dayMax,
              width: 2,
              zIndex: 2,
            }
          : undefined,
        dayAvg !== undefined
          ? {
              color: '#aaa',
              dashStyle: 'Dash',
              value: dayAvg,
              width: 4,
              zIndex: 2,
            }
          : undefined,
        dayMin !== undefined
          ? {
              color: '#aaa',
              dashStyle: 'Dot',
              value: dayMin,
              width: 2,
              zIndex: 2,
            }
          : undefined,
      ]),
      tickInterval: 0.5,
      title: {
        text: '',
      },
    },
  };
}
