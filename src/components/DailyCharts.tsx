/* eslint-disable no-console */
import { mdiChevronLeft, mdiCog } from '@mdi/js';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import moment from 'moment-timezone';
import React from 'react';
import { DateRangePicker, Range } from 'react-date-range';
import { map } from 'rxjs/operators';
import styled from 'styled-components';

import { useObservable } from '../hooks/useObservable';
import { MetricsStoreContext, UnitConfig } from '../services/MetricsStore';
import { ChartZoomable } from './ChartZoomable';
import { Drawer } from './Drawer';
import { InputText } from './InputText';
import { StalkingButton, StalkingButtonGroup } from './StalkingButtonGroup';

const nChartsPerPage = 3;

const aboveThresholdTarget = 7.2;
const belowThresholdTarget = 5;

const SettingsPanel = styled(Drawer)`
  min-width: 50vw;
`;

const SettingsSection = styled.div`
  padding: 25px;
`;

const SettingsSectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 25px;
`;

const SettingsSectionSubTitle = styled.h3`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 15px;
`;

const SettingsNumberInput = styled(InputText)`
  width: 50px;
`;

const DailyChartsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const DailyChartsHeading = styled.h1`
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

const DailyChartsPageGroup = styled.div`
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

const DailyChartContainer = styled.div`
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

const DailyChartHeading = styled.h2`
  font-weight: 600;
  margin: 5px 0 0 0;
  text-align: center;
  text-transform: uppercase;
`;

const DailyChart = styled.div`
  flex: 1;
`;

type DayData<D = [number, number][]> = {
  day: string;
  data: D;
};

export type DailyChartsProps = React.HTMLAttributes<HTMLDivElement> & {
  onBack: () => void;
  timezone: string;
};

