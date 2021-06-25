import { mdiChevronLeft, mdiCog, mdiTrashCanOutline } from '@mdi/js';
import HighchartsReact from 'highcharts-react-official';
import _ from 'lodash';
import moment from 'moment-timezone';
import React from 'react';
import { map } from 'rxjs/operators';
import styled from 'styled-components';

import { ChartZoomable, ChartZoomablePropsMarker } from './ChartZoomable';
import { Drawer } from './Drawer';
import { IconButton } from './IconButton';
import { StalkingButton, StalkingButtonGroup } from './StalkingButtonGroup';

import { useObservable } from 'src/hooks/useObservable';
import { MetricsStore, MetricsStoreContext } from 'src/services/MetricsStore';

export type CaseStudiesProps = {
  onBack: () => void;
  timezone: string;
};

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

const SettingsCaseStudyList = styled.ul``;
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
    width: 225px;
  }

  & > div:nth-child(3) {
    flex: 1;
    justify-content: flex-end;
  }

  & input {
    border: solid 1px #ddd;
    border-radius: 5px;
    font-size: 16px;
    margin-right: 10px;
    padding: 10px;
  }

  & input:focus {
    border-color: #888;
  }
`;
const SettingsCaseStudyListHeader = styled(SettingsCaseStudyListItem)`
  font-size: 18px;
  font-weight: 500;

  :hover {
    background: none;
  }
`;

const SettingsCaseStudyColorPreview = styled.div`
  border: solid 1px #eee;
  border-radius: 5px;
  height: 1.7em;
  width: 1.7em;
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

const CaseStudyChart = styled.div`
  flex: 1;
`;

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

  const [showSettings, setShowSettings] = React.useState(false);
  const [hours, setHours] = React.useState(4);
  const [markers, setMarkers] = React.useState<ChartZoomablePropsMarker[]>([]);
  const [charts, setCharts] = React.useState<
    { id: number; title: string; options: Highcharts.Options }[]
  >([]);

  React.useEffect(() => {
    if (markers.length === 0) {
      setShowSettings(true);
    }

    if (overallBloodGlucose !== undefined) {
      const durationMillis = hours * 60 * 60 * 1000;

      // Build the data
      const dataByChartId: Record<number, [number, number][]> = {};
      const ids = markers.map((m) => m.value).sort();
      for (const i of ids) {
        dataByChartId[i] = [];
      }

      for (const [t, v] of overallBloodGlucose) {
        for (let i = 0; i < ids.length && ids[i] <= t; i++) {
          if (t < ids[i] + durationMillis) {
            dataByChartId[ids[i]].push([t, v]);
          }
        }
      }

      setCharts(
        markers.map((marker) => ({
          id: marker.value,
          options: createHighchartsOptionsForCaseStudy(
            timezone,
            marker.color,
            dataByChartId[marker.value],
            { max: marker.value + durationMillis, min: marker.value },
            { max: 12, min: 3 },
          ),
          title: new Date(marker.value).toLocaleString(),
        })),
      );
    }
  }, [hours, markers, overallBloodGlucose, timezone]);

  return (
    <>
      <StalkingButtonGroup>
        <StalkingButton path={mdiChevronLeft} onClick={onBack} />
        <StalkingButton path={mdiCog} onClick={() => setShowSettings(true)} />
      </StalkingButtonGroup>

      {charts.length > 0 ? (
        <CaseStudyChartsContainer>
          <CaseStudyChartsHeading>Case Studies</CaseStudyChartsHeading>
          {charts.map(({ id, options, title }) => {
            return (
              <CaseStudyChartsPageGroup key={id}>
                <CaseStudyChartContainer>
                  <CaseStudyChartHeading>{title}</CaseStudyChartHeading>
                  <CaseStudyChart>
                    <HighchartsReact id={`chart-${id}`} options={options} />
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
        title="Case Studies"
      >
        <SettingsSection>
          <SettingsSectionTitle>
            Click to create case studies:
          </SettingsSectionTitle>
          <ChartZoomable
            markers={markers}
            onSelectTime={(value) =>
              setMarkers((ms) =>
                _.chain(ms)
                  .concat({ color: 'red', value })
                  .uniqBy((e) => e.value)
                  .sortBy((e) => e.value)
                  .value(),
              )
            }
            timezone={timezone}
          />
        </SettingsSection>
        <SettingsSection>
          <SettingsSectionTitle>How many hours after:</SettingsSectionTitle>
          <input
            placeholder={hours.toString()}
            onBlur={(ev) => {
              const nextHours = parseFloat(ev.target.value.trim());
              if (!isNaN(nextHours)) {
                setHours(nextHours);
              }
              ev.target.value = '';
            }}
          />
        </SettingsSection>
        <SettingsSection>
          <SettingsSectionTitle>Update their appearance:</SettingsSectionTitle>
          <SettingsCaseStudyList>
            <SettingsCaseStudyListHeader>
              <div>Date &amp; Time</div>
              <div>Color</div>
            </SettingsCaseStudyListHeader>
            {markers.map((m, i0) => (
              <SettingsCaseStudyListItem key={m.value}>
                <div>{new Date(m.value).toLocaleString()}</div>
                <div>
                  <input
                    onBlur={(ev) => {
                      const nextColor = ev.target.value.trim();
                      if (nextColor !== '') {
                        setMarkers((ms) =>
                          ms.map((m, i1) =>
                            i0 === i1 ? { ...m, color: nextColor } : m,
                          ),
                        );
                      }
                      ev.target.value = '';
                    }}
                    placeholder={m.color}
                  />
                  <SettingsCaseStudyColorPreview
                    style={{ backgroundColor: m.color }}
                  >
                    {' '}
                  </SettingsCaseStudyColorPreview>
                </div>
                <div>
                  <IconButton
                    onClick={() =>
                      setMarkers((ms) => ms.filter((_, i1) => i1 !== i0))
                    }
                    path={mdiTrashCanOutline}
                  />
                </div>
              </SettingsCaseStudyListItem>
            ))}
          </SettingsCaseStudyList>
        </SettingsSection>
      </SettingsPanel>
    </>
  );
};

function createHighchartsOptionsForCaseStudy(
  timezone: string,
  color: string,
  data: [number, number][],
  xMinMax: { min: number; max: number },
  yMinMax: {
    min: number;
    max: number;
  },
): Highcharts.Options {
  const values = data.map((p) => p[1]);
  const chartMax = Math.max(...values);

  return {
    chart: {
      height: 225,
      margin: [15, 0, 30, 40],
      style: {
        fontFamily: 'Poppins',
      },
      type: 'spline',
    },
    colors: [color],
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
          value: 5,
          width: 4,
          zIndex: 2,
        },
      ]),
      tickInterval: 0.5,
      title: {
        text: '',
      },
    },
  };
}
