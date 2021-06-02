import _ from 'lodash';
import React from 'react';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type FileType = 'image' | 'csv';

export type File = {
  contentType: string;
  data: string;
  name: string;
  size: number;
  type: FileType;
};

export type ProcessedFiles = {
  files: File[];
  unsupported: string[];
};

export const FileStoreContext = React.createContext<FileStore>(
  undefined as unknown as FileStore,
);

export class FileStore {
  private readonly files$$ = new BehaviorSubject<File[]>([]);
  public readonly files$ = this.files$$.asObservable();

  public filesByType$(type: FileType): Observable<File[]> {
    return this.files$.pipe(map((fs) => fs.filter((f) => f.type === type)));
  }

  public async preProcessFiles(fileList: FileList): Promise<ProcessedFiles> {
    const files: File[] = [];
    const unsupported: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const fileListItem = fileList.item(i);
      if (fileListItem !== null) {
        const file = await this.preProcessFileData(
          fileListItem.name,
          fileListItem.type,
          () => fileListItem.arrayBuffer(),
        );

        if (file !== undefined) {
          files.push(file);
        } else {
          unsupported.push(fileListItem.name);
        }
      }
    }
    return { files, unsupported };
  }

  public async preProcessUrl(url: string): Promise<ProcessedFiles> {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    const name = url.split('?')[0].split('/').slice(-1)[0];
    const file = await this.preProcessFileData(
      name,
      contentType === null ? 'application/octet-stream' : contentType,
      () => response.arrayBuffer(),
    );
    if (file !== undefined) {
      return { files: [file], unsupported: [] };
    } else {
      return { files: [], unsupported: [url] };
    }
  }

  public async acceptFiles(files: File[]): Promise<void> {
    this.files$$.next(
      _.chain(this.files$$.value).concat(files).uniqBy('data').value(),
    );
  }

  private async preProcessFileData(
    name: string,
    contentType: string,
    readData: () => Promise<ArrayBuffer>,
  ): Promise<File | undefined> {
    const type = resolveFileType(name, contentType);
    if (type !== undefined) {
      const buffer = await readData();
      const data = base64EncodeBuffer(buffer);
      const size = buffer.byteLength;
      return { contentType, data, name, size, type };
    } else {
      return undefined;
    }
  }
}

function base64EncodeBuffer(buf: ArrayBuffer): string {
  return btoa(
    new Uint8Array(buf).reduce(
      (str, byte) => str + String.fromCharCode(byte),
      '',
    ),
  );
}

function resolveFileType(
  name: string,
  contentType: string,
): FileType | undefined {
  if (contentType.startsWith('text/csv')) {
    return 'csv';
  } else if (contentType.startsWith('image/')) {
    return 'image';
  } else if (contentType.startsWith('text/') && name.endsWith('csv')) {
    return 'csv';
  } else {
    return undefined;
  }
}