export const DailyCharts: React.FC<DailyChartsProps> = ({
  onBack,
  timezone,
  ...divProps
}) => {
  const metricsStore = React.useContext(MetricsStoreContext);
  const [dayFilter, setDayFilter] = React.useState<Range>();
  const [showSettings, setShowSettings] = React.useState(false);

  const [overrideYMax, setOverrideYMax] = React.useState<number>();
  const [overrideYMin, setOverrideYMin] = React.useState<number>();

  const [locale] = useObservable(() => metricsStore.locale$, [metricsStore]);
  const unitConfig = React.useMemo<UnitConfig>(() => {
    switch (locale) {
      case undefined:
      case 'ca':
        return { fromMmolL: (n) => n, label: 'mmol/L' };
      case 'us':
        return {
          fromMmolL: (n) => Math.round(n * 18.018018018),
          label: 'mg/dL',
        };
    }
  }, [locale]);

  const [bloodGlucose] = useObservable(
    () =>
      metricsStore.bloodGlucose$.pipe(
        map((ms) => ms?.map<[number, number]>((m) => [m.time, m.value])),
      ),
    [metricsStore],
  );
  const dailyBloodGlucose = React.useMemo<DayData[] | undefined>(() => {
    if (bloodGlucose !== undefined) {
      return _.chain(bloodGlucose)
        .groupBy(([time]) => moment(time).tz(timezone).format('YYYY-MM-DD'))
        .toPairs()
        .map(([day, data]) => ({ data, day }))
        .sortBy('day')
        .value();
    } else {
      return undefined;
    }
  }, [bloodGlucose, timezone]);

  const [trendMinMaxTime, setTrendMinMaxTime] =
    React.useState<[number, number]>();
  const [trendFastingMinutesOfDay, setTrendFastingMinutesOfDay] =
    React.useState<number | undefined>(240);
  const trendFastingMinutesOfDayLabel = React.useMemo(
    () =>
      trendFastingMinutesOfDay !== undefined
        ? moment()
            .startOf('day')
            .add(trendFastingMinutesOfDay, 'minutes')
            .format('LT')
        : '',
    [trendFastingMinutesOfDay],
  );
  const trendFastingGlucose = React.useMemo<
    DayData<number | null>[] | undefined
  >(() => {
    if (
      dailyBloodGlucose !== undefined &&
      trendFastingMinutesOfDay !== undefined
    ) {
      const [min, max] = trendMinMaxTime ?? [0, Date.now()];
      const mMin = moment(min).tz(timezone);
      const mMax = moment(max).tz(timezone);

      return dailyBloodGlucose
        .filter(({ day }) => {
          const m = moment(day).tz(timezone);
          const start = m.clone().startOf('day');
          const end = m.clone().endOf('day');
          return end.isSameOrAfter(mMin) && start.isSameOrBefore(mMax);
        })
        .map(({ data, day }) => {
          // Get the data within the fasting range
          const fastingTime = moment(day)
            .tz(timezone)
            .startOf('day')
            .add(trendFastingMinutesOfDay, 'minutes');
          const fastingTimeMillis = fastingTime.toDate().getTime();
          const low = fastingTime.clone().subtract(15, 'minutes');
          const high = fastingTime.clone().add(15, 'minutes');
          const dataInRange = data.filter(([time]) => {
            const m = moment(time).tz(timezone);
            return m.isSameOrAfter(low) && m.isSameOrBefore(high);
          });
          const fastingGlucose = dataInRange.sort(
            ([a], [b]) =>
              Math.abs(a - fastingTimeMillis) - Math.abs(b - fastingTimeMillis),
          )[0];
          return {
            data: fastingGlucose?.[1] ?? null,
            day,
          };
        });
    } else {
      return undefined;
    }
  }, [dailyBloodGlucose, trendFastingMinutesOfDay, trendMinMaxTime, timezone]);
  const trendHighchartsOptions = React.useMemo(() => {
    return trendFastingGlucose !== undefined && trendFastingGlucose.length > 1
      ? createHighchartsOptionsTrend(
          timezone,
          trendFastingGlucose.map(({ day, data }) => [
            moment(day).tz(timezone).startOf('day').toDate().getTime(),
            data,
          ]),
          unitConfig,
          {
            fasting: {
              timeLabel: trendFastingMinutesOfDayLabel,
            },
            xMinMax: {
              max: moment(
                trendFastingGlucose[trendFastingGlucose.length - 1].day,
              )
                .tz(timezone)
                .startOf('day')
                .toDate()
                .getTime(),
              min: moment(trendFastingGlucose[0].day)
                .tz(timezone)
                .startOf('day')
                .toDate()
                .getTime(),
            },
          },
        )
      : undefined;
  }, [
    trendFastingGlucose,
    trendFastingMinutesOfDayLabel,
    timezone,
    unitConfig,
  ]);

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
          const yMax =
            overrideYMax === undefined
              ? Math.ceil(
                  Math.min(
                    Math.max(unitConfig.fromMmolL(8), ...data.map((d) => d[1])),
                    unitConfig.fromMmolL(12),
                  ) * 2,
                ) / 2
              : unitConfig.fromMmolL(overrideYMax);
          const yMinMax = {
            max: Math.ceil(yMax * 2) / 2,
            min: unitConfig.fromMmolL(
              overrideYMin === undefined ? 3 : overrideYMin,
            ),
          };
          return {
            hidden: false,
            options: createHighchartsOptionsForDay(
              timezone,
              data,
              unitConfig,
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
  }, [
    dailyBloodGlucose,
    dayFilter,
    overrideYMax,
    overrideYMin,
    timezone,
    unitConfig,
  ]);

  return (
    <>
      <StalkingButtonGroup>
        <StalkingButton path={mdiChevronLeft} onClick={onBack} />
        <StalkingButton path={mdiCog} onClick={() => setShowSettings(true)} />
      </StalkingButtonGroup>
      <DailyChartsContainer {...divProps}>
        <DailyChartsHeading>Trends</DailyChartsHeading>
        {trendHighchartsOptions !== undefined ? (
          <DailyChartsPageGroup key={`page-group-overall`}>
            <DailyChartContainer>
              <DailyChart>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{ ...trendHighchartsOptions }}
                />
              </DailyChart>
            </DailyChartContainer>
          </DailyChartsPageGroup>
        ) : undefined}
        <DailyChartsHeading>Daily</DailyChartsHeading>
        {dailyHighchartsOptions !== undefined
          ? dailyHighchartsOptions.map((pageGroup) => (
              <DailyChartsPageGroup key={`page-group-${pageGroup[0].title}`}>
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
                      <DailyChartContainer
                        className={hidden ? 'hidden' : 'visible'}
                        key={i}
                      >
                        <DailyChartHeading>{title}</DailyChartHeading>
                        <DailyChart>
                          <HighchartsReact
                            highcharts={Highcharts}
                            key={`chart-${title}`}
                            options={options}
                          />
                        </DailyChart>
                      </DailyChartContainer>
                    );
                  })}
              </DailyChartsPageGroup>
            ))
          : undefined}
      </DailyChartsContainer>
      <SettingsPanel
        active={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
        <SettingsSection>
          <SettingsSectionTitle>Trend Chart Settings</SettingsSectionTitle>
          <ChartZoomable
            id="overall-range-filter"
            onChangeRange={(start, end) => setTrendMinMaxTime([start, end])}
            timezone={timezone}
          />
          <label>
            Fasting time (minutes from 12AM):{' '}
            <SettingsNumberInput
              defaultValue="240"
              onBlur={(ev) => {
                const value = parseFloat(ev.target.value.trim());
                setTrendFastingMinutesOfDay(isNaN(value) ? undefined : value);
              }}
              placeholder={trendFastingMinutesOfDay?.toString() ?? ''}
            />
          </label>
        </SettingsSection>
        <SettingsSection>
          <SettingsSectionTitle>Daily Charts Settings</SettingsSectionTitle>
          {dailyMinMaxDay !== undefined
            ? (() => {
                const [minDate, maxDate] = dailyMinMaxDay.map((m) =>
                  m.toDate(),
                );
                return (
                  <>
                    <SettingsSectionSubTitle>
                      Selected Date Range:
                    </SettingsSectionSubTitle>
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
                        showPreview
                      />
                    </DateRangePickerContainer>
                  </>
                );
              })()
            : undefined}
          <SettingsSectionSubTitle>
            Selected Glucose Range:
          </SettingsSectionSubTitle>
          <label>
            Min:{' '}
            <SettingsNumberInput
              onBlur={(ev) => {
                const value = parseFloat(ev.target.value.trim());
                setOverrideYMin(isNaN(value) ? undefined : value);
              }}
              placeholder={
                overrideYMin !== undefined ? overrideYMin.toString() : ''
              }
            />
          </label>
          <label style={{ marginLeft: '15px' }}>
            Max:{' '}
            <SettingsNumberInput
              onBlur={(ev) => {
                const value = parseFloat(ev.target.value.trim());
                setOverrideYMax(isNaN(value) ? undefined : value);
              }}
              placeholder={
                overrideYMax !== undefined ? overrideYMax.toString() : ''
              }
            />
          </label>
        </SettingsSection>
      </SettingsPanel>
    </>
  );
};

