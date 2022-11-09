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
  const dataItems = React.useMemo(
    () => ({
      bloodGlucose: {
        items: {
          'Glucose (fasting)': {
            ranges: mkRanges(undefined, 2, 3.61, 4.16, 4.77, 5.5, 7),
            unit: 'mmol/L',
          },
          'HOMA2-%B': {
            ranges: mkRanges(undefined, 35, 70, 90, 110, 120, 150),
            unit: '%',
          },
          'HOMA2-%S': {
            ranges: mkRanges(undefined, 40, 75, 85, 200, 250, 325),
            unit: '%',
          },
          'HOMA2-IR': {
            ranges: mkRanges(undefined, 0.1, 0.5, 0.75, 1.25, 1.75, 3),
            unit: '%',
          },
          'Hemoglobin A1C': {
            ranges: mkRanges(undefined, undefined, 2, 4.6, 5.3, 5.7, 8),
            unit: '%',
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
            unit: '%',
          },
          QUICKI: {
            ranges: mkRanges(undefined, 0.1, 0.34, 0.45, 5, 8),
            unit: 'Index',
          },
          eAG: {
            ranges: mkRanges(undefined, 3, 4.55, 4.72, 5.83, 8.55, 10),
            unit: 'mmol/L',
          },
        },
        title: 'Blood Glucose',
      },
    }),
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
        {Object.entries(dataItems).map(([sectionKey, section]) => (
          <div key={sectionKey} style={{ width: '100%' }}>
            <h3>{section.title}</h3>
            {Object.entries(section.items).map(([itemKey, item], itemIndex) => {
              const value = dataValues?.[itemKey];
              const rangeKeys = Object.keys(item.ranges).slice(0, -1);
              const minValue = item.ranges[rangeKeys[0]];
              const maxValue = item.ranges[rangeKeys.slice(-1)[0]];
              return value !== undefined ? (
                <DataItemContainer key={itemKey}>
                  <div>
                    {itemKey}: {value} {item.unit}
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
            })}
          </div>
        ))}
      </Fullscreen>
      <SettingsPanel
        active={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
        {Object.entries(dataItems).map(([sectionKey, section]) => (
          <SettingsSection key={sectionKey}>
            <SettingsSectionTitle>{section.title}</SettingsSectionTitle>
            {Object.entries(section.items).map(([itemKey, item]) => (
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
