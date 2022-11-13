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
  margin: 30px 0px;
  position: relative;
  width: 100%;
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
            ranges: Record<string, number | null>;
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
            ranges: mkRanges(undefined, null, 2, 4.6, 5.3, 5.7, 8),
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
            ranges: mkRanges(undefined, 4, 4.55, 4.72, 5.83, 8.55, 10),
            unit: 'mmol/L',
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
                  const itemRanges = Object.entries(item.ranges) as [
                    string,
                    number | null,
                  ][];

                  const sections = itemRanges.filter(
                    (kv): kv is [string, number] => kv[1] !== null,
                  );

                  const valueFn =
                    item.calculate ?? ((values) => values[itemKey] ?? null);
                  const value = valueFn(dataValues);
                  if (value === null) {
                    return null;
                  }

                  const valuePct = (value: number) => {
                    const [, minValue] = sections[0];
                    const [, maxValue] = sections.slice(-1)[0];
                    if (value <= minValue) {
                      return '0%';
                    } else if (value >= maxValue) {
                      return '100%';
                    } else {
                      const sectionIndex =
                        sections.findIndex(([, v]) => value < v) - 1;
                      const [, loValue] = sections[sectionIndex];
                      const [, hiValue] = sections[sectionIndex + 1];
                      const basePct =
                        (sectionIndex / (sections.length - 1)) * 100;
                      const sectionPct =
                        ((value - loValue) / (hiValue - loValue)) *
                        (1 / (sections.length - 1)) *
                        100;
                      return `${basePct + sectionPct}%`;
                    }
                  };

                  return (
                    <div key={itemKey}>
                      <h4>
                        {itemKey} &mdash; {value.toFixed(2)} {item.unit}
                      </h4>
                      <DataItemContainer key={itemKey}>
                        <div
                          style={{
                            backgroundColor: 'white',
                            border: 'solid 4px black',
                            borderRadius: '26px',
                            height: '26px',
                            left: `calc(${valuePct(value)} - 18px)`,
                            position: 'absolute',
                            top: '-4px',
                            width: '26px',
                          }}
                        />
                        <svg width="100%" height="25px">
                          <linearGradient id={`range-${itemIndex}`}>
                            {sections.map(([k, lowValue], rangeIndex) => {
                              const [nextKey, nextLowValue] =
                                sections[rangeIndex + 1] ?? [];
                              if (nextKey === undefined) {
                                return null;
                              }

                              const midValue =
                                lowValue + (nextLowValue - lowValue) / 2;
                              return (
                                <stop
                                  key={k}
                                  offset={valuePct(midValue)}
                                  stopColor={ranges[k].color}
                                />
                              );
                            })}
                          </linearGradient>
                          <rect
                            width="100%"
                            height="100%"
                            rx="15"
                            fill={`url('#range-${itemIndex}')`}
                          />
                          {sections.map(([, v]) => (
                            <rect
                              height="25px"
                              width="1px"
                              x={valuePct(v)}
                              fill="white"
                            />
                          ))}
                        </svg>
                        <div
                          style={{
                            display: 'flex',
                            height: '25px',
                            justifyContent: 'stretch',
                            marginTop: '5px',
                            width: '100%',
                          }}
                        >
                          {sections.slice(0, -1).map(([k, v], i) => (
                            <div
                              style={{
                                borderLeft:
                                  i > 0 ? 'solid 1px #888' : undefined,
                                flex: '1',
                                textAlign: 'center',
                                width: '1px',
                              }}
                            >
                              <div>{ranges[k].label}</div>
                              <div>
                                {i === 0
                                  ? `< ${v}`
                                  : i === sections.length - 2
                                  ? `> ${v}`
                                  : `${v} - ${sections[i + 1][1]}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </DataItemContainer>
                    </div>
                  );
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
                    placeholder={item.ranges.O?.toString()}
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
