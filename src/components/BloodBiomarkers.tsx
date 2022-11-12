import { mdiCog } from '@mdi/js';
import React from 'react';
import styled from 'styled-components';

import { Drawer } from './Drawer';
import { InputText } from './InputText';
import { StalkingButton, StalkingButtonGroup } from './StalkingButtonGroup';

const Fullscreen = styled.div`
  align-items: stretch;
  display: flex;
  height: 100vh;
  justify-content: stretch;
  max-width: 800px;
  width: 100vw;
`;

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

const SettingsSectionInputContainer = styled.label`
  margin: 15px 0px;
`;

const DataItemContainer = styled.div`
  margin: 15px 0px;
`;

const ranges = mkRanges(
  { color: '#dc006a', label: 'Alarm Low', score: 1 },
  { color: '#d4514a', label: 'Below Standard', score: 3 },
  { color: '#f6bd41', label: 'Below Optimal', score: 6 },
  { color: '#41cc84', label: 'Optimal', score: 17 },
  { color: '#f6bd41', label: 'Above Optimal', score: 11 },
  { color: '#d4514a', label: 'Above Standard', score: 11 },
  { color: '#dc006a', label: 'Alarm High', score: 3 },
);

export const BloodBiomarkers: React.FC = () => {
  const [showSettings, setShowSettings] = React.useState(false);
  const dataItems = React.useMemo<
    Record<
      string,
      {
        items: Record<
          string,
          {
            ranges: Record<string, number>;
            unit: string;
            calculate?: (values: Record<string, number>) => number | null;
          }
        >;
        title: string;
      }
    >
  >(
    () => ({
      /* I'm using order of keys in these to order the sections and items */
      /* eslint-disable sort-keys-fix/sort-keys-fix */
      bloodGlucose: {
        items: {
          'Glucose (fasting)': {
            ranges: mkRanges(undefined, 2, 3.61, 4.16, 4.77, 5.5, 7),
            unit: 'mmol/L',
          },
          'Insulin (fasting)': {
            ranges: mkRanges(
              undefined,
              undefined,
              5,
              13.89,
              34.72,
              136.11,
              325,
            ),
            unit: 'pmol/L',
          },
          'Hemoglobin A1C': {
            ranges: mkRanges(undefined, undefined, 2, 4.6, 5.3, 5.7, 8),
            unit: '%',
          },
          'HOMA-%β': {
            calculate: ({
              'Glucose (fasting)': glucose,
              'Insulin (fasting)': insulin,
            }: Record<string, number>) =>
              glucose !== undefined && insulin !== undefined
                ? (20 * pmolL2iu(insulin)) / (glucose - 3.5)
                : null,
            ranges: mkRanges(undefined, 35, 70, 90, 110, 120, 150),
            unit: '%',
          },
          'HOMA-IR': {
            calculate: ({
              'Glucose (fasting)': glucose,
              'Insulin (fasting)': insulin,
            }: Record<string, number>) =>
              glucose !== undefined && insulin !== undefined
                ? (pmolL2iu(insulin) * glucose) / 22.5
                : null,
            ranges: mkRanges(undefined, 0.1, 0.5, 0.75, 1.25, 1.75, 3),
            unit: 'Index',
          },
          eAG: {
            calculate: ({ 'Hemoglobin A1C': a1c }: Record<string, number>) =>
              a1c !== undefined ? mgdL2mmolL(a1c * 28.7 - 46.7) : null,
            ranges: mkRanges(undefined, 3, 4.55, 4.72, 5.83, 8.55, 10),
            unit: 'mmol/L',
          },
          QUICKI: {
            calculate: ({
              'Glucose (fasting)': glucose,
              'Insulin (fasting)': insulin,
            }: Record<string, number>) =>
              glucose !== undefined && insulin !== undefined
                ? 1 /
                  (Math.log10(pmolL2iu(insulin)) +
                    Math.log10(mmolL2mgdL(glucose)))
                : null,
            ranges: mkRanges(undefined, 0.1, 0.34, 0.45, 5, 8),
            unit: 'Index',
          },
        },
        title: 'Blood Glucose',
      },
    }),
    /* eslint-enable sort-keys-fix/sort-keys-fix */
    [],
  );

  const [dataValues, setDataValues] = React.useState<Record<string, number>>();

  React.useEffect(() => {
    if (dataValues === undefined) {
      setShowSettings(true);
    }
  }, [dataValues]);

  function handleChange(
    itemKey: string,
    ev: React.FocusEvent<HTMLInputElement>,
  ) {
    const value = parseFloat(ev.target.value);
    if (isNaN(value)) {
      setDataValues(({ [itemKey]: _, ...values } = {}) => values);
    } else {
      setDataValues((values) => ({ ...values, [itemKey]: value }));
    }
  }

  return (
    <>
      <StalkingButtonGroup>
        <StalkingButton path={mdiCog} onClick={() => setShowSettings(true)} />
      </StalkingButtonGroup>
      <Fullscreen>
        {Object.entries(dataItems).map(([sectionKey, section]) =>
          dataValues !== undefined ? (
            <div key={sectionKey} style={{ width: '100%' }}>
              <h3>{section.title}</h3>
              {Object.entries(section.items).map(
                ([itemKey, item], itemIndex) => {
                  const valueFn =
                    item.calculate ?? ((values) => values[itemKey] ?? null);
                  const value = valueFn(dataValues);
                  const rangeKeys = Object.keys(item.ranges).slice(0, -1);
                  const minValue = item.ranges[rangeKeys[0]];
                  const maxValue = item.ranges[rangeKeys.slice(-1)[0]];
                  return value !== null ? (
                    <DataItemContainer key={itemKey}>
                      <div>
                        {itemKey}: {value.toFixed(2)} {item.unit}
                      </div>
                      <svg width="100%" height="25px">
                        <linearGradient id={`range-${itemIndex}`}>
                          {rangeKeys.map((rangeKey, rangeIndex) => {
                            const nextKey = rangeKeys[rangeIndex + 1];
                            const nextLowValue =
                              nextKey !== undefined
                                ? item.ranges[nextKey]
                                : undefined;
                            const lowValue = item.ranges[rangeKey];
                            const midValue =
                              nextLowValue !== undefined
                                ? lowValue + (nextLowValue - lowValue) / 2
                                : undefined;
                            const percent =
                              rangeIndex === 0
                                ? 0
                                : midValue === undefined
                                ? 1
                                : (midValue - minValue) / (maxValue - minValue);
                            return (
                              <stop
                                key={rangeKey}
                                offset={`${percent * 100}%`}
                                stopColor={ranges[rangeKey].color}
                              />
                            );
                          })}
                        </linearGradient>
                        <rect
                          x="0"
                          width="100%"
                          height="100%"
                          rx="15"
                          fill={`url('#range-${itemIndex}')`}
                        />
                      </svg>
                    </DataItemContainer>
                  ) : null;
                },
              )}
            </div>
          ) : null,
        )}
      </Fullscreen>
      <SettingsPanel
        active={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
        {Object.entries(dataItems).map(([sectionKey, section]) => (
          <SettingsSection key={sectionKey}>
            <SettingsSectionTitle>{section.title}</SettingsSectionTitle>
            {Object.entries(section.items)
              .filter(([, item]) => item.calculate === undefined)
              .map(([itemKey, item]) => (
                <SettingsSectionInputContainer key={itemKey}>
                  {itemKey}:{' '}
                  <InputText
                    defaultValue={dataValues?.[itemKey]?.toString() ?? ''}
                    placeholder={item.ranges.O.toString()}
                    onBlur={(ev) => handleChange(itemKey, ev)}
                  />{' '}
                  {item.unit}
                </SettingsSectionInputContainer>
              ))}
          </SettingsSection>
        ))}
      </SettingsPanel>
    </>
  );
};

function pmolL2iu(pmolL: number) {
  return pmolL / 6;
}

function mmolL2mgdL(mmolL: number) {
  return mmolL * 18;
}

function mgdL2mmolL(mgdL: number) {
  return mgdL / 18;
}

function mkRanges<V>(
  alarmLow?: V,
  belowStandard?: V,
  belowOptimal?: V,
  optimal?: V,
  aboveOptimal?: V,
  aboveStandard?: V,
  alarmHigh?: V,
): Record<string, V> {
  return {
    ...(alarmLow !== undefined ? { '<!': alarmLow } : {}),
    ...(belowStandard !== undefined ? { '<S': belowStandard } : {}),
    ...(belowOptimal !== undefined ? { '<O': belowOptimal } : {}),
    ...(optimal !== undefined ? { O: optimal } : {}),
    ...(aboveOptimal !== undefined ? { '>O': aboveOptimal } : {}),
    ...(aboveStandard !== undefined ? { '>S': aboveStandard } : {}),
    ...(alarmHigh !== undefined ? { '>!': alarmHigh } : {}),
  } as Record<string, V>;
}
