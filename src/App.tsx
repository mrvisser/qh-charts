import * as Highcharts from 'highcharts';
import moment from 'moment-timezone';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import { Charts } from './components/Charts';
import { FileDropZone } from './components/FileDropZone';
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

const App: React.FC = () => {
  const [fileStore] = React.useState(() => new FileStore());
  const [metricsStore] = React.useState(() => new MetricsStore(fileStore));

  return (
    <>
      <GlobalStyle />
      <FileStoreContext.Provider value={fileStore}>
        <MetricsStoreContext.Provider value={metricsStore}>
          <FileDropZone>
            <Charts />
          </FileDropZone>
        </MetricsStoreContext.Provider>
      </FileStoreContext.Provider>
    </>
  );
};

export default App;
