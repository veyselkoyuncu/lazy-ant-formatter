export interface JsonRow {
  [key: string]: unknown;
}

export type ColumnType = "email" | "phone" | "date" | "number" | "text";

export interface ColumnMapping {
  name: string;
  type: ColumnType;
  userOverride?: ColumnType;
}

const EMAIL_PATTERN = /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/;
const PHONE_PATTERN = /^[\d\s()+\-.]{7,}$/;
const DATE_PATTERN = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/;

function inferTypeFromName(name: string): ColumnType {
  const normalized = name.toLowerCase();

  if (normalized.includes("email") || normalized.includes("mail")) {
    return "email";
  }

  if (
    normalized.includes("phone") ||
    normalized.includes("tel") ||
    normalized.includes("mobile") ||
    normalized.includes("telefon")
  ) {
    return "phone";
  }

  if (
    normalized.includes("date") ||
    normalized.includes("time") ||
    normalized.includes("tarih") ||
    normalized.includes("birth")
  ) {
    return "date";
  }

  if (
    normalized.includes("price") ||
    normalized.includes("amount") ||
    normalized.includes("cost") ||
    normalized.includes("quantity") ||
    normalized.includes("count") ||
    normalized.includes("sayi") ||
    normalized.includes("adet")
  ) {
    return "number";
  }

  return "text";
}

function inferTypeFromValues(values: unknown[]): ColumnType {
  const nonEmptyValues = values.filter((value) => value !== null && value !== undefined && value !== "");

  if (nonEmptyValues.length === 0) {
    return "text";
  }

  const emailCount = nonEmptyValues.filter((value) => typeof value === "string" && EMAIL_PATTERN.test(value)).length;
  const phoneCount = nonEmptyValues.filter((value) => typeof value === "string" && PHONE_PATTERN.test(value)).length;
  const dateCount = nonEmptyValues.filter((value) => typeof value === "string" && DATE_PATTERN.test(value)).length;
  const numberCount = nonEmptyValues.filter((value) => typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)))).length;

  const total = nonEmptyValues.length;

  if (emailCount / total > 0.8) return "email";
  if (phoneCount / total > 0.8) return "phone";
  if (dateCount / total > 0.8) return "date";
  if (numberCount / total > 0.8) return "number";

  return "text";
}

export function inferColumnType(name: string, values: unknown[] = []): ColumnType {
  const nameType = inferTypeFromName(name);
  const valueType = inferTypeFromValues(values);

  if (valueType !== "text") return valueType;

  return nameType;
}

export function inferColumnMappings(data: JsonRow[]): ColumnMapping[] {
  if (data.length === 0) {
    return [];
  }

  const keys = Object.keys(data[0]);

  return keys.map((key) => {
    const values = data.map((row) => row[key]);
    const type = inferColumnType(key, values);
    return { name: key, type };
  });
}

export function getEffectiveType(mapping: ColumnMapping): ColumnType {
  return mapping.userOverride || mapping.type;
}

export function applyColumnMappings(data: JsonRow[], mappings: ColumnMapping[]): JsonRow[] {
  return data.map((row) => {
    const mappedRow: JsonRow = {};

    mappings.forEach((mapping) => {
      const value = row[mapping.name];
      const effectiveType = getEffectiveType(mapping);

      if (effectiveType === "number") {
        const numberValue = Number(value);
        mappedRow[mapping.name] = numberValue;
      } else if (effectiveType === "text") {
        mappedRow[mapping.name] = value === null || value === undefined ? "" : String(value);
      } else {
        mappedRow[mapping.name] = value;
      }
    });

    return mappedRow;
  });
}
