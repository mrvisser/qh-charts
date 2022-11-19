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
  max-width: 900px;
  padding-bottom: 2rem;
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
  font-weight: bold;
  margin-bottom: 25px;
  text-transform: uppercase;
`;

const SettingsSectionInputContainer = styled.label`
  display: flex;
  flex-direction: row;
  margin: 15px 0px;
`;
const SettingsSectionInputLabel = styled.div``;
const SettingsSectionInputTextField = styled.div``;
const SettingsSectionInputUnit = styled.div``;

const SectionContainer = styled.div`
  break-inside: avoid;
  padding-top: 4rem;
`;
const SectionHeader = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-transform: uppercase;
  border-bottom: solid 1px #ccc;
  padding-bottom: 0.5rem;
`;

const DataItemContainer = styled.div`
  break-inside: avoid;
  display: flex;
  flex-direction: row;
  padding: 2.5rem 0 1rem 0;
`;
const DataItemHeader = styled.h4`
  flex: 0 0 25%;
`;
const DataItemHeaderTitle = styled.div`
  margin-bottom: 0.5rem;
`;
const DataItemHeaderValueContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const DataItemHeaderValueNumber = styled.div`
  font-size: 1.5rem;
`;
const DataItemHeaderValueUnit = styled.div`
  align-self: flex-end;
  font-size: 0.8rem;
  margin-left: 5px;
  padding-bottom: 0.1rem;
`;
const DataItemRangeContainer = styled.div`
  flex: 1;
  font-size: 0.8rem;
  position: relative;
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
            calculate?: (
              values: Record<string, Record<string, number>>,
            ) => number | null;
          }
        >;
      }
    >
  >(
    () => ({
      /* I'm using order of keys in these to order the sections and items */
      /* eslint-disable sort-keys-fix/sort-keys-fix */
      'Blood Glucose': {
        items: {
          'Glucose (fasting)': {
            ranges: mkRanges(undefined, 2.78, 3.61, 4.16, 4.77, 5.5, 16.65),
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
              175,
            ),
            unit: 'pmol/L',
          },
          'Hemoglobin A1C': {
            ranges: mkRanges(undefined, null, 0, 4.6, 5.3, 5.7, 8.1),
            unit: '%',
          },
          'HOMA-IR': {
            calculate: ({
              'Blood Glucose': {
                'Glucose (fasting)': glucose = NaN,
                'Insulin (fasting)': insulin = NaN,
              } = {},
            }) =>
              !isNaN(glucose) && !isNaN(insulin)
                ? (pmolL2iu(insulin) * glucose) / 22.5
                : null,
            ranges: mkRanges(undefined, 0.1, 0.5, 0.75, 1.25, 1.75, 3),
            unit: 'Index',
          },
          eAG: {
            calculate: ({
              'Blood Glucose': { 'Hemoglobin A1C': a1c = NaN } = {},
            }) => (!isNaN(a1c) ? mgdL2mmolL(a1c * 28.7 - 46.7) : null),
            ranges: mkRanges(undefined, 2.78, 4.55, 4.72, 5.83, 8.55, 8.6),
            unit: 'mmol/L',
          },
        },
      },
      Renal: {
        items: {
          Creatinine: {
            ranges: mkRanges(undefined, 0, 35.36, 70.72, 97.24, 132.6, 221),
            unit: 'μmol/L',
          },
          eGFR: {
            ranges: mkRanges(undefined, 29, 60, 90, 120, 160, 200),
            unit: 'mL/min/1.73m2',
          },
        },
      },
      Electrolytes: {
        items: {
          Sodium: {
            ranges: mkRanges(undefined, null, 120, 135, 142, 146, 155),
            unit: 'mmol/L',
          },
          Potassium: {
            ranges: mkRanges(undefined, 3, 3.5, 4, 4.5, 5.3, 6),
            unit: 'mmol/L',
          },
          Chloride: {
            ranges: mkRanges(undefined, 9, 98, 100, 106, 110, 115),
            unit: 'mmol/L',
          },
          CO2: {
            ranges: mkRanges(undefined, 10, 19, 25, 30, 40, null),
            unit: 'mmol/L',
          },
        },
      },
      Metabolic: {
        items: {
          'Uric Acid - Female': {
            ranges: mkRanges(
              undefined,
              110,
              148.7,
              178.44,
              327.14,
              416.36,
              480,
            ),
            unit: 'μmol/L',
          },
          'Uric Acid - Male': {
            ranges: mkRanges(
              undefined,
              118.96,
              205.21,
              208.18,
              350.93,
              475.84,
              535.32,
            ),
            unit: 'μmol/L',
          },
        },
      },
      'Liver and GB': {
        items: {
          'Alk Phos': {
            ranges: mkRanges(undefined, 12, 35, 70, 100, 150, 250),
            unit: 'IU/L',
          },
          AST: {
            ranges: mkRanges(undefined, null, 3, 10, 26, 35, 45),
            unit: 'U/L',
          },
          ALT: {
            ranges: mkRanges(undefined, 2, 6, 10, 26, 29, 35),
            unit: 'U/L',
          },
          'Bilirubin - Total': {
            ranges: mkRanges(undefined, 1, 3.42, 5.13, 15.39, 20.52, 30),
            unit: 'μmol/L',
          },
          GGT: {
            ranges: mkRanges(undefined, 0.5, 3, 10, 17, 85, 160),
            unit: 'U/L',
          },
          'AST : ALT': {
            calculate: ({ 'Liver and GB': { AST = NaN, ALT = NaN } = {} }) =>
              !isNaN(AST) && !isNaN(ALT) ? AST / ALT : null,
            ranges: mkRanges(undefined, null, null, 0, 1, 2),
            unit: 'Ratio',
          },
        },
      },
      'Iron Markers': {
        items: {
          Ferritin: {
            ranges: mkRanges(undefined, 7, 16, 30, 70, 232, 350),
            unit: 'μg/L',
          },
        },
      },
      Lipids: {
        items: {
          'Cholesterol (Total)': {
            ranges: mkRanges(undefined, 2, 3.23, 4.14, 4.65, 5.17, 10),
            unit: 'mmol/L',
          },
          Triglycerides: {
            ranges: mkRanges(undefined, null, 0.5, 0.79, 0.9, 1.69, 3),
            unit: 'mmol/L',
          },
          'LDL Cholesterol': {
            ranges: mkRanges(undefined, null, 0.75, 2.07, 2.59, 3.5),
            unit: 'mmol/L',
          },
          'HDL Cholesterol': {
            ranges: mkRanges(undefined, 0.3, 1.16, 1.42, 1.81, 2.59, 4),
            unit: 'mmol/L',
          },
          'Non-HDL Cholesterol': {
            ranges: mkRanges(undefined, null, null, 0, 2.85, 3.37, 5),
            unit: 'mmol/L',
          },
          'Cholesterol : HDL': {
            calculate: ({
              Lipids: {
                'Cholesterol - Total': cholesterol = NaN,
                'HDL Cholesterol': hdl = NaN,
              } = {},
            }) =>
              !isNaN(cholesterol) && !isNaN(hdl) ? cholesterol / hdl : null,
            ranges: mkRanges(undefined, null, null, 0, 3, 5, 8),
            unit: 'Ratio',
          },
          'Trigliceride : HDL': {
            calculate: ({
              Lipids: {
                Triglycerides: triglicerides = NaN,
                'HDL Cholesterol': hdl = NaN,
              } = {},
            }) =>
              !isNaN(triglicerides) && !isNaN(hdl) ? triglicerides / hdl : null,
            ranges: mkRanges(undefined, null, null, 0, 3, 5, 8),
            unit: 'Ratio',
          },
        },
      },
      Thyroid: {
        items: {
          TSH: {
            ranges: mkRanges(undefined, 0, 0.4, 1.3, 3, 4.5, 5),
            unit: 'mU/L',
          },
        },
      },
      Vitamins: {
        items: {
          'Vitamin B12': {
            ranges: mkRanges(
              undefined,
              50,
              147.56,
              332.01,
              590.24,
              811.58,
              1200,
            ),
            unit: 'pmol/L',
          },
          'Vitamin D (25-OH)': {
            ranges: mkRanges(
              undefined,
              49.92,
              74.88,
              124.8,
              224.64,
              249.6,
              324.48,
            ),
            unit: 'pmol/L',
          },
        },
      },
      Hormones: {
        items: {
          'FSH - Female': {
            ranges: mkRanges(undefined, 0.3, 1.5, 5, 7, 9.1, 12),
            unit: 'mlU/ml',
          },
          'Estradiol - Female': {
            ranges: mkRanges(
              undefined,
              75,
              234.94,
              550.65,
              1284.85,
              1310.55,
              1500,
            ),
            unit: 'pmol/L',
          },
        },
      },
      'CBC/Hematology': {
        items: {
          'RBC - Female': {
            ranges: mkRanges(undefined, 2.75, 3.8, 3.9, 4.5, 5.1, 7),
            unit: '10E12/L',
          },
          'RBC - Male': {
            ranges: mkRanges(undefined, null, 3.2, 4.2, 4.9, 5.8, 6.5),
            unit: '10E12/L',
          },
          'Hemoglobin - Female': {
            ranges: mkRanges(undefined, 50, 117, 135, 145, 155, 175),
            unit: 'g/L',
          },
          'Hemoglobin - Male': {
            ranges: mkRanges(undefined, 100, 132, 140, 150, 171, 180),
            unit: 'g/L',
          },
          'Hematocrit - Female': {
            ranges: mkRanges(undefined, 0.2, 0.35, 0.37, 0.44, 0.45, 0.6),
            unit: 'Prop. of 1.0',
          },
          'Hematocrit - Male': {
            ranges: mkRanges(undefined, 0.32, 0.38, 0.4, 0.48, 0.5, 0.52),
            unit: 'Prop. of 1.0',
          },
          MCV: {
            ranges: mkRanges(undefined, 60, 80, 82, 89.9, 100, 120),
            unit: 'fL',
          },
          MCH: {
            ranges: mkRanges(undefined, 22, 27, 28, 31.9, 33, 38),
            unit: 'pg',
          },
          MCHC: {
            ranges: mkRanges(undefined, 300, 320, 340, 360, 380),
            unit: 'g/L',
          },
          Platelets: {
            ranges: mkRanges(undefined, 60, 140, 264, 385, 400, 450),
            unit: 'x10E9/L',
          },
          RDW: {
            ranges: mkRanges(undefined, null, 8, 11, 12.6, 15, 18),
            unit: '%',
          },
        },
      },
      'White Blood Cells': {
        items: {
          'Total WBCs': {
            ranges: mkRanges(undefined, 1, 3.8, 5.5, 7.5, 10.8, 15),
            unit: 'giga/L',
          },
          'Neutrophils - %': {
            calculate: ({
              'White Blood Cells': {
                'Total WBCs': wbc = NaN,
                'Neutrophils - Absolute': neutrophils = NaN,
              } = {},
            }) =>
              !isNaN(wbc) && !isNaN(neutrophils)
                ? (100 * neutrophils) / wbc
                : null,
            ranges: mkRanges(undefined, 23, 38, 40, 60, 74, 90),
            unit: '%',
          },
          'Lymphocytes - %': {
            calculate: ({
              'White Blood Cells': {
                'Total WBCs': wbc = NaN,
                'Lymphocytes - Absolute': lymphocytes = NaN,
              } = {},
            }) =>
              !isNaN(wbc) && !isNaN(lymphocytes)
                ? (100 * lymphocytes) / wbc
                : null,
            ranges: mkRanges(undefined, 6, 14, 24, 44, 46, 55),
            unit: '%',
          },
          'Monocytes - %': {
            calculate: ({
              'White Blood Cells': {
                'Total WBCs': wbc = NaN,
                'Monocytes - Absolute': monocytes = NaN,
              } = {},
            }) =>
              !isNaN(wbc) && !isNaN(monocytes) ? (100 * monocytes) / wbc : null,
            ranges: mkRanges(undefined, null, null, 0, 7, 13, 20),
            unit: '%',
          },
          'Eosinophils - %': {
            calculate: ({
              'White Blood Cells': {
                'Total WBCs': wbc = NaN,
                'Eosinophils - Absolute': eosinophils = NaN,
              } = {},
            }) =>
              !isNaN(wbc) && !isNaN(eosinophils)
                ? (100 * eosinophils) / wbc
                : null,
            ranges: mkRanges(undefined, null, null, 0, 3, 25),
            unit: '%',
          },
          'Basophils - %': {
            calculate: ({
              'White Blood Cells': {
                'Total WBCs': wbc = NaN,
                'Basophils - Absolute': basophils = NaN,
              } = {},
            }) =>
              !isNaN(wbc) && !isNaN(basophils) ? (100 * basophils) / wbc : null,
            ranges: mkRanges(undefined, null, null, 0, 1, 3),
            unit: '%',
          },
          'Neutrophils - Absolute': {
            ranges: mkRanges(undefined, 0.3, 1.5, 1.9, 4.2, 7.8, 10),
            unit: 'giga/L',
          },
          'Lymphocytes - Absolute': {
            ranges: mkRanges(undefined, 0.5, 0.85, 0.95, 3.1, 3.9, 5),
            unit: 'giga/L',
          },
          'Monocytes - Absolute': {
            ranges: mkRanges(undefined, 0.5, 0.85, 0.95, 3.1, 3.9, 5),
            unit: 'giga/L',
          },
          'Eosinophils - Absolute': {
            ranges: mkRanges(undefined, 0, 0.2, 0.28, 0.58, 0.95, 2),
            unit: 'giga/L',
          },
          'Basophils - Absolute': {
            ranges: mkRanges(undefined, null, null, 0, 0.1, 0.2, 0.5),
            unit: 'giga/L',
          },
          'Neutrophil : Lymphocyte': {
            calculate: ({
              'White Blood Cells': {
                'Neutrophils - Absolute': neutrophils = NaN,
                'Lymphocytes - Absolute': lymphocytes = NaN,
              } = {},
            }) =>
              !isNaN(lymphocytes) && !isNaN(neutrophils)
                ? neutrophils / lymphocytes
                : null,
            ranges: mkRanges(undefined, 0.3, 1, 1.8, 2.2, 3, 5),
            unit: 'Ratio',
          },
        },
      },
      Inflammation: {
        items: {
          'C-Reactive Protein': {
            ranges: mkRanges(undefined, null, null, 0, 42.86, 75.24, 100),
            unit: 'nmol/L',
          },
          'Hs CRP - Male': {
            ranges: mkRanges(undefined, null, null, 0, 5.24, 27.62, 57.14),
            unit: 'nmol/L',
          },
          'ESR - Female': {
            ranges: mkRanges(undefined, null, null, 0, 10, 20, 50),
            unit: 'mm/hr',
          },
        },
      },
    }),
    /* eslint-enable sort-keys-fix/sort-keys-fix */
    [],
  );

  const [dataValues, setDataValues] =
    React.useState<Record<string, Record<string, number>>>();

  React.useEffect(() => {
    if (dataValues === undefined) {
      setShowSettings(true);
    }
  }, [dataValues]);

  function handleChange(
    sectionKey: string,
    itemKey: string,
    ev: React.FocusEvent<HTMLInputElement>,
  ) {
    const value = parseFloat(ev.target.value);
    if (isNaN(value)) {
      setDataValues(
        ({
          [sectionKey]: { [itemKey]: _, ...values } = {},
          ...sections
        } = {}) => ({
          ...sections,
          [sectionKey]: values,
        }),
      );
    } else {
      setDataValues(
        ({
          [sectionKey]: { [itemKey]: _, ...values } = {},
          ...sections
        } = {}) => ({
          ...sections,
          [sectionKey]: {
            ...values,
            [itemKey]: value,
          },
        }),
      );
    }
  }

  return (
    <>
      <StalkingButtonGroup>
        <StalkingButton path={mdiCog} onClick={() => setShowSettings(true)} />
      </StalkingButtonGroup>
      <Fullscreen>
        <div style={{ width: '100%' }}>
          {Object.entries(dataItems).map(
            ([sectionKey, section], sectionIndex) =>
              dataValues !== undefined &&
              dataValues[sectionKey] !== undefined &&
              Object.keys(dataValues[sectionKey]).length > 0 ? (
                <SectionContainer key={sectionKey} style={{ width: '100%' }}>
                  <SectionHeader>{sectionKey}</SectionHeader>
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
                        item.calculate ??
                        ((values) => values[sectionKey]?.[itemKey] ?? null);
                      const value = valueFn(dataValues);
                      if (value === null) {
                        return null;
                      }

                      const valueInfo = (value: number) => {
                        const [minKey, minValue] = sections[0];
                        const [maxKey, maxValue] = sections.slice(-1)[0];
                        if (value <= minValue) {
                          return { color: ranges[minKey].color, percent: '0%' };
                        } else if (value >= maxValue) {
                          return {
                            color: ranges[maxKey].color,
                            percent: '100%',
                          };
                        } else {
                          const sectionIndex =
                            sections.findIndex(([, v]) => value < v) - 1;
                          const [loKey, loValue] = sections[sectionIndex];
                          const [, hiValue] = sections[sectionIndex + 1];
                          const basePct =
                            (sectionIndex / (sections.length - 1)) * 100;
                          const sectionPct =
                            ((value - loValue) / (hiValue - loValue)) *
                            (1 / (sections.length - 1)) *
                            100;
                          const percent = `${basePct + sectionPct}%`;
                          const color = ranges[loKey].color;
                          return { color, percent };
                        }
                      };

                      const info = valueInfo(value);

                      return (
                        <DataItemContainer key={itemKey}>
                          <DataItemHeader>
                            <DataItemHeaderTitle>{itemKey}</DataItemHeaderTitle>
                            <DataItemHeaderValueContainer>
                              <DataItemHeaderValueNumber>
                                {value.toFixed(2)}
                              </DataItemHeaderValueNumber>
                              <DataItemHeaderValueUnit>
                                {item.unit}
                              </DataItemHeaderValueUnit>
                            </DataItemHeaderValueContainer>
                          </DataItemHeader>
                          <DataItemRangeContainer key={itemKey}>
                            <div
                              style={{
                                backgroundColor: 'white',
                                border: `solid 4px ${info.color}`,
                                borderRadius: '26px',
                                height: '26px',
                                left: `calc(${info.percent} - 18px)`,
                                position: 'absolute',
                                top: '-7px',
                                width: '26px',
                              }}
                            />
                            <svg width="100%" height="20px">
                              <linearGradient
                                id={`range-${sectionIndex}-${itemIndex}`}
                              >
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
                                      offset={valueInfo(midValue).percent}
                                      stopColor={ranges[k].color}
                                    />
                                  );
                                })}
                              </linearGradient>
                              <rect
                                width="100%"
                                height="100%"
                                rx="10"
                                fill={`url('#range-${sectionIndex}-${itemIndex}')`}
                              />
                              {sections.slice(1).map(([k, v]) => (
                                <rect
                                  key={k}
                                  height="25px"
                                  width="1px"
                                  x={valueInfo(v).percent}
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
                                  key={k}
                                  style={{
                                    borderLeft:
                                      i > 0 ? 'solid 1px #888' : undefined,
                                    flex: '1',
                                    marginTop: '0.25rem',
                                    textAlign: 'center',
                                    width: '1px',
                                  }}
                                >
                                  <div style={{ marginBottom: '0.24rem' }}>
                                    {ranges[k].label}
                                  </div>
                                  <div>
                                    {i === 0
                                      ? `< ${sections[i + 1][1]}`
                                      : i === sections.length - 2
                                      ? `> ${v}`
                                      : `${v} - ${sections[i + 1][1]}`}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DataItemRangeContainer>
                        </DataItemContainer>
                      );
                    },
                  )}
                </SectionContainer>
              ) : null,
          )}
        </div>
      </Fullscreen>
      <SettingsPanel
        active={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
        {Object.entries(dataItems).map(([sectionKey, section]) => (
          <SettingsSection key={sectionKey}>
            <SettingsSectionTitle>{sectionKey}</SettingsSectionTitle>
            {Object.entries(section.items)
              .filter(([, item]) => item.calculate === undefined)
              .map(([itemKey, item]) => (
                <SettingsSectionInputContainer key={itemKey}>
                  <SettingsSectionInputLabel>
                    {itemKey}:
                  </SettingsSectionInputLabel>
                  <SettingsSectionInputTextField>
                    <InputText
                      defaultValue={dataValues?.[itemKey]?.toString() ?? ''}
                      placeholder={item.ranges.O?.toString()}
                      onBlur={(ev) => handleChange(sectionKey, itemKey, ev)}
                    />
                  </SettingsSectionInputTextField>
                  <SettingsSectionInputUnit>
                    {item.unit}
                  </SettingsSectionInputUnit>
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
