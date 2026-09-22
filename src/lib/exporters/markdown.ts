import { JsonRow } from "@/lib/adapters/column";

export interface ExporterInterface {
  export(data: JsonRow[], tableName?: string): string;
}

export { type JsonRow };

export class MarkdownExporter implements ExporterInterface {
  export(data: JsonRow[]): string {
    if (data.length === 0) {
      return "";
    }

    const keys = Object.keys(data[0]);
    
    // Header row
    const header = `| ${keys.map((k) => k).join(" | ")} |`;
    
    // Separator row
    const separator = `| ${keys.map(() => "---").join(" | ")} |`;
    
    // Data rows
    const rows = data
      .map((row) => {
        const values = keys.map((key) => {
          const value = row[key];
          return value === null || value === undefined ? "" : String(value);
        });
        return `| ${values.join(" | ")} |`;
      })
      .join("\n");

    return `${header}\n${separator}\n${rows}`;
  }
}