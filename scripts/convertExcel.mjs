import pkg from 'xlsx';
const { readFile, utils } = pkg;
import { writeFileSync } from 'fs';

const workbook = readFile(
  './src/data/Bargaining_Tracker_Candidate_Dataset.xlsx',
);
const sheet = workbook.Sheets['Agreements'];

// Get raw rows with formatted strings
const rows = utils.sheet_to_json(sheet, {
  raw: false, // format everything as strings
  dateNF: 'yyyy-mm-dd', // force date format
});

const agreements = rows.map((row, index) => ({
  id: String(index + 1),
  employerName: row['Employer Name'] ?? '',
  industry: row['Industry'] ?? '',
  region: row['Region'] ?? '',
  ceaExpiryDate: row['CEA Expiry Date'] ?? '',
  status: row['Status'] ?? '',
  leadOrganiser: row['Lead Organiser'] ?? '',
  leadEmail: row['Lead Email'] ?? '',
  estimatedMembers: Number(row['Estimated Member Coverage']) || 0,
  notes: row['Notes'] ?? '',
  dateLastUpdated: row['Date Last Updated'] ?? '',
}));

const output = `import type { Agreement } from "../types";

export const seedAgreements: Agreement[] = ${JSON.stringify(agreements, null, 2)};
`;

writeFileSync('./src/data/agreements.ts', output);
