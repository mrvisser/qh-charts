import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { useObservable } from '../hooks/useObservable';
import { FileStoreContext } from '../services/FileStore';

const Container = styled.div`
  min-height: 100%;
  min-width: 100%;
  position: relative;
`;

export const FileDropZone: React.FC<PropsWithChildren> = ({ children }) => {
  const fileService = React.useContext(FileStoreContext);
  const [files] = useObservable(() => fileService.files$, [fileService], []);
  const [fileUploadEl, setFileUploadEl] = React.useState<HTMLInputElement>();
  const handleSelectFiles = React.useCallback(
    async (files: FileList) => {
      const preProcessed = await fileService.preProcessFiles(files);
      await fileService.acceptFiles(preProcessed.files);
    },
    [fileService],
  );

  return (
    <Container
      onClick={() =>
        files.length === 0 && fileUploadEl !== undefined
          ? fileUploadEl.click()
          : undefined
      }
      onDragOver={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      }}
      onDrop={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        void handleSelectFiles(ev.dataTransfer.files);
      }}
      style={{
        cursor: files.length === 0 ? 'pointer' : undefined,
      }}
    >
      <input
        multiple
        onChange={(ev) => {
          const files = ev.target.files;
          if (files !== null && files.length > 0) {
            void handleSelectFiles(files);
          }
        }}
        ref={(el) => (el !== null ? setFileUploadEl(el) : undefined)}
        style={{ display: 'none' }}
        type="file"
      />
      {children}
    </Container>
  );
};
