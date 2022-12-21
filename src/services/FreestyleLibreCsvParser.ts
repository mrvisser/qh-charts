import moment from 'moment-timezone';
import { parse as csvParse } from 'papaparse';

import { CsvLocale, ParsedMetrics } from './ParsedMetrics';

type CsvRecord = {
  'Serial Number': string;
  'Device Timestamp': string;
  'Record Type': string;
  'Historic Glucose mg/dL'?: string;
  'Historic Glucose mmol/L'?: string;
  'Scan Glucose mg/dL'?: string;
  'Scan Glucose mmol/L'?: string;
};

const transforms: Record<
  string,
  { adjust: number; from: string; until?: string }[]
> = {
  // Branden test
  '450E34A9-73C7-43EE-83ED-8D97C25F0B45': [
    {
      adjust: 4,
      from: '2021-03-23T14:01:00Z',
      until: '2021-03-24T04:00:00Z',
    },
  ],

  // Larlkyn
  '4EF37C42-BC67-4C98-B3AD-A8D69D07AD4F': [
    {
      adjust: -1,
      from: '2022-12-17T05:00:00Z',
    },
  ],

  // Larlkyn
  'B611D004-D7F2-43E0-9D8D-A9C5C0DEBA5A': [
    {
      adjust: -1,
      from: '2022-01-08T05:12:00Z',
      until: '2022-02-14T05:00:00Z',
    },
  ],
};

export function isFreestyleLibreCsvFile(content: string): boolean {
  return content.startsWith('Glucose Data,');
}

export async function parseFreestyleLibreCsvFile(
  content: string,
  timezone: string,
): Promise<ParsedMetrics> {
  const records = await parseCsv(content);
  const locale = resolveLocale(records);
  const data: Record<string, number> = {};

  for (const record of records) {
    const time = parseTime(locale, record['Device Timestamp'], timezone);
    const value = parseValue(time, locale, record);
    if (value !== undefined) {
      data[time] = value;
    }
  }

  return { data, locale };
}

async function parseCsv(content: string): Promise<CsvRecord[]> {
  return csvParse<CsvRecord>(content.split('\n').slice(1).join('\n'), {
    header: true,
  }).data;
}

/** Parses the freestyle libre date/time format into ISO time UTC string. */
function parseTime(locale: CsvLocale, str: string, tz: string): string {
  const format = (() => {
    switch (locale) {
      case 'ca':
        return 'DD-MM-YYYY HH:mm';
      case 'us':
        return 'MM-DD-YYYY hh:mm A';
    }
  })();
  const time = moment.tz(str, format, tz).toISOString();
  return time;
}

function parseValue(
  isoTime: string,
  locale: CsvLocale,
  record: CsvRecord,
): number | undefined {
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

  if (isNaN(value)) {
    return undefined;
  }

  const serialNumber = record['Serial Number'];
  if (!(serialNumber in transforms)) {
    return value;
  }

  const time = new Date(isoTime).getTime();
  const adjustment = transforms[serialNumber].find(({ from, until }) => {
    if (time < new Date(from).getTime()) {
      return false;
    } else if (until !== undefined && time > new Date(until).getTime()) {
      return false;
    }

    return true;
  });

  return value + (adjustment?.adjust ?? 0);
}

function resolveLocale([row]: CsvRecord[]): CsvLocale {
  if (row !== undefined && 'Historic Glucose mg/dL' in row) {
    return 'us';
  } else {
    return 'ca';
  }
}
