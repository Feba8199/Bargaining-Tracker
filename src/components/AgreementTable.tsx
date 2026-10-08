import type { Agreement } from '../types';

interface Props {
  agreements: Agreement[];
  onEdit: (agreement: Agreement) => void;
  onDelete: (id: string) => void;
}

function getExpiryStatus(expiryDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  const daysUntil = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntil < 0) return 'expired';
  if (daysUntil <= 90) return 'expiring';
  return 'ok';
}

function getRowStyle(expiryStatus: string) {
  if (expiryStatus === 'expired') return 'bg-red-50';
  if (expiryStatus === 'expiring') return 'bg-amber-50';
  return 'bg-white';
}

function getAccentBorder(expiryStatus: string) {
  if (expiryStatus === 'expired') return 'border-l-4 border-red-500';
  if (expiryStatus === 'expiring') return 'border-l-4 border-amber-400';
  return 'border-l-4 border-transparent';
}

function ExpiryBadge({ expiryDate }: { expiryDate: string }) {
  const status = getExpiryStatus(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  const daysUntil = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (status === 'expired') {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-red-100 text-red-700">
        Expired {Math.abs(daysUntil)}d ago
      </span>
    );
  }
  if (status === 'expiring') {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-amber-100 text-amber-700">
        {daysUntil === 0 ? 'Expires today' : `${daysUntil}d left`}
      </span>
    );
  }
  return (
    <span className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap bg-gray-100 text-gray-600">
      {daysUntil}d
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: 'bg-blue-100 text-blue-700',
    'In Bargaining': 'bg-purple-100 text-purple-700',
    Ratified: 'bg-green-100 text-green-700',
    Expired: 'bg-red-100 text-red-700',
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  );
}

export default function AgreementTable({
  agreements,
  onEdit,
  onDelete,
}: Props) {
  if (agreements.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No agreements found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-800 text-white whitespace-nowrap">
          <tr>
            <th className="px-4 py-3 text-left">Employer</th>
            <th className="px-4 py-3 text-left">Industry</th>
            <th className="px-4 py-3 text-left">Region</th>
            <th className="px-4 py-3 text-left">Expiry</th>
            <th className="px-4 py-3 text-left">Bargaining Status</th>
            <th className="px-4 py-3 text-left">Organiser</th>
            <th className="px-4 py-3 text-left">Members</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {agreements.map((agreement) => {
            const expiryStatus = getExpiryStatus(agreement.ceaExpiryDate);
            return (
              <tr
                key={agreement.id}
                className={`${getRowStyle(expiryStatus)} hover:opacity-90 transition-opacity`}
              >
                <td
                  className={`px-4 py-3 font-medium text-gray-900 ${getAccentBorder(expiryStatus)}`}
                >
                  {agreement.employerName}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {agreement.industry}
                </td>
                <td className="px-4 py-3 text-gray-600">{agreement.region}</td>
                <td className="px-4 py-3 text-gray-600">
                  <div>{agreement.ceaExpiryDate}</div>
                  <div className="mt-1">
                    <ExpiryBadge expiryDate={agreement.ceaExpiryDate} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={agreement.status} />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <div>{agreement.leadOrganiser}</div>
                  <div className="text-xs text-gray-400">
                    {agreement.leadEmail}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {agreement.estimatedMembers}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(agreement)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${agreement.employerName}?`)) {
                          onDelete(agreement.id);
                        }
                      }}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
