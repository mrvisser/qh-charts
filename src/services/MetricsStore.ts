import base64 from 'base64-js';
import React from 'react';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import {
  isDexcomClarityCsvFile,
  parseDexcomClarityCsvFile,
} from './DexcomClarityCsvParser';
import { FileStore } from './FileStore';
import {
  isFreestyleLibreCsvFile,
  parseFreestyleLibreCsvFile,
} from './FreestyleLibreCsvParser';
import { CsvLocale, MetricValue, ParsedMetrics } from './ParsedMetrics';

export type UnitConfig = {
  fromMmolL: (mmolL: number) => number;
  label: string;
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
          from([
            // Whenever we get a new set of files, first emit undefined to signal that we should
            // enter a loading / "stale" state for all consumers
            (): Promise<undefined> => Promise.resolve(undefined),
            async (): Promise<MetricValue<number>[]> => {
              const csvs = files.map((file) => {
                return new TextDecoder('utf-8')
                  .decode(base64.toByteArray(file.data))
                  .replaceAll('\r\n', '\n');
              });

              const timeValuesArr: ParsedMetrics[] = await Promise.all(
                csvs.map((csv) => parseCsvFile(csv, customerDataTimeZone)),
              );
              this.customerDataLocale$$.next(timeValuesArr[0]?.locale);

              const timeValues = timeValuesArr.reduce(
                (acc, m) => ({ ...acc, ...m.data }),
                {} as Record<string, number>,
              );

              return Object.entries(timeValues)
                .map(([timeStr, value]) => ({
                  time: new Date(timeStr).getTime(),
                  value,
                }))
                .sort((a, b) => a.time - b.time);
            },
          ]),
        ),
      )
      .pipe(concatMap((fn) => fn()));
}

async function parseCsvFile(
  content: string,
  timezone: string,
): Promise<ParsedMetrics> {
  if (isFreestyleLibreCsvFile(content)) {
    return await parseFreestyleLibreCsvFile(content, timezone);
  } else if (isDexcomClarityCsvFile(content)) {
    return await parseDexcomClarityCsvFile(content, timezone);
  } else {
    throw new Error('Unsupported file format.');
  }
}