function createHighchartsOptionsTrend(
  timezone: string,
  data: [number, number | null][],
  unitConfig: UnitConfig,
  {
    fasting,
    onRangeChange,
    xMinMax,
  }: {
    fasting: {
      timeLabel: string;
    };
    onRangeChange?: (start: number, end: number) => void;
    xMinMax: { min: number; max: number };
  },
): Highcharts.Options {
  let rangeChangeTimeout: NodeJS.Timeout | undefined = undefined;
  return {
    chart: {
      animation: false,
      height: 225,
      margin: [15, 0, 100, 40],
      style: {
        fontFamily: 'Poppins',
      },
      type: 'spline',
    },
    colors: ['rgba(65, 165, 105, 1)'],
    credits: {
      enabled: false,
    },
    exporting: {
      buttons: {
        contextButton: {
          className: 'no-print',
          enabled: true,
        },
      },
      csv: {
        dateFormat: '%Y-%m-%d',
      },
    },
    legend: {
      enabled: true,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
        },
        zones: [
          {
            color: 'rgba(65, 165, 105, 1)',
            value: unitConfig.fromMmolL(4.8),
          },
          {
            color: 'orange',
          },
        ],
      },
    },
    series: [
      {
        data,
        name: `Fasting (${fasting.timeLabel}) (${unitConfig.label})`,
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
      tickInterval: unitConfig.fromMmolL(0.5),
      title: {
        text: '',
      },
    },
  };
}

