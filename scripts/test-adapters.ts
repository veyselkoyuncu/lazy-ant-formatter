import * as XLSX from "xlsx";
import * as Papa from "papaparse";
import * as Column from "@/lib/adapters/column";
import { TsvAdapter } from "@/lib/adapters/tsv";
import { XmlAdapter } from "@/lib/adapters/xml";

function csvToJson(csv: string): Column.JsonRow[] {
  const parsed = Papa.parse(csv, { header: true, dynamicTyping: true, skipEmptyLines: true });
  if (parsed.errors.length > 0) {
    console.warn("CSV parse errors:", parsed.errors);
  }
  return parsed.data as Column.JsonRow[];
}

function jsonToCsv(data: Column.JsonRow[], headers?: string[]): string {
  if (!data || data.length === 0) return "";
  const keys = headers || Object.keys(data[0]);
  const csv = Papa.unparse({
    fields: keys,
    data: data.map((row) => keys.map((key) => row[key] || "")),
  });
  return csv;
}

function excelToJson(filePath: string): Column.JsonRow[] {
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(worksheet);
}

function jsonToExcel(data: Column.JsonRow[], filePath: string): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "data");
  XLSX.writeFile(workbook, filePath);
}

function tsvToJson(tsv: string): Column.JsonRow[] {
  const parsed = Papa.parse(tsv, { header: true, dynamicTyping: true, skipEmptyLines: true });
  if (parsed.errors.length > 0) {
    console.warn("TSV parse errors:", parsed.errors);
  }
  return parsed.data as Column.JsonRow[];
}

function jsonToTsv(data: Column.JsonRow[]): string {
  if (data.length === 0) return "";
  const keys = Object.keys(data[0]);
  const tsv = Papa.unparse({
    fields: keys,
    data: data.map((row) => keys.map((key) => row[key] || "")),
  });
  return tsv.replace(/,/g, "\t");
}

const TEST_CSV = "name,age,city,email,phone\nAlice,30,New York,alice@example.com,123-456-7890\nBob,25,London,bob@test.co.uk,098-765-4321\n";
const TEST_DATA: Column.JsonRow[] = [
  { name: "Alice", age: 30, city: "New York", email: "alice@example.com", phone: "123-456-7890" },
  { name: "Bob", age: 25, city: "London", email: "bob@test.co.uk", phone: "098-765-4321" },
];

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

console.log("=== CSV Adapter Tests ===");
const jsonResult = csvToJson(TEST_CSV);
assert(Array.isArray(jsonResult), "CSV -> JSON returns array");
assert(jsonResult.length === 2, "CSV -> JSON has 2 rows");
assert(jsonResult[0].name === "Alice", "CSV -> JSON first row name is Alice");
assert(jsonResult[0].age === 30, "CSV -> JSON first row age is 30 (typed)");
assert(jsonResult[1].city === "London", "CSV -> JSON second row city is London");
const csvResult = jsonToCsv(TEST_DATA);
assert(typeof csvResult === "string", "JSON -> CSV returns string");
assert(csvResult.includes("Alice"), "CSV output contains Alice");
assert(csvResult.includes("Bob"), "CSV output contains Bob");
const roundtrip = csvToJson(csvResult);
assert(roundtrip.length === 2, "Roundtrip preserves row count");

console.log("\n=== Excel Adapter Tests ===");
jsonToExcel(TEST_DATA, "/tmp/test-output.xlsx");
const excelJson = excelToJson("/tmp/test-output.xlsx");
assert(Array.isArray(excelJson), "Excel -> JSON returns array");
assert(excelJson.length === 2, "Excel -> JSON has 2 rows");
assert(excelJson[0].name === "Alice", "Excel -> JSON first row name is Alice");

const excelRoundtrip = excelToJson("/tmp/test-output.xlsx");
assert(excelRoundtrip.length === 2, "Excel roundtrip preserves row count");

console.log("\n=== Column Type Inference Tests ===");
const columnMappings = Column.inferColumnMappings(TEST_DATA);
console.log("Column mappings:", JSON.stringify(columnMappings, null, 2));

const emailMapping = columnMappings.find((m) => m.name === "email");
const phoneMapping = columnMappings.find((m) => m.name === "phone");
const ageMapping = columnMappings.find((m) => m.name === "age");
const cityMapping = columnMappings.find((m) => m.name === "city");
const nameMapping = columnMappings.find((m) => m.name === "name");

assert(emailMapping !== undefined, "Email column mapping exists");
assert(emailMapping?.type === "email", "Email column should be inferred as email");
assert(phoneMapping !== undefined, "Phone column mapping exists");
assert(phoneMapping?.type === "phone", "Phone column should be inferred as phone");
assert(ageMapping !== undefined, "Age column mapping exists");
assert(ageMapping?.type === "number", "Age column should be inferred as number");
assert(cityMapping !== undefined, "City column mapping exists");
assert(cityMapping?.type === "text", "City column should be inferred as text");
assert(nameMapping !== undefined, "Name column mapping exists");
assert(nameMapping?.type === "text", "Name column should be inferred as text");

console.log("\n=== Column Override Tests ===");
const overrideMappings = columnMappings.map(mapping => {
  if (mapping.name === "age") {
    return { ...mapping, userOverride: "text" as Column.ColumnType };
  }
  return mapping;
});

const overriddenData = Column.applyColumnMappings(TEST_DATA, overrideMappings);
assert(Array.isArray(overriddenData), "Override function returns array");
assert(overriddenData.length === 2, "Override function preserves row count");
assert(typeof overriddenData[0].age === "string", "Age should be string after text override");
assert(overriddenData[0].age === "30", "Age value preserved as string after text override");
assert(typeof overriddenData[1].age === "string", "Age should be string after text override");
assert(overriddenData[1].age === "25", "Age value preserved as string after text override");

console.log("\n=== Edge Case Tests ===");
const emptyCsv = csvToJson("");
assert(emptyCsv.length === 0, "Empty CSV returns empty array");

const emptyCsvOut = jsonToCsv([]);
assert(emptyCsvOut === "", "Empty data returns empty string");

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
