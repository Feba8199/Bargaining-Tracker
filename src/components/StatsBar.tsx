import type { Agreement } from '../types';

interface Props {
  agreements: Agreement[];
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

export default function StatsBar({ agreements }: Props) {
  const expiring = agreements.filter(
    (a) => getExpiryStatus(a.ceaExpiryDate) === 'expiring',
  ).length;

  const expired = agreements.filter(
    (a) => getExpiryStatus(a.ceaExpiryDate) === 'expired',
  ).length;

  const inBargaining = agreements.filter(
    (a) => a.status === 'In Bargaining',
  ).length;

  const totalMembers = agreements.reduce(
    (sum, a) => sum + a.estimatedMembers,
    0,
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-amber-400">
        <p className="text-xs font-semibold text-gray-500 uppercase">
          Expiring ≤90 days
        </p>
        <p className="text-3xl font-bold text-amber-500 mt-1">{expiring}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
        <p className="text-xs font-semibold text-gray-500 uppercase">Expired</p>
        <p className="text-3xl font-bold text-red-500 mt-1">{expired}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
        <p className="text-xs font-semibold text-gray-500 uppercase">
          In Bargaining
        </p>
        <p className="text-3xl font-bold text-purple-600 mt-1">
          {inBargaining}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <p className="text-xs font-semibold text-gray-500 uppercase">
          Total Members
        </p>
        <p className="text-3xl font-bold text-blue-600 mt-1">
          {totalMembers.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
