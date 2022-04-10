import csvParse from 'csv-parse';
import moment from 'moment-timezone';

import { CsvLocale, ParsedMetrics } from './ParsedMetrics';

type CsvRecord = {
  'Event Type': string;
  'Glucose Value (mg/dL)'?: string;
  'Glucose Value (mmol/L)'?: string;
};

export function isDexcomClarityCsvFile(content: string): boolean {
  return content.startsWith('Index,');
}

export async function parseDexcomClarityCsvFile(
  content: string,
  timezone: string,
): Promise<ParsedMetrics> {
  const records = validateRecords(await parseCsv(content), timezone);
  const locale = resolveLocale(records[0]?.record);
  const data: Record<string, number> = {};
  for (const { timestamp, record } of records) {
    const value = parseValue(locale, record);
    if (value !== undefined) {
      data[new Date(timestamp).toISOString()] = value;
    }
  }
  return { data, locale };
}

async function parseCsv(content: string): Promise<Record<string, string>[]> {
  return await new Promise((accept, reject) => {
    csvParse(
      content,
      { columns: true, relaxColumnCount: true },
      (err, records: Record<string, string>[]) =>
        err !== undefined ? reject(err) : accept(records),
    );
  });
}

function validateRecords(
  rawRecords: Record<string, string>[],
  timezone: string,
): { timestamp: number; record: CsvRecord }[] {
  const timestampFormatPrefix = 'Timestamp (';
  const timestampHeader = Object.keys(rawRecords[0]).find((k) =>
    k.startsWith(timestampFormatPrefix),
  );
  if (timestampHeader === undefined) {
    throw new Error('Could not find suitable timestamp header');
  }
  const timestampFormat = timestampHeader.slice(
    timestampFormatPrefix.length,
    -1,
  );
  return rawRecords
    .map((r) => ({
      record: r as unknown as CsvRecord,
      timestamp: moment
        .tz(r[timestampHeader], timestampFormat, timezone)
        .valueOf(),
    }))
    .filter(({ record }) => record['Event Type'] === 'EGV');
}

function parseValue(locale: CsvLocale, record: CsvRecord): number | undefined {
  const value = (() => {
    switch (locale) {
      case 'ca':
        return parseFloat(record['Glucose Value (mmol/L)'] ?? '');
      case 'us':
        return parseFloat(record['Glucose Value (mg/dL)'] ?? '');
    }
  })();

  return !isNaN(value) ? value : undefined;
}

function resolveLocale(row: CsvRecord | undefined): CsvLocale {
  if (row !== undefined && 'Glucose Value (mg/dL)' in row) {
    return 'us';
  } else {
    return 'ca';
  }
}
