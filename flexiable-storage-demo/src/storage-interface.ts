// storage-interface.ts
export interface StorageProvider {
  store(id: string, data: string): Promise<string>;
  retrieve(id: string): Promise<string>;
  update(id: string, data: string): Promise<void>;
  delete(id: string): Promise<void>;
  listAll(): Promise<string[]>;
}