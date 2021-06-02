import csvParse from 'csv-parse';
import moment from 'moment-timezone';
import React from 'react';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { FileStore } from './FileStore';

export type MetricValue<T> = {
  time: number;
  value: T;
};

type CsvRecord = {
  'Device Timestamp': string;
  'Record Type': string;
  'Historic Glucose mmol/L': string;
  'Scan Glucose mmol/L': string;
};

export const MetricsStoreContext = React.createContext<MetricsStore>(
  undefined as unknown as MetricsStore,
);

export class MetricsStore {
  public static metricValuesToHighchartsPairs = <T>(
    ms: MetricValue<T>[] | undefined,
  ): [number, T][] | undefined => {
    return ms !== undefined
      ? ms.map(({ time, value }) => [time, value])
      : undefined;
  };

  private customerDataTimeZone$$ = new BehaviorSubject('America/Toronto');

  constructor(private readonly fileStore: FileStore) {}

  /** Observe changes to the blood glucose metrics. */
  public readonly bloodGlucose$: Observable<MetricValue<number>[] | undefined> =
    combineLatest([
      this.fileStore.filesByType$('csv'),
      this.customerDataTimeZone$$,
    ])
      .pipe(
        concatMap(([files, customerDataTimeZone]) =>
          of<() => Promise<MetricValue<number>[] | undefined>>(
            () => Promise.resolve(undefined),
            async () => {
              const csvs = files.map((file) => {
                const data = atob(file.data);
                const bytes = new Uint8Array(data.length);
                for (let i = 0; i < data.length; i++) {
                  bytes[i] = data.charCodeAt(i);
                }
                return new TextDecoder('utf-8')
                  .decode(bytes)
                  .replaceAll('\r\n', '\n');
              });
              const timeValuesArr: Record<string, number>[] = await Promise.all(
                csvs.map(parseBloodGlucoseCsv),
              );
              const timeValues = timeValuesArr.reduce(
                (acc, m) => ({ ...acc, ...m }),
                {},
              );
              return Object.keys(timeValues)
                .map((timeStr) => {
                  const value = timeValues[timeStr];
                  const time = parseTime(timeStr, customerDataTimeZone);
                  return { time, value };
                })
                .sort((a, b) => a.time - b.time);
            },
          ),
        ),
      )
      .pipe(concatMap((fn) => fn()));
}

function parseBloodGlucoseCsv(input: string): Promise<Record<string, number>> {
  return new Promise((accept, reject) => {
    csvParse(
      input.split('\n').slice(1).join('\n'),
      { columns: true },
      (err, records: CsvRecord[]) => {
        if (err !== undefined) {
          return reject(err);
        }

        const result: Record<string, number> = {};
        for (const record of records) {
          const value = parseValue(record);
          if (value !== undefined) {
            result[record['Device Timestamp']] = value;
          }
        }

        accept(result);
      },
    );
  });
}

function parseTime(str: string, tz: string): number {
  return moment.tz(str, 'DD-MM-YYYY HH:mm', tz).valueOf();
}

function parseValue(record: CsvRecord): number | undefined {
  const value =
    record['Record Type'] === '0'
      ? parseFloat(record['Historic Glucose mmol/L'])
      : parseFloat(record['Scan Glucose mmol/L']);
  if (!isNaN(value)) {
    return value;
  } else {
    return undefined;
  }
}
