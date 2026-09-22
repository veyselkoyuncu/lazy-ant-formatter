import * as yaml from "js-yaml";
import { inferColumnMappings, applyColumnMappings, ColumnType, ColumnMapping, JsonRow } from "./column";

export interface AdapterInterface {
  toJson(file: File): Promise<JsonRow[]>;
  toYaml(data: JsonRow[]): Promise<string>;
  getColumnMappings(data: JsonRow[]): ColumnMapping[];
  applyMappingOverrides(data: JsonRow[], mappings: ColumnMapping[]): JsonRow[];
}

export { type ColumnMapping, type ColumnType };

export class YamlAdapter implements AdapterInterface {
  async toJson(file: File): Promise<JsonRow[]> {
    const text = await file.text();
    const result = yaml.load(text);
    if (!Array.isArray(result)) {
      return [];
    }
    return result as JsonRow[];
  }

  async toYaml(data: JsonRow[]): Promise<string> {
    return yaml.dump(data, { lineWidth: -1 });
  }

  getColumnMappings(data: JsonRow[]): ColumnMapping[] {
    return inferColumnMappings(data);
  }

  applyMappingOverrides(data: JsonRow[], mappings: ColumnMapping[]): JsonRow[] {
    return applyColumnMappings(data, mappings);
  }
}