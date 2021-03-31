import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import { Charts } from './components/Charts';
import { FileDropZone } from './components/FileDropZone';
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

`;

const Fullscreen = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100%;
  position: absolute;
  min-width: 100%;
`;

const PrintWrapper = styled.div`
  width: 100%;
  @media print {
    max-width: 11in;
  }
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

  React.useEffect(() => {
    if (dataUrl !== undefined) {
      void (async () => {
        const { files } = await fileStore.preProcessUrl(dataUrl);
        await fileStore.acceptFiles(files);
      })();
    }
  }, [dataUrl, fileStore]);

  return (
    <>
      <GlobalStyle />
      <FileStoreContext.Provider value={fileStore}>
        <MetricsStoreContext.Provider value={metricsStore}>
          <FileDropZone>
            {csvFiles.length > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <PrintWrapper>
                  <Charts />
                </PrintWrapper>
              </div>
            ) : dataUrl === undefined ? (
              <Fullscreen>
                <span>
                  Drag and drop a Blood Glucose CSV file to view charts.
                </span>
              </Fullscreen>
            ) : (
              <Fullscreen>
                <span>Downloading data...</span>
              </Fullscreen>
            )}
          </FileDropZone>
        </MetricsStoreContext.Provider>
      </FileStoreContext.Provider>
    </>
  );
};

export default App;
