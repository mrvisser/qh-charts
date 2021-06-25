import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as HighchartsStock from 'highcharts/highstock';
import moment from 'moment-timezone';
import React from 'react';
import { map } from 'rxjs/operators';

import { useObservable } from '../hooks/useObservable';
import { MetricsStore, MetricsStoreContext } from '../services/MetricsStore';

export type ChartZoomablePropsMarker = {
  color: string;
  value: number;
};

export type ChartZoomableProps = {
  id?: string;
  markers?: ChartZoomablePropsMarker[];
  onChangeRange?: (start: number, end: number) => void;
  onSelectTime?: (time: number) => void;
  timezone: string;
};

export const ChartZoomable: React.FC<ChartZoomableProps> = ({
  id,
  markers = [],
  onChangeRange = () => undefined,
  onSelectTime = () => undefined,
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
  const highChartsOptions = React.useMemo(
    () =>
      overallBloodGlucose !== undefined
        ? createHighchartsOptions(
            timezone,
            overallBloodGlucose,
            markers,
            onChangeRange,
            onSelectTime,
          )
        : undefined,
    [markers, onChangeRange, onSelectTime, overallBloodGlucose, timezone],
  );

  return (
    <>
      {highChartsOptions !== undefined ? (
        <HighchartsReact
          id={id}
          constructorType="stockChart"
          highcharts={HighchartsStock}
          options={highChartsOptions}
        />
      ) : undefined}
    </>
  );
};

function createHighchartsOptions(
  timezone: string,
  data: [number, number][],
  markers: ChartZoomablePropsMarker[],
  onChangeRange: (start: number, end: number) => void = () => undefined,
  onSelectTime: (time: number) => void = () => undefined,
): Highcharts.Options {
  let rangeChangeTimeout: NodeJS.Timeout | undefined = undefined;
  return {
    chart: {
      animation: false,
      events: {
        click: function (event) {
          onSelectTime(this.xAxis[0].toValue(event.chartX));
        },
      },
      height: 350,
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
        events: {
          click: (event) => onSelectTime(event.point.x),
        },
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
      dateTimeLabelFormats: {
        day: "%e. %b '%y",
        week: "%e. %b '%y",
      },
      events: {
        setExtremes: (ev) => {
          if (onChangeRange !== undefined) {
            if (rangeChangeTimeout !== undefined) {
              clearTimeout(rangeChangeTimeout);
            }
            rangeChangeTimeout = setTimeout(
              () => onChangeRange(ev.min, ev.max),
              500,
            );
          }
        },
      },
      labels: {
        rotation: -45,
      },
      ordinal: false,
      plotLines: markers.map((m) => ({
        width: 2,
        ...m,
      })),
      type: 'datetime',
    },
    yAxis: {
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
