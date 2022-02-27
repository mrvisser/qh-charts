import base64 from 'base64-js';
import csvParse from 'csv-parse';
import moment from 'moment-timezone';
import React from 'react';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { FileStore } from './FileStore';

export type CsvLocale = 'ca' | 'us';

export type MetricValue<T> = {
  time: number;
  value: T;
};

export type UnitConfig = {
  fromMmolL: (mmolL: number) => number;
  label: string;
};

type CsvRecord = {
  'Serial Number': string;
  'Device Timestamp': string;
  'Record Type': string;
  'Historic Glucose mg/dL'?: string;
  'Historic Glucose mmol/L'?: string;
  'Scan Glucose mg/dL'?: string;
  'Scan Glucose mmol/L'?: string;
};
export const MetricsStoreContext = React.createContext<MetricsStore>(
  undefined as unknown as MetricsStore,
);

// There are some devices that were off by 1 mmol. Adjust them up by 1
const transforms: Record<
  string,
  { adjust: number; from: string; until?: string }
> = {
  // Branden test
  '450E34A9-73C7-43EE-83ED-8D97C25F0B45': {
    adjust: 4,
    from: '23-03-2021 10:01',
    until: '24-03-2021 00:00',
  },

  // Larlkyn
  'B611D004-D7F2-43E0-9D8D-A9C5C0DEBA5A': {
    adjust: -1,
    from: '08-01-2022 00:12',
    until: '14-02-2021 00:00',
  },
};

export class MetricsStore {
  public static metricValuesToHighchartsPairs = <T>(
    ms: MetricValue<T>[] | undefined,
  ): [number, T][] | undefined => {
    return ms !== undefined
      ? ms.map(({ time, value }) => [time, value])
      : undefined;
  };

  private customerDataTimeZone$$ = new BehaviorSubject('America/Toronto');
  private customerDataLocale$$ = new BehaviorSubject<CsvLocale | undefined>(
    undefined,
  );

  constructor(private readonly fileStore: FileStore) {}

  public readonly locale$ = this.customerDataLocale$$.asObservable();

  /** Observe changes to the blood glucose metrics. */
  public readonly bloodGlucose$: Observable<MetricValue<number>[] | undefined> =
    combineLatest([
      this.fileStore.filesByType$('csv'),
      this.customerDataTimeZone$$,
    ])
      .pipe(
        concatMap(([files, customerDataTimeZone]) =>
          of<() => Promise<MetricValue<number>[] | undefined>>(
            // Whenever we get a new set of files, first emit undefined to signal that we should
            // enter a loading / "stale" state for all consumers
            () => Promise.resolve(undefined),
            async () => {
              const csvs = files.map((file) => {
                return new TextDecoder('utf-8')
                  .decode(base64.toByteArray(file.data))
                  .replaceAll('\r\n', '\n');
              });
              const timeValuesArr: {
                customerId: string;
                data: Record<string, number>;
                locale: CsvLocale;
              }[] = await Promise.all(csvs.map(parseBloodGlucoseCsv));

              const { customerId, locale } = timeValuesArr[0];
              this.customerDataLocale$$.next(locale);

              const timeValues = timeValuesArr.reduce(
                (acc, m) => ({ ...acc, ...m.data }),
                {} as Record<string, number>,
              );

              // Adjust for bogus machines
              const transformData = transforms[customerId];
              const transformFrom =
                transformData !== undefined
                  ? parseTime(locale, transformData.from, customerDataTimeZone)
                  : undefined;
              const transformUntil =
                transformData?.until !== undefined
                  ? parseTime(locale, transformData.until, customerDataTimeZone)
                  : undefined;
              const transform =
                transformFrom !== undefined
                  ? (time: number, value: number) =>
                      time >= transformFrom &&
                      (transformUntil === undefined || time < transformUntil)
                        ? value + transformData.adjust
                        : value
                  : (_: number, value: number) => value;
              return Object.keys(timeValues)
                .map((timeStr) => {
                  const time = parseTime(locale, timeStr, customerDataTimeZone);
                  const value = transform(time, timeValues[timeStr]);
                  return { time, value };
                })
                .sort((a, b) => a.time - b.time);
            },
          ),
        ),
      )
      .pipe(concatMap((fn) => fn()));
}

function parseBloodGlucoseCsv(input: string): Promise<{
  customerId: string;
  locale: CsvLocale;
  data: Record<string, number>;
}> {
  return new Promise((accept, reject) => {
    const rows = input.split('\n').slice(1).join('\n');
    csvParse(rows, { columns: true }, (err, records: CsvRecord[]) => {
      if (err !== undefined) {
        return reject(err);
      }

      const locale = resolveLocale(records);
      const data: Record<string, number> = {};
      for (const record of records) {
        const value = parseValue(locale, record);
        if (value !== undefined) {
          data[record['Device Timestamp']] = value;
        }
      }

      accept({ customerId: records[0]['Serial Number'], data, locale });
    });
  });
}

function parseTime(locale: CsvLocale, str: string, tz: string): number {
  const format = (() => {
    switch (locale) {
      case 'ca':
        return 'DD-MM-YYYY HH:mm';
      case 'us':
        return 'MM-DD-YYYY hh:mm A';
    }
  })();
  return moment.tz(str, format, tz).valueOf();
}

function parseValue(locale: CsvLocale, record: CsvRecord): number | undefined {
  const value = (() => {
    switch (locale) {
      case 'ca':
        return record['Record Type'] === '0'
          ? parseFloat(record['Historic Glucose mmol/L'] ?? '')
          : parseFloat(record['Scan Glucose mmol/L'] ?? '');
      case 'us':
        return record['Record Type'] === '0'
          ? parseFloat(record['Historic Glucose mg/dL'] ?? '')
          : parseFloat(record['Scan Glucose mg/dL'] ?? '');
    }
  })();

  return !isNaN(value) ? value : undefined;
}

function resolveLocale([row]: CsvRecord[]): CsvLocale {
  if (row !== undefined && 'Historic Glucose mg/dL' in row) {
    return 'us';
  } else {
    return 'ca';
  }
}
