import * as Papa from "papaparse";
import { inferColumnMappings, applyColumnMappings, ColumnType, ColumnMapping, JsonRow } from "./column";

export interface AdapterInterface {
  toJson(file: File): Promise<JsonRow[]>;
  toTsv(data: JsonRow[], headers?: string[]): Promise<string>;
  getColumnMappings(data: JsonRow[]): ColumnMapping[];
  applyMappingOverrides(data: JsonRow[], mappings: ColumnMapping[]): JsonRow[];
}

export { type ColumnMapping, type ColumnType };

export class TsvAdapter implements AdapterInterface {
  async toJson(file: File): Promise<JsonRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(results.errors.map((e) => e.message).join(", ")));
          } else {
            resolve(results.data as JsonRow[]);
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  async toTsv(data: JsonRow[], headers?: string[]): Promise<string> {
    if (data.length === 0) {
      return "";
    }

    const keys = headers || Object.keys(data[0]);

    const csv = Papa.unparse({
      fields: keys,
      data: data.map((row) => keys.map((key) => row[key] || "")),
    });

    // Convert commas to tabs for TSV
    return csv.replace(/,/g, "\t");
  }

  getColumnMappings(data: JsonRow[]): ColumnMapping[] {
    return inferColumnMappings(data);
  }

  applyMappingOverrides(data: JsonRow[], mappings: ColumnMapping[]): JsonRow[] {
    return applyColumnMappings(data, mappings);
  }
}