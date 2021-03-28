/* eslint-disable no-console */
import React from 'react';
import styled from 'styled-components';

import { FileStoreContext } from '../services/FileStore';

const Container = styled.div`
  min-height: 100%;
  min-width: 100%;
  position: relative;
`;

export const FileDropZone: React.FC = ({ children }) => {
  const fileService = React.useContext(FileStoreContext);
  return (
    <Container
      onDragOver={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      }}
      onDrop={async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const preProcessed = await fileService.preProcessFiles(
          ev.dataTransfer.files,
        );
        await fileService.acceptFiles(preProcessed.files);
      }}
    >
      {children}
    </Container>
  );
};
