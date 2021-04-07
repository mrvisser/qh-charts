import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as HighchartsStock from 'highcharts/highstock';
import _ from 'lodash';
import moment from 'moment-timezone';
import React from 'react';
import { DateRangePicker, Range } from 'react-date-range';
import { map } from 'rxjs/operators';
import styled from 'styled-components';

import { useObservable } from '../hooks/useObservable';
import { MetricsStore, MetricsStoreContext } from '../services/MetricsStore';

const nChartsPerPage = 3;

const ExcludePrint = styled.div`
  @media print {
    display: none;
  }
`;

const ChartsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const ChartsHeading = styled.h1`
  font-size: 2em;
  padding: 25px;
  @media print {
    display: none;
  }
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
  data: [number, number][];
};

export type ChartsProps = React.HTMLAttributes<HTMLDivElement> & {
  timezone: string;
};

export const Charts: React.FC<ChartsProps> = ({ timezone, ...divProps }) => {
  const metricsStore = React.useContext(MetricsStoreContext);
  const [dayFilter, setDayFilter] = React.useState<Range>();

  const [overallBloodGlucose] = useObservable(
    () =>
      metricsStore.bloodGlucose$.pipe(
        map(MetricsStore.metricValuesToHighchartsPairs),
      ),
    [metricsStore],
  );
  const [overallMinMaxTime, setOverallMinMaxTime] = React.useState<
    [number, number]
  >();
  const overallHighchartsOptions = React.useMemo(() => {
    return overallBloodGlucose !== undefined
      ? createHighchartsOptionsOverall(
          timezone,
          overallBloodGlucose,
          overallMinMaxTime !== undefined
            ? { max: overallMinMaxTime[1], min: overallMinMaxTime[0] }
            : undefined,
        )
      : undefined;
  }, [overallBloodGlucose, overallMinMaxTime, timezone]);
  const overallHighchartsFilterOptions = React.useMemo(
    () =>
      overallBloodGlucose !== undefined
        ? createHighchartsOptionsOverall(
            timezone,
            overallBloodGlucose,
            undefined,
            (start, end) => setOverallMinMaxTime([start, end]),
          )
        : undefined,
    [overallBloodGlucose, timezone],
  );

  const dailyBloodGlucose = React.useMemo(() => {
    if (overallBloodGlucose !== undefined) {
      return _.chain(overallBloodGlucose)
        .groupBy(([time]) => moment(time).tz(timezone).format('YYYY-MM-DD'))
        .toPairs()
        .map(([day, data]) => ({ data, day }))
        .sortBy('day')
        .value();
    } else {
      return undefined;
    }
  }, [overallBloodGlucose, timezone]);
  const dailyMinMaxDay = React.useMemo(() => {
    if (dailyBloodGlucose !== undefined) {
      const nDays = dailyBloodGlucose.length;
      if (nDays > 0) {
        return [
          moment(dailyBloodGlucose[0].day, 'YYYY-MM-DD').tz(timezone),
          moment(dailyBloodGlucose[nDays - 1].day, 'YYYY-MM-DD').tz(timezone),
        ];
      } else {
        return undefined;
      }
    }
  }, [dailyBloodGlucose, timezone]);
  const dailyHighchartsOptions = React.useMemo(() => {
    if (dailyBloodGlucose !== undefined) {
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

      return _.chunk(
        dailyBloodGlucose.filter(filter).map(({ data, day }) => {
          const m = moment.tz(day, timezone);
          const xMinMax = {
            max: m.endOf('day').toDate().getTime(),
            min: m.startOf('day').toDate().getTime(),
          };
          const yMax = Math.min(Math.max(8, ...data.map((d) => d[1])), 12);
          const yMinMax = {
            max: Math.ceil(yMax * 2) / 2,
            min: 3,
          };
          return {
            hidden: false,
            options: createHighchartsOptionsForDay(
              timezone,
              data,
              xMinMax,
              yMinMax,
            ),
            title: m.format('dddd, MMMM Do YYYY'),
          };
        }),
        nChartsPerPage,
      );
    } else {
      return undefined;
    }
  }, [dailyBloodGlucose, dayFilter, timezone]);

  return (
    <ChartsContainer {...divProps}>
      <ChartsHeading>Overall</ChartsHeading>
      {overallHighchartsOptions !== undefined &&
      overallHighchartsFilterOptions !== undefined ? (
        <PageGroup key={`page-group-overall`}>
          <ExcludePrint>
            <HighchartsReact
              id="overall-range-filter"
              constructorType="stockChart"
              highcharts={HighchartsStock}
              options={overallHighchartsFilterOptions}
            />
          </ExcludePrint>
          <ChartContainer>
            <Chart>
              <HighchartsReact
                highcharts={Highcharts}
                options={{ ...overallHighchartsOptions }}
              />
            </Chart>
          </ChartContainer>
        </PageGroup>
      ) : undefined}
      <ChartsHeading>Daily</ChartsHeading>
      {dailyMinMaxDay !== undefined
        ? (() => {
            const [minDate, maxDate] = dailyMinMaxDay.map((m) => m.toDate());
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
      {dailyHighchartsOptions !== undefined
        ? dailyHighchartsOptions.map((pageGroup) => (
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

function createHighchartsOptionsOverall(
  timezone: string,
  data: [number, number][],
  xMinMax?: { min: number; max: number },
  onRangeChange?: (start: number, end: number) => void,
): Highcharts.Options {
  let rangeChangeTimeout: NodeJS.Timeout | undefined = undefined;
  return {
    chart: {
      animation: false,
      height: 225,
      margin: [15, 0, 60, 40],
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
          enabled: false,
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
        day: "%e. %b '%y",
        week: "%e. %b '%y",
      },
      events: {
        setExtremes: (ev) => {
          if (onRangeChange !== undefined) {
            if (rangeChangeTimeout !== undefined) {
              clearTimeout(rangeChangeTimeout);
            }
            rangeChangeTimeout = setTimeout(
              () => onRangeChange(ev.min, ev.max),
              500,
            );
          }
        },
      },
      labels: {
        rotation: -45,
      },
      ordinal: false,
      type: 'datetime',
    },
    yAxis: {
      tickInterval: 0.5,
      title: {
        text: '',
      },
    },
  };
}

function createHighchartsOptionsForDay(
  timezone: string,
  data: [number, number][],
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
  const labels: Highcharts.SVGElement[] = [];

  return {
    chart: {
      events: {
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
