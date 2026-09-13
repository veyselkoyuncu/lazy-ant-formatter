import * as XLSX from "xlsx";
import { inferColumnMappings, applyColumnMappings, ColumnType, ColumnMapping, JsonRow } from "./column";

export interface ExcelAdapterInterface {
  toJson(file: File): Promise<JsonRow[]>;
  toExcel(data: JsonRow[]): Promise<Blob>;
  getColumnMappings(data: JsonRow[]): ColumnMapping[];
  applyMappingOverrides(data: JsonRow[], mappings: ColumnMapping[]): JsonRow[];
}

export { type ColumnMapping, type ColumnType };

export class ExcelAdapter implements ExcelAdapterInterface {
  async toJson(file: File): Promise<JsonRow[]> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json: JsonRow[] = XLSX.utils.sheet_to_json(worksheet);
    return json;
  }

  async toExcel(data: JsonRow[]): Promise<Blob> {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "data");
    const xlsxBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    return new Blob([xlsxBuffer], { type: "application/octet-stream" });
  }

  getColumnMappings(data: JsonRow[]): ColumnMapping[] {
    return inferColumnMappings(data);
  }

  applyMappingOverrides(data: JsonRow[], mappings: ColumnMapping[]): JsonRow[] {
    return applyColumnMappings(data, mappings);
  }
}