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
    const value = parseValue(locale, record);
    if (value !== undefined) {
      const rawTime = record['Device Timestamp'];
      data[parseTime(locale, rawTime, timezone)] = value;
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
  return moment.tz(str, format, tz).toISOString();
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
