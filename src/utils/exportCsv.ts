import type { Agreement } from '../types';

export function exportToCsv(
  agreements: Agreement[],
  filename = 'bargaining-tracker.csv',
) {
  const headers = [
    'Employer Name',
    'Industry',
    'Region',
    'CEA Expiry Date',
    'Status',
    'Lead Organiser',
    'Lead Email',
    'Estimated Members',
    'Notes',
    'Date Last Updated',
  ];

  const rows = agreements.map((a) => [
    a.employerName,
    a.industry,
    a.region,
    a.ceaExpiryDate,
    a.status,
    a.leadOrganiser,
    a.leadEmail,
    String(a.estimatedMembers),
    a.notes,
    a.dateLastUpdated,
  ]);

  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;

  const csv = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
