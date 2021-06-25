import {
  mdiCalendarRangeOutline,
  mdiClipboardTextSearchOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';
import styled from 'styled-components';

import { CaseStudies } from './CaseStudies';
import { DailyCharts } from './DailyCharts';

type ReportType = 'daily' | 'caseStudies';

const Fullscreen = styled.div`
  align-items: stretch;
  display: flex;
  height: 100vh;
  justify-content: stretch;
  width: 100vw;
`;

const Option = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 18vh 18vw;

  &:hover {
    background-color: #eee;
  }
`;

const OptionTitle = styled.h1`
  font-size: 32px;
  font-weight: 500;
  text-align: center;
`;

export const ReportSelector: React.FC = () => {
  const [selectedReport, setSelectedReport] = React.useState<
    'none' | ReportType
  >('none');
  return (() => {
    switch (selectedReport) {
      case 'none':
        return (
          <Fullscreen>
            <Option onClick={() => setSelectedReport('daily')}>
              <Icon path={mdiCalendarRangeOutline} />
              <OptionTitle>Daily</OptionTitle>
            </Option>
            <Option onClick={() => setSelectedReport('caseStudies')}>
              <Icon path={mdiClipboardTextSearchOutline} />
              <OptionTitle>Case Studies</OptionTitle>
            </Option>
          </Fullscreen>
        );
      case 'daily':
        return (
          <DailyCharts
            timezone="America/Toronto"
            onBack={() => setSelectedReport('none')}
          />
        );
      case 'caseStudies':
        return (
          <CaseStudies
            timezone="America/Toronto"
            onBack={() => setSelectedReport('none')}
          />
        );
    }
  })();
};
