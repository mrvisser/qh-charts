import { mdiChevronLeft, mdiCog, mdiTrashCanOutline } from '@mdi/js';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import moment from 'moment-timezone';
import React from 'react';
import { SketchPicker } from 'react-color';
import { map } from 'rxjs/operators';
import styled from 'styled-components';

import { ChartZoomable, ChartZoomablePropsMarker } from './ChartZoomable';
import { Drawer } from './Drawer';
import { IconButton } from './IconButton';
import { InputText } from './InputText';
import { StalkingButton, StalkingButtonGroup } from './StalkingButtonGroup';

import { useObservable } from 'src/hooks/useObservable';
import {
  MetricsStore,
  MetricsStoreContext,
  UnitConfig,
} from 'src/services/MetricsStore';

export type CaseStudiesProps = {
  onBack: () => void;
  timezone: string;
};

const SettingsPanel = styled(Drawer)`
  min-width: 50vw;
`;

const SettingsSection = styled.div`
  padding: 25px;

  & label {
    display: block;
    margin-bottom: 15px;
  }
`;

const SettingsSectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 25px;
`;

const SettingsCaseStudyList = styled.ul`
  margin-top: 25px;
`;
const SettingsCaseStudyListItem = styled.li`
  align-items: center;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  font-size: 16px;
  margin-bottom: 15px;
  padding: 5px;

  :hover {
    background-color: #eee;
  }

  & > div {
    align-items: center;
    display: flex;
    margin-right: 15px;
  }

  & > div:nth-child(1) {
    width: 200px;
  }

  & > div:nth-child(2) {
    width: 40px;
  }

  & > div:nth-child(3) {
    flex: 1;
  }

  & > div:nth-child(3) > input {
    width: 100%;
  }
`;
const SettingsCaseStudyListHeader = styled(SettingsCaseStudyListItem)`
  font-size: 18px;
  font-weight: 500;

  :hover {
    background: none;
  }
`;

const SettingsCaseStudyColorPreview = styled.button`
  border: solid 1px #eee;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  height: 3em;
  overflow: visible;
  position: relative;
  width: 3em;
`;

const SettingsCaseStudyColorEdit = styled.div`
  background: none;
  bottom: 0;
  left: 4em;
  position: absolute;
`;

const SettingsGlucoseInput = styled(InputText)`
  width: 50px;
`;

const CaseStudyChartsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const CaseStudyChartsHeading = styled.h1`
  font-size: 2em;
  padding: 25px;
  @media print {
    display: none;
  }
`;

const CaseStudyChartsPageGroup = styled.div`
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

const CaseStudyChartContainer = styled.div`
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

const CaseStudyChartHeading = styled.h2`
  font-weight: 600;
  margin: 5px 0 0 0;
  text-align: center;
  text-transform: uppercase;
`;

const CaseStudyChartSubHeading = styled.h3`
  font-weight: 400;
  margin: 5px 0 0 0;
  text-align: center;
  text-transform: uppercase;
`;

const CaseStudyChart = styled.div`
  flex: 1;
