import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import moment, { Moment } from 'moment-timezone';
import React from 'react';
import { DateRangePicker, Range } from 'react-date-range';
import { map } from 'rxjs/operators';
import styled from 'styled-components';

import { useObservable } from '../hooks/useObservable';
import { MetricsStoreContext } from '../services/MetricsStore';

const nChartsPerPage = 3;

const ChartsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const DateRangePickerContainer = styled.div`
  padding: 25px;
  @media print {
    display: none;
  }
`;

const PageGroup = styled.div`
  break-after: always;
  break-inside: avoid;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 11in;

  @media print {
    height: 8.3in;
    margin-bottom: 0.2in;
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

type DayData = {
  day: string;
  data: (readonly [number, number])[];
};

export type ChartsProps = React.HTMLAttributes<HTMLDivElement> & {
  timezone: string;
  onAllChartsRendered?: () => void;
};

export const Charts: React.FC<ChartsProps> = ({
  timezone,
  onAllChartsRendered,
  ...divProps
}) => {
  const metricsStore = React.useContext(MetricsStoreContext);
  const [bloodGlucoseData] = useObservable(
    () =>
      metricsStore.bloodGlucose$
        .pipe(
          map((ms) =>
            ms !== undefined
              ? ms.map(({ time, value }) => [time, value] as const)
              : undefined,
          ),
        )
        .pipe(
          map((ms) => {
            if (ms !== undefined) {
              const dayData = _.chain(ms)
                .groupBy(([time]) =>
                  moment(time).tz(timezone).format('YYYY-MM-DD'),
                )
                .toPairs()
                .map(([day, data]) => ({ data, day }))
                .sortBy('day')
                .value();
              return dayData.reduce<{
                acc: DayData[];
                prevDay: Moment | undefined;
              }>(
                ({ acc, prevDay }, curr) => {
                  const currDay = moment(curr.day, 'YYYY-MM-DD');
                  if (prevDay !== undefined) {
                    // If there is 1 or more days in between this day and the next day, then fill
                    // in the empty days with no data. This ensures that we just render empty
                    // graphs in between
                    const nDaysMissing = currDay.diff(prevDay, 'days') - 1;
                    const filler = Array.from(Array(nDaysMissing).keys()).map(
                      (i): DayData => ({
                        data: [],
                        day: prevDay
                          .clone()
                          .add(i + 1, 'days')
                          .format('YYYY-MM-DD'),
                      }),
                    );
                    return {
                      acc: acc.concat(filler, [curr]),
                      prevDay: currDay,
                    };
                  } else {
                    return { acc: [curr], prevDay: currDay };
                  }
                },
                { acc: [], prevDay: undefined },
              ).acc;
            } else {
              return undefined;
            }
          }),
        ),
    [metricsStore, timezone],
  );
  const [minMaxDay, setMinMaxDay] = React.useState<[Moment, Moment]>();
  const [dayFilter, setDayFilter] = React.useState<Range>();
  const [highchartsOptions, setHighchartsOptions] = React.useState<
    {
      hidden: boolean;
      options: Highcharts.Options;
      title: string;
    }[][]
  >();
  const chartsRef = React.useRef<{ [title: string]: Highcharts.Chart }>({});

  const [
    invokeOnAllChartsRendered,
    setInvokeOnAllChartsRendered,
  ] = React.useState(true);
  const [renderedChartIndexes, setRenderedChartIndexes] = React.useState<
    Record<number, true>
  >({});

  React.useEffect(() => {
    if (bloodGlucoseData !== undefined) {
      const nDays = bloodGlucoseData.length;
      if (nDays > 0) {
        setMinMaxDay([
          moment(bloodGlucoseData[0].day, 'YYYY-MM-DD').tz(timezone),
          moment(bloodGlucoseData[nDays - 1].day, 'YYYY-MM-DD').tz(timezone),
        ]);
      }

      const min = 3;
      const max = 8;
      const yMinMax = { max, min };
      setRenderedChartIndexes({});

      const filter = ({ day }: DayData) => {
        if (
          dayFilter !== undefined &&
          dayFilter.startDate !== undefined &&
          dayFilter.endDate !== undefined
        ) {
          const dayMoment = moment(day, 'YYYY-M-DD').tz(timezone);
          return (
            dayMoment.isSameOrAfter(dayFilter.startDate) &&
            dayMoment.isSameOrBefore(dayFilter.endDate)
          );
        } else {
          return true;
        }
      };

      setHighchartsOptions(
        _.chunk(
          bloodGlucoseData.filter(filter).map(({ data, day }, i) => {
            const m = moment.tz(day, timezone);
            const xMinMax = {
              max: m.endOf('day').toDate().getTime(),
              min: m.startOf('day').toDate().getTime(),
            };
            return {
              hidden: false,
              options: createHighchartsOptionsForDay(
                timezone,
                data,
                xMinMax,
                yMinMax,
                () => setRenderedChartIndexes((rci) => ({ ...rci, [i]: true })),
              ),
              title: m.format('dddd, MMMM Do'),
            };
          }),
          nChartsPerPage,
        ),
      );
    } else {
      setHighchartsOptions(undefined);
    }
  }, [bloodGlucoseData, dayFilter, timezone]);

  React.useEffect(() => {
    if (
      invokeOnAllChartsRendered &&
      onAllChartsRendered !== undefined &&
      bloodGlucoseData !== undefined
    ) {
      const areAllChartsRendered =
        Object.keys(renderedChartIndexes).length === bloodGlucoseData.length;
      if (areAllChartsRendered) {
        setInvokeOnAllChartsRendered(false);
        onAllChartsRendered();
      }
    }
  }, [
    bloodGlucoseData,
    invokeOnAllChartsRendered,
    onAllChartsRendered,
    renderedChartIndexes,
  ]);

  return (
    <ChartsContainer {...divProps}>
      {minMaxDay !== undefined
        ? (() => {
            const [minDate, maxDate] = minMaxDay.map((m) => m.toDate());
            return (
              <DateRangePickerContainer>
                <DateRangePicker
                  maxDate={maxDate}
                  minDate={minDate}
                  moveRangeOnFirstSelection={false}
                  onChange={(range) => {
                    if ('selection' in range) {
                      setDayFilter(range.selection);
                    }
                  }}
                  ranges={[
                    dayFilter === undefined
                      ? {
                          endDate: maxDate,
                          key: 'selection',
                          startDate: minDate,
                        }
                      : dayFilter,
                  ]}
                  showSelectionPreview={true}
                />
              </DateRangePickerContainer>
            );
          })()
        : undefined}
      {highchartsOptions !== undefined
        ? highchartsOptions.map((pageGroup) => (
            <PageGroup key={`page-group-${pageGroup[0].title}`}>
              {pageGroup
                .concat(
                  // Concatenate dummy charts to fill up each page of 3. This ensures that 1 or
                  // 2 charts on a page is always layed out the same way incrementally as a 3-chart
                  // page. This is for print consistency when have 1 day, then 2, then 3 on a page.
                  new Array(nChartsPerPage - pageGroup.length).fill({
                    ...pageGroup[0],
                    hidden: true,
                    options: {
                      ...pageGroup[0].options,
                      chart: {
                        ...pageGroup[0].options.chart,
                        // Don't invoke any load events for the page-filler items
                        events: {},
                      },
                    },
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
                          callback={(chart: Highcharts.Chart) => {
                            chartsRef.current[title] = chart;
                          }}
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
  timezone: string,
  data: (readonly [number, number])[],
  xMinMax: { min: number; max: number },
  yMinMax: {
    min: number;
    max: number;
  },
  onLoad: () => void,
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
  const labels: Highcharts.SVGElement[] = [];
  let calledOnLoad = false;

  return {
    chart: {
      events: {
        load() {
          if (!calledOnLoad) {
            calledOnLoad = true;
            onLoad();
          }
        },
        render() {
          labels.forEach((l) => l.destroy());
          labels.length = 0;

          const chartPaddingTop = 28.5;
          const lineHeight = 18.5;
          const labelX = 45;
          const valueX = labelX + 140;

          const attrs = {
            fill: '#999',
            'font-weight': '600',
            zIndex: 1,
          };

          if (dayAvg !== undefined && dayMax !== undefined) {
            const maxLabel = this.renderer.text('MAXIMUM GLUCOSE:', 0).add();
            maxLabel.attr({
              ...attrs,
              x: labelX,
              y: chartPaddingTop,
            });
            const maxValue = this.renderer.text(dayMax.toString(), 0).add();
            maxValue.attr({
              ...attrs,
              x: valueX,
              y: chartPaddingTop,
            });

            const avgLabel = this.renderer.text('AVERAGE GLUCOSE:', 0).add();
            avgLabel.attr({
              ...attrs,
              x: labelX,
              y: chartPaddingTop + lineHeight,
            });
            const avgValue = this.renderer.text(dayAvg.toString(), 0).add();

            avgValue.attr({
              ...attrs,
              x: valueX,
              y: chartPaddingTop + lineHeight,
            });

            labels.push(maxLabel, maxValue, avgLabel, avgValue);
          }
        },
      },
      height: 225,
      margin: [15, 0, 30, 40],
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
    time: {
      moment,
      timezone,
    },
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
        {
          color: '#aaa',
          dashStyle: 'Dash',
          value: 5,
          width: 4,
          zIndex: 2,
        },
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
