import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { inferColumnMappings, applyColumnMappings, ColumnType, ColumnMapping, JsonRow } from "./column";

export interface AdapterInterface {
  toJson(file: File): Promise<JsonRow[]>;
  toXml(data: JsonRow[], rootName?: string): Promise<string>;
  getColumnMappings(data: JsonRow[]): ColumnMapping[];
  applyMappingOverrides(data: JsonRow[], mappings: ColumnMapping[]): JsonRow[];
}

export { type ColumnMapping, type ColumnType };

export class XmlAdapter implements AdapterInterface {
  private parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: true,
  });

  private builder = new XMLBuilder({
    attributeNamePrefix: "@_",
    suppressEmptyNode: true,
  });

  async toJson(file: File): Promise<JsonRow[]> {
    const text = await file.text();
    const result = await this.parser.parse(text);
    return this.convertXmlToJson(result);
  }

  private convertXmlToJson(xmlData: unknown): JsonRow[] {
    const rows: JsonRow[] = [];

    const extractObject = (obj: unknown): JsonRow => {
      if (obj === null || typeof obj !== "object") {
        return {} as JsonRow;
      }

      const row: JsonRow = {};
      const objAsRecord = obj as Record<string, unknown>;

      for (const key in objAsRecord) {
        const value = objAsRecord[key];
        if (Array.isArray(value)) {
          if (value.length === 1) {
            row[key] = extractObject(value[0]);
          } else {
            row[key] = value.map((item) => extractObject(item));
          }
        } else if (value !== null && typeof value === "object") {
          if (Object.keys(value as Record<string, unknown>).length === 0) {
            row[key] = "";
          } else {
            row[key] = extractObject(value);
          }
        } else {
          row[key] = value;
        }
      }
      return row;
    };

    if (Array.isArray(xmlData)) {
      xmlData.forEach((item) => {
        if (item && typeof item === "object") {
          rows.push(extractObject(item));
        }
      });
    } else if (xmlData !== null && typeof xmlData === "object") {
      rows.push(extractObject(xmlData));
    }

    return rows.length > 0 ? rows : [];
  }

  async toXml(data: JsonRow[], rootName = "data"): Promise<string> {
    return this.builder.build({ [rootName]: data });
  }

  getColumnMappings(data: JsonRow[]): ColumnMapping[] {
    return inferColumnMappings(data);
  }

  applyMappingOverrides(data: JsonRow[], mappings: ColumnMapping[]): JsonRow[] {
    return applyColumnMappings(data, mappings);
  }
}