`;

type CaseStudyEntry = {
  marker: ChartZoomablePropsMarker;
  title?: string;
};

export const CaseStudies: React.FC<CaseStudiesProps> = ({
  onBack,
  timezone,
}) => {
  const metricsStore = React.useContext(MetricsStoreContext);
  const [overallBloodGlucose] = useObservable(
    () =>
      metricsStore.bloodGlucose$.pipe(
        map(MetricsStore.metricValuesToHighchartsPairs),
      ),
    [metricsStore],
  );
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

  const [showSettings, setShowSettings] = React.useState(false);
  const [hours, setHours] = React.useState(4);
  const [entries, setEntries] = React.useState<CaseStudyEntry[]>([]);
  const [overrideYMin, setOverrideYMin] = React.useState<number>();
  const [overrideYMax, setOverrideYMax] = React.useState<number>();

  const [charts, setCharts] = React.useState<
    {
      id: number;
      subTitle?: string;
      title: string;
      options: Highcharts.Options;
    }[]
  >([]);

  const [colorEditIndex, setColorEditIndex] = React.useState<number>();
  const colorEditRef = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    const ref = colorEditRef.current;
    if (ref !== null) {
      const handle = (ev: MouseEvent) => {
        if (ev.target === null || !ref.contains(ev.target as Node)) {
          setColorEditIndex(undefined);
        }
      };
      document.addEventListener('click', handle);
      return () => document.removeEventListener('click', handle);
    }
  }, [colorEditRef]);

  React.useEffect(() => {
    if (entries.length === 0) {
      setShowSettings(true);
    }

    if (overallBloodGlucose !== undefined) {
      const durationMillis = hours * 60 * 60 * 1000;
      let yMinValue = unitConfig.fromMmolL(3);
      let yMaxValue = unitConfig.fromMmolL(8);

      // Build the data
      const dataByChartId: Record<number, [number, number][]> = {};
      const ids = entries.map((e) => e.marker.value).sort();
      for (const i of ids) {
        dataByChartId[i] = [];
      }

      for (const [t, v] of overallBloodGlucose) {
        for (let i = 0; i < ids.length && ids[i] <= t; i++) {
          if (t < ids[i] + durationMillis) {
            yMinValue = Math.min(yMinValue, v);
            yMaxValue = Math.max(yMaxValue, v);
            dataByChartId[ids[i]].push([t - ids[i], v]);
          }
        }
      }

      const comparisonChart = {
        id: 0,
        options: createHighchartsOptionsForCaseStudy(
          entries.map((entry) => ({
            color: entry.marker.color,
            data: dataByChartId[entry.marker.value],
            title:
              entry.title !== undefined
                ? entry.title
                : formatDateTimeShort(entry.marker.value, timezone),
          })),
          unitConfig,
          {
            max: durationMillis,
            min: 0,
          },
          {
            max:
              overrideYMax === undefined
                ? Math.ceil(yMaxValue * 2) / 2
                : overrideYMax,
            min:
              overrideYMin === undefined
                ? Math.floor(yMinValue * 2) / 2
                : overrideYMin,
          },
          false,
        ),
        title: 'Overall',
      };

      const studyCharts = entries.map((entry) => ({
        id: entry.marker.value,
        options: createHighchartsOptionsForCaseStudy(
          [
            {
              color: entry.marker.color,
              data: dataByChartId[entry.marker.value],
              title: '',
            },
          ],
          unitConfig,
          {
            max: durationMillis,
            min: 0,
          },
          {
            max:
              overrideYMax === undefined
                ? Math.ceil(yMaxValue * 2) / 2
                : overrideYMax,
            min:
              overrideYMin === undefined
                ? Math.floor(yMinValue * 2) / 2
                : overrideYMin,
          },
          true,
        ),
        subTitle: entry.title,
        title: formatDateTimeLong(entry.marker.value, timezone),
      }));

      setCharts([comparisonChart, ...studyCharts]);
    }
  }, [
    hours,
    entries,
    overallBloodGlucose,
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
      {charts.length > 0 ? (
        <CaseStudyChartsContainer>
          <CaseStudyChartsHeading>Case Studies</CaseStudyChartsHeading>
          {charts.map(({ id, options, subTitle, title }) => {
            return (
              <CaseStudyChartsPageGroup key={id}>
                <CaseStudyChartContainer>
                  <CaseStudyChartHeading>{title}</CaseStudyChartHeading>
                  {subTitle !== undefined ? (
                    <CaseStudyChartSubHeading>
                      {subTitle}
                    </CaseStudyChartSubHeading>
                  ) : undefined}
                  <CaseStudyChart>
                    <HighchartsReact
                      highcharts={Highcharts}
                      id={`chart-${id}`}
                      options={options}
                    />
                  </CaseStudyChart>
                </CaseStudyChartContainer>
              </CaseStudyChartsPageGroup>
            );
          })}
        </CaseStudyChartsContainer>
      ) : undefined}

      <SettingsPanel
        active={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
        <SettingsSection>
          <SettingsSectionTitle>Case Studies</SettingsSectionTitle>
          <ChartZoomable
            markers={entries.map((e) => e.marker)}
            onSelectTime={(value) =>
              setEntries((es) =>
                _.chain(es)
                  .concat({
                    marker: { color: 'red', value },
                  })
                  .uniqBy((e) => e.marker.value)
                  .sortBy((e) => e.marker.value)
                  .value(),
              )
            }
            timezone={timezone}
          />
          <SettingsCaseStudyList>
            <SettingsCaseStudyListHeader>
              <div>Date &amp; Time</div>
              <div> </div>
              <div>Name</div>
            </SettingsCaseStudyListHeader>
            {entries.map((entry, i0) => (
              <SettingsCaseStudyListItem key={entry.marker.value}>
                <div>{formatDateTimeShort(entry.marker.value, timezone)}</div>
                <div>
                  <SettingsCaseStudyColorPreview
                    onClick={() => setColorEditIndex(i0)}
                    style={{ backgroundColor: entry.marker.color }}
                  >
                    {colorEditIndex === i0 ? (
                      <SettingsCaseStudyColorEdit ref={colorEditRef}>
                        <SketchPicker
                          color={entry.marker.color}
                          disableAlpha={true}
                          onChangeComplete={(color) =>
                            setEntries((es) =>
                              es.map((e, i1) =>
                                i0 === i1
                                  ? {
                                      ...e,
                                      marker: { ...e.marker, color: color.hex },
                                    }
                                  : e,
                              ),
                            )
                          }
                        />
                      </SettingsCaseStudyColorEdit>
                    ) : (
                      ' '
                    )}
                  </SettingsCaseStudyColorPreview>
                </div>
                <div>
                  <InputText
                    onFocus={(ev) => {
                      if (
                        ev.target.value.trim() === '' &&
                        entry.title !== undefined
                      ) {
                        ev.target.value = entry.title;
                      }
                    }}
                    onBlur={(ev) => {
                      const value = ev.target.value.trim();
                      const title = value === '' ? undefined : value;
                      setEntries((es) =>
                        es.map((e, i1) => (i0 === i1 ? { ...e, title } : e)),
                      );
                    }}
                    placeholder={entry.title}
                  />
                </div>
                <div>
                  <IconButton
                    onClick={() =>
                      setEntries((ms) => ms.filter((_, i1) => i1 !== i0))
                    }
                    path={mdiTrashCanOutline}
                  />
                </div>
              </SettingsCaseStudyListItem>
            ))}
          </SettingsCaseStudyList>
        </SettingsSection>
        <SettingsSection>
          <SettingsSectionTitle>Parameters</SettingsSectionTitle>
          <label>
            Duration:{' '}
            <InputText
              max="23"
              min="1"
              placeholder={hours.toString()}
              type="number"
              onBlur={(ev) => {
                const nextHours = parseFloat(ev.target.value.trim());
                if (!isNaN(nextHours)) {
                  setHours(nextHours);
                }
              }}
            />{' '}
            (hours)
          </label>
          <label>
            Min Glucose:{' '}
            <SettingsGlucoseInput
              placeholder={
                overrideYMin === undefined ? undefined : overrideYMin.toString()
              }
              onBlur={(ev) => {
                const value = parseFloat(ev.target.value.trim());
                setOverrideYMin(isNaN(value) ? undefined : value);
              }}
            />
          </label>
          <label>
            Max Glucose:{' '}
            <SettingsGlucoseInput
              placeholder={
                overrideYMax === undefined ? undefined : overrideYMax.toString()
              }
              onBlur={(ev) => {
                const value = parseFloat(ev.target.value.trim());
                setOverrideYMax(isNaN(value) ? undefined : value);
              }}
            />
          </label>
        </SettingsSection>
      </SettingsPanel>
    </>
  );
};

function createHighchartsOptionsForCaseStudy(
  data: {
    color: string;
    data: [number, number][];
    title: string;
  }[],
  unitConfig: UnitConfig,
  xMinMax: { min: number; max: number },
  yMinMax: {
    min: number;
    max: number;
  },
  includeLabels: boolean,
): Highcharts.Options {
  const values = data.flatMap((p) => p.data).map((p) => p[1]);

  const chartAvg =
    values.length > 0
      ? Math.round(
          (values.reduce((sum, v) => sum + v, 0) * 10) / values.length,
        ) / 10
      : 'N/A';
  const chartMax = Math.max(...values);
  const timeToPeak =
    includeLabels && data.length === 1
      ? calculateTimeToMax(data[0].data)
      : undefined;
  const timeToBaseline =
    timeToPeak !== undefined
      ? calculateTimeToBaseline(
          data[0].data[0][1] * 1.2,
          data[0].data.filter(([t]) => t > timeToPeak),
        )
      : undefined;

  const hasLegend = data.length > 1;

  return {
    chart: {
      events: {
        render() {
          const ctx = this as unknown as {
            _qhLabels?: Highcharts.SVGElement[];
          };
          const labels = ctx._qhLabels;
          if (labels !== undefined) {
            labels.forEach((l) => l.destroy());
            delete ctx._qhLabels;
          }

          if (timeToPeak !== undefined && timeToBaseline !== undefined) {
            const chartPaddingTop = 28.5;
            const lineHeight = 18.5;
            const labelX = 45;
            const valueX = labelX + 132;

            const attrs = {
              fill: '#999',
              zIndex: 1,
            };

            const ttpLabel = this.renderer.text(`TIME TO PEAK:`, 0).add();
            ttpLabel.attr({
              ...attrs,
              x: labelX,
              y: chartPaddingTop,
            });
            const ttpValue = this.renderer
              .text(
                `<b>${moment
                  .duration(timeToPeak, 'milliseconds')
                  .format(() =>
                    timeToPeak > 60 * 60 * 1000 ? 'h[h] m[m]' : 'm[m]',
                  )}</b>`,
                0,
              )
              .add();
            ttpValue.attr({
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
            const maxValue = this.renderer.text(`<b>${chartMax}</b>`, 0).add();
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
            const avgValue = this.renderer.text(`<b>${chartAvg}</b>`, 0).add();
            avgValue.attr({
              ...attrs,
              x: valueX,
              y: chartPaddingTop + lineHeight * 2,
            });

            const ttbLabel = this.renderer.text('TIME TO BASELINE:', 0).add();
            ttbLabel.attr({
              ...attrs,
              x: labelX,
              y: chartPaddingTop + lineHeight * 3,
            });
            const ttbValue = this.renderer
              .text(
                `<b>${
                  timeToBaseline !== -1
                    ? moment
                        .duration(timeToBaseline, 'milliseconds')
                        .format(() =>
                          timeToBaseline > 60 * 60 * 1000
                            ? 'h[h] m[m]'
                            : 'm[m]',
                        )
                    : 'N/A'
                }</b>`,
                0,
              )
              .add();
            ttbValue.attr({
              ...attrs,
              x: valueX,
              y: chartPaddingTop + lineHeight * 3,
            });

            ctx._qhLabels = [
              ttpLabel,
              ttpValue,
              maxLabel,
              maxValue,
              avgLabel,
              avgValue,
              ttbLabel,
              ttbValue,
            ];
          }
        },
      },
      height: 225,
      margin: [15, 0, hasLegend ? 80 : 30, 40],
      style: {
        fontFamily: 'Poppins',
      },
      type: 'spline',
    },
    colors: data.map(({ color }) => color),
    credits: {
      enabled: false,
    },
    legend: {
      enabled: hasLegend,
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
    series: data.map(({ data, title }) => ({
      data,
      name: title,
      type: 'spline',
    })),
    time: {
      moment,
      timezone: 'UTC',
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
        chartMax !== undefined
          ? {
              color: '#aaa',
              dashStyle: 'Dot',
              value: chartMax,
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
      ]),
      tickInterval: unitConfig.fromMmolL(0.5),
      title: {
        text: '',
      },
    },
  };
}

function calculateTimeToMax(data: [number, number][]): number {
  const maxDataPoint = data.reduce<[number, number]>(
    (acc, curr) => (curr[1] > acc[1] ? curr : acc),
    [-1, Number.MIN_VALUE],
  );
  return maxDataPoint[0];
}

function calculateTimeToBaseline(
  baseline: number,
  data: [number, number][],
): number {
  for (const [t, v] of data) {
    if (v <= baseline) {
      return t;
    }
  }
  return -1;
}

function formatDateTimeLong(millis: number, timezone: string) {
  return moment.tz(new Date(millis), timezone).format('dddd, MMMM Do @ h:mm A');
}

function formatDateTimeShort(millis: number, timezone: string) {
  return moment.tz(new Date(millis), timezone).format('MMMM Do @ h:mm A');
}
