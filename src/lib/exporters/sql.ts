import { JsonRow } from "@/lib/adapters/column";

export interface ExporterInterface {
  export(data: JsonRow[], tableName?: string): string;
}

export { type JsonRow };

export class SqlExporter implements ExporterInterface {
  export(data: JsonRow[], tableName = "data"): string {
    if (data.length === 0) {
      return "";
    }

    const keys = Object.keys(data[0]);
    const escapedKeys = keys.map((k) => `"${k.replace(/"/g, '""')}"`).join(", ");
    const values = data
      .map((row) => {
        const valueList = keys.map((key) => {
          const value = row[key];
          if (value === null || value === undefined) {
            return "NULL";
          }
          if (typeof value === "number") {
            return String(value);
          }
          const str = String(value).replace(/'/g, "''");
          return `'${str}'`;
        });
        return `(${valueList.join(", ")})`;
      })
      .join(",\n  ");

    return `INSERT INTO "${tableName}" (${escapedKeys})\n  VALUES\n  ${values};`;
  }
}