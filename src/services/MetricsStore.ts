import csvParse from 'csv-parse';
import moment from 'moment-timezone';
import React from 'react';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { FileStore } from './FileStore';

export type MetricValue<T> = {
  time: Date;
  value: T;
};

type CsvRecord = {
  'Device Timestamp': string;
  'Record Type': string;
  'Historic Glucose mmol/L': string;
  'Scan Glucose mmol/L': string;
};

export const MetricsStoreContext = React.createContext<MetricsStore>(
  (undefined as unknown) as MetricsStore,
);

export class MetricsStore {
  constructor(private readonly fileStore: FileStore) {}

  /** Observe changes to the blood glucose metrics. */
  public readonly bloodGlucose$: Observable<
    MetricValue<number>[] | undefined
  > = this.fileStore
    .filesByType$('csv')
    .pipe(
      concatMap((files) =>
        of<() => Promise<MetricValue<number>[] | undefined>>(
          () => Promise.resolve(undefined),
          async () => {
            const csvs = files.map((file) => {
              const data = atob(file.data);
              const bytes = new Uint8Array(data.length);
              for (let i = 0; i < data.length; i++) {
                bytes[i] = data.charCodeAt(i);
              }
              return new TextDecoder('utf-8').decode(bytes);
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
                const time = parseTime(timeStr);
                return { time, value };
              })
              .sort((a, b) => a.time.getTime() - b.time.getTime());
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

function parseTime(str: string): Date {
  return moment.tz(str, 'DD-MM-YYYY HH:mm', 'America/Toronto').toDate();
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
