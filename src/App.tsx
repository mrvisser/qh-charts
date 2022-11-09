import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import { BloodBiomarkers } from './components/BloodBiomarkers';
import { FileDropZone } from './components/FileDropZone';
import { ReportSelector } from './components/ReportSelector';
import { useObservable } from './hooks/useObservable';
import { FileStore, FileStoreContext } from './services/FileStore';
import { MetricsStore, MetricsStoreContext } from './services/MetricsStore';

const GlobalStyle = createGlobalStyle`
  /* Global reset to remove all browser styling. */
  ${reset}

  @page {
    margin: 0;
    size: landscape;
  }

  html,
  body,
  #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Poppins', 'Roboto', 'Helvetica Neue', sans-serif;
  }

  @media print {
    .highcharts-data-table {
      display: none !important;
    }

    .no-print {
      display: none !important;
    }
  }
`;

const Fullscreen = styled.div`
  align-items: stretch;
  display: flex;
  justify-content: center;
  min-height: 100%;
`;

const Option = styled.div`
  display: flex;
  flex: 0 0 50%;

  &:first-child {
    border-right: solid 1px #eee;
  }

  &:hover {
    background-color: #eee;
  }
`;

const OptionInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`;

export type AppProps = {
  dataUrl: string | undefined;
};

const App: React.FC<AppProps> = ({ dataUrl }) => {
  const [fileStore] = React.useState(() => new FileStore());
  const [metricsStore] = React.useState(() => new MetricsStore(fileStore));
  const [csvFiles] = useObservable(
    () => fileStore.filesByType$('csv'),
    [fileStore],
    [],
  );
  const [view, setView] = React.useState<'report' | 'bloodBiomarkers'>();

  React.useEffect(() => {
    if (csvFiles.length > 0 && view === undefined) {
      setView('report');
    }
  }, [csvFiles, view]);

  React.useEffect(() => {
    if (dataUrl !== undefined) {
      void (async () => {
        const { files } = await fileStore.preProcessUrl(dataUrl);
        await fileStore.acceptFiles(files);
      })();
    }
  }, [dataUrl, fileStore]);

  return (
    <FileStoreContext.Provider value={fileStore}>
      <MetricsStoreContext.Provider value={metricsStore}>
        <GlobalStyle />
        <Fullscreen>
          {view === undefined ? (
            <>
              <Option>
                <FileDropZone>
                  {csvFiles.length > 0 ? (
                    <ReportSelector />
                  ) : dataUrl === undefined ? (
                    <span>
                      Drag and drop a Blood Glucose CSV file to view charts.
                    </span>
                  ) : (
                    <span>Downloading data...</span>
                  )}
                </FileDropZone>
              </Option>
              <Option>
                <OptionInner
                  onClick={() => setView('bloodBiomarkers')}
                  style={{ cursor: 'pointer' }}
                >
                  <span>Blood Biomarkers</span>
                </OptionInner>
              </Option>
            </>
          ) : view === 'report' ? (
            <ReportSelector />
          ) : (
            <BloodBiomarkers />
          )}
        </Fullscreen>
      </MetricsStoreContext.Provider>
    </FileStoreContext.Provider>
  );
};

export default App;
