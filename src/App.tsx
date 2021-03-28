import * as Highcharts from 'highcharts';
import moment from 'moment-timezone';
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

  html,
  body,
  #root {
    height: 100%;
    width: 100%;
  }
`;

Highcharts.setOptions({
  time: {
    timezoneOffset: moment.tz('America/Toronto').toDate().getTimezoneOffset(),
  },
});

const Centered = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  height: 100%;
  position: absolute;
  width: 100%;
`;

const App: React.FC = () => {
  const [fileStore] = React.useState(() => new FileStore());
  const [metricsStore] = React.useState(() => new MetricsStore(fileStore));
  const [csvFiles] = useObservable(
    () => fileStore.filesByType$('csv'),
    [fileStore],
    [],
  );

  return (
    <>
      <GlobalStyle />
      <FileStoreContext.Provider value={fileStore}>
        <MetricsStoreContext.Provider value={metricsStore}>
          <FileDropZone>
            {csvFiles.length > 0 ? (
              <Charts />
            ) : (
              <Centered>
                <span>
                  Drag and drop a CSV file to graph it. Add as many as you like.
                </span>
              </Centered>
            )}
          </FileDropZone>
        </MetricsStoreContext.Provider>
      </FileStoreContext.Provider>
    </>
  );
};

export default App;
