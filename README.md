# Lazy Ant Formatter

Lazy Ant Formatter is a file conversion tool that converts CSV and Excel (.xlsx) files to JSON, and JSON to CSV/Excel, with smart column mapping.

**Live Demo:** https://lazy-ant-formatter.vercel.app/

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## API

### Convert a file

You can convert files using the `/api/convert` endpoint.

#### Convert CSV to JSON

```bash
curl -X POST http://localhost:3000/api/convert \
  -F "file=@example.csv" \
  -F "targetFormat=json"
```

#### Convert Excel to JSON

```bash
curl -X POST http://localhost:3000/api/convert \
  -F "file=@example.xlsx" \
  -F "targetFormat=json"
```

#### Convert JSON to CSV

```bash
curl -X POST http://localhost:3000/api/convert \
  -F "file=@example.json" \
  -F "targetFormat=csv"
```

#### Convert JSON to Excel

```bash
curl -X POST http://localhost:3000/api/convert \
  -F "file=@example.json" \
  -F "targetFormat=excel"
```

### Supported formats

- CSV (`.csv`)
- Excel (`.xlsx`, `.xls`)
- JSON (`.json`)

### Response

The API returns the converted data. For JSON targets, it returns the data along with the inferred column mappings.

```json
{
  "data": [
    {
      "name": "Alice",
      "age": 30
    }
  ],
  "mappings": [
    {
      "name": "name",
      "type": "text"
    },
    {
      "name": "age",
      "type": "number"
    }
  ]
}
```

### Column mapping override

You can override the inferred column mappings by passing `columnMappings` as a JSON string.

```bash
curl -X POST http://localhost:3000/api/convert \
  -F "file=@example.csv" \
  -F "targetFormat=json" \
  -F 'columnMappings=[{"name":"age","type":"text"}]'
```

### Error handling

The API returns appropriate error responses for:

- Missing file
- Empty file
- File too large (max 10MB)
- Unsupported format
- Invalid JSON file
- Failed to parse file
