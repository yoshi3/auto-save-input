export interface MyWindow extends Window {
  AutoSaveInput: unknown;
}

export interface IStorageData {
  [key: string]: IStorageRecode;
}

export interface IStorageRecode {
  value: string;
  expire: number;
}
