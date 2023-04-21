export interface IConfigService {
  get(key: string): string;
  getArray(key: string): string[];
}
