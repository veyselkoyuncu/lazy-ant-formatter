import { NextRequest, NextResponse } from "next/server";
import { CsvAdapter } from "@/lib/adapters/csv";
import { TsvAdapter } from "@/lib/adapters/tsv";
import { XmlAdapter } from "@/lib/adapters/xml";
import { ExcelAdapter } from "@/lib/adapters/excel";
import { ColumnMapping, JsonRow } from "@/lib/adapters/column";

const csvAdapter = new CsvAdapter();
const tsvAdapter = new TsvAdapter();
const xmlAdapter = new XmlAdapter();
const excelAdapter = new ExcelAdapter();

function detectFormat(fileName: string): string {
  const name = fileName.toLowerCase();
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) return "excel";
  if (name.endsWith(".csv")) return "csv";
  if (name.endsWith(".tsv")) return "tsv";
  if (name.endsWith(".xml")) return "xml";
  if (name.endsWith(".json")) return "json";
  return "unknown";
}

function getAdapter(format: string) {
  if (format === "excel") return excelAdapter;
  if (format === "tsv") return tsvAdapter;
  if (format === "xml") return xmlAdapter;
  return csvAdapter;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetFormat = (formData.get("targetFormat") as string) || "csv";
    const columnMappingsJson = formData.get("columnMappings") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "Empty file" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
    }

    const sourceFormat = detectFormat(file.name);

    if (sourceFormat === "unknown") {
      return NextResponse.json({ error: "Unsupported format. Use CSV, TSV, XLSX, XML, or JSON" }, { status: 400 });
    }

    let data: JsonRow[];
    let mappings: ColumnMapping[] | undefined;

    if (sourceFormat === "json") {
      const text = await file.text();
      try {
        data = JSON.parse(text);
      } catch {
        return NextResponse.json({ error: "Invalid JSON file" }, { status: 400 });
      }
    } else {
      const adapter = getAdapter(sourceFormat);
      try {
        data = await adapter.toJson(file);
      } catch {
        return NextResponse.json({ error: `Failed to parse ${sourceFormat} file` }, { status: 400 });
      }

      try {
        mappings = adapter.getColumnMappings(data);
      } catch {
        console.warn("Column mapping inference failed");
      }
    }

    if (columnMappingsJson && mappings) {
      try {
        const userMappings = JSON.parse(columnMappingsJson) as ColumnMapping[];
        const adapter = getAdapter(sourceFormat);
        data = adapter.applyMappingOverrides(data, userMappings);
      } catch {
        return NextResponse.json({ error: `Failed to apply column mappings` }, { status: 400 });
      }
    }

    if (targetFormat === "json") {
      return NextResponse.json({ data, mappings, sourceFormat });
    }

    let result: string | Blob = "";

    if (targetFormat === "csv") {
      result = await csvAdapter.toCsv(data);
    } else if (targetFormat === "tsv") {
      result = await tsvAdapter.toTsv(data);
    } else if (targetFormat === "xml") {
      result = await xmlAdapter.toXml(data);
    } else if (targetFormat === "excel") {
      result = await excelAdapter.toExcel(data);
    } else {
      return NextResponse.json({ error: `Unsupported target format: ${targetFormat}` }, { status: 400 });
    }

    const headers = new Headers();
    const extension = targetFormat;
    const mimeType =
      targetFormat === "csv" || targetFormat === "tsv"
        ? "text/plain"
        : targetFormat === "xml"
          ? "application/xml"
          : "application/octet-stream";
    headers.set("Content-Type", mimeType);
    headers.set("Content-Disposition", `attachment; filename="converted.${extension}"`);

    return new NextResponse(result, { status: 200, headers });
  } catch (err) {
    console.error("Convert error:", err);
    return NextResponse.json({ error: "Internal server error during conversion" }, { status: 500 });
  }
}