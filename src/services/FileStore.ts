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
  unsupported: globalThis.File[];
};

export const FileStoreContext = React.createContext<FileStore>(
  (undefined as unknown) as FileStore,
);

export class FileStore {
  private readonly files$$ = new BehaviorSubject<File[]>([]);
  public readonly files$ = this.files$$.asObservable();

  public filesByType$(type: FileType): Observable<File[]> {
    return this.files$.pipe(map((fs) => fs.filter((f) => f.type === type)));
  }

  public async preProcessFiles(fileList: FileList): Promise<ProcessedFiles> {
    const files: File[] = [];
    const unsupported: globalThis.File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const fileListItem = fileList.item(i);
      if (fileListItem !== null) {
        const contentType = fileListItem.type;
        const type = contentType.startsWith('image/')
          ? 'image'
          : contentType === 'text/csv'
          ? 'csv'
          : undefined;
        if (type !== undefined) {
          const buffer = await fileListItem.arrayBuffer();
          const data = base64EncodeBuffer(buffer);
          const name = fileListItem.name;
          const size = buffer.byteLength;
          files.push({
            contentType,
            data,
            name,
            size,
            type,
          });
        } else {
          unsupported.push(fileListItem);
        }
      }
    }
    return { files, unsupported };
  }

  public async acceptFiles(files: File[]): Promise<void> {
    this.files$$.next(
      _.chain(this.files$$.value).concat(files).uniqBy('data').value(),
    );
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