function createHighchartsOptionsForDay(
  timezone: string,
  data: [number, number][],
  unitConfig: UnitConfig,
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
      ? values.reduce((acc, v) => acc + v, 0) / values.length
      : undefined;
  const dayMin = Math.min(...values);

  const lower = unitConfig.fromMmolL(aboveThresholdTarget);
  const upper = unitConfig.fromMmolL(belowThresholdTarget);

  const { timeInRange: timeExposed } = calculateTimeInRange(data, {
    lower: unitConfig.fromMmolL(aboveThresholdTarget),
  });
  const { effectiveDuration, timeInRange } = calculateTimeInRange(data, {
    upper: unitConfig.fromMmolL(belowThresholdTarget),
  });
  const timeInRangePct =
    effectiveDuration > 0 ? timeInRange / effectiveDuration : 1;

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
          const valueX = labelX + 132;

          const attrs = {
            fill: '#999',
            zIndex: 1,
          };

          if (dayAvg !== undefined && dayMax !== undefined) {
            const tirLabel = this.renderer
              .text(`TIME IN RANGE (< ${upper.toFixed(1)}):`, 0)
              .add();
            tirLabel.attr({
              ...attrs,
              x: labelX,
              y: chartPaddingTop,
            });
            const tirValue = this.renderer
              .text(
                `<b>${Math.floor(timeInRangePct * 100)}%</b> (${moment
                  .duration(timeInRange, 'milliseconds')
                  .format(() =>
                    timeInRange > 60 * 60 * 1000 ? 'h[h] m[m]' : 'm[m]',
                  )})`,
                0,
              )
              .add();
            tirValue.attr({
              ...attrs,
              x: valueX,
              y: chartPaddingTop,
            });

            const maxLabel = this.renderer.text('GLUCOSE PEAK:', 0).add();
            maxLabel.attr({
              ...attrs,
              x: labelX,
              y: chartPaddingTop + lineHeight,
            });
            const maxValue = this.renderer
              .text(`<b>${dayMax.toFixed(1)}</b>`, 0)
              .add();
            maxValue.attr({
              ...attrs,
              x: valueX,
              y: chartPaddingTop + lineHeight,
            });

            const avgLabel = this.renderer.text('AVERAGE GLUCOSE:', 0).add();
            avgLabel.attr({
              ...attrs,
              x: labelX,
              y: chartPaddingTop + lineHeight * 2,
            });
            const avgValue = this.renderer
              .text(`<b>${dayAvg.toFixed(1)}</b>`, 0)
              .add();
            avgValue.attr({
              ...attrs,
              x: valueX,
              y: chartPaddingTop + lineHeight * 2,
            });

            const teLabel = this.renderer
              .text(`TIME EXPOSED (> ${lower.toFixed(1)}):`, 0)
              .add();
            teLabel.attr({
              ...attrs,
              x: labelX,
              y: chartPaddingTop + lineHeight * 3,
            });

            const teValue = this.renderer
              .text(
                `<b>${moment
                  .duration(timeExposed, 'milliseconds')
                  .format(() =>
                    timeExposed > 60 * 60 * 1000 ? 'h[h] m[m]' : 'm[m]',
                  )}</b>`,
                0,
              )
              .add();
            teValue.attr({
              ...attrs,
              x: valueX,
              y: chartPaddingTop + lineHeight * 3,
            });

            labels.push(
              maxLabel,
              maxValue,
              avgLabel,
              avgValue,
              teLabel,
              teValue,
            );
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
    credits: {
      enabled: false,
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: false,
        },
      },
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
        zones: [
          {
            color: '#CCC',
            value: unitConfig.fromMmolL(4.1),
          },
          {
            color: 'rgba(65, 165, 105, 1)',
            value: unitConfig.fromMmolL(6.1),
          },
          {
            color: 'orange',
            value: unitConfig.fromMmolL(7.8),
          },
          {
            color: 'rgba(255, 102, 102, 1)',
          },
        ],
      },
    },
    series: [
      {
        data,
        name: unitConfig.label,
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
          from: unitConfig.fromMmolL(4.1),
          to: unitConfig.fromMmolL(6),
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
          color: 'rgba(65, 165, 105, 1)',
          dashStyle: 'Dash',
          value: unitConfig.fromMmolL(5),
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
      tickInterval: unitConfig.fromMmolL(0.5),
      title: {
        text: '',
      },
    },
  };
}

function calculateTimeInRange(
  data: [number, number][],
  { lower = Number.MIN_VALUE, upper = Number.MAX_VALUE } = {},
): { effectiveDuration: number; timeInRange: number } {
  return data.reduce(
    ({ effectiveDuration, timeInRange }, [currTime, currValue], i) => {
      if (i > 0) {
        const [prevTime, prevValue] = data[i - 1];
        const duration = currTime - prevTime;
        if (duration < 30 * 60 * 1000) {
          const currValueLimited = Math.min(Math.max(currValue, lower), upper);
          const prevValueLimited = Math.min(Math.max(prevValue, lower), upper);
          const areaOfData =
            (currTime - prevTime) * Math.abs(currValue - prevValue);
          const areaInRange =
            (currTime - prevTime) *
            Math.abs(currValueLimited - prevValueLimited);

          if (areaOfData === 0 && currValueLimited !== currValue) {
            // prevValue and currValue are the same, and they are not within range. 0 duration
            return {
              effectiveDuration: effectiveDuration + duration,
              timeInRange,
            };
          } else if (areaOfData === 0) {
            // prevValue and currValue are the same, and they are within range. Full duration
            return {
              effectiveDuration: effectiveDuration + duration,
              timeInRange: timeInRange + duration,
            };
          } else {
            // The value is different. The percentage of duration is the percentage of overlap
            return {
              effectiveDuration: effectiveDuration + duration,
              timeInRange: timeInRange + (areaInRange / areaOfData) * duration,
            };
          }
        } else {
          return { effectiveDuration, timeInRange };
        }
      } else {
        return { effectiveDuration, timeInRange };
      }
    },
    { effectiveDuration: 0, timeInRange: 0 },
  );
}
