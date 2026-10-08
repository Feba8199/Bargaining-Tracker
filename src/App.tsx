import { useState, useEffect } from 'react';
import type { Agreement } from './types';
import { seedAgreements } from './data/agreements';
import AgreementTable from './components/AgreementTable';
import FilterBar, { defaultFilters } from './components/FilterBar';
import type { Filters } from './components/FilterBar';
import AgreementForm from './components/AgreementForm';
import StatsBar from './components/StatsBar';
import { exportToCsv } from './utils/exportCsv';

const STORAGE_KEY = 'etu_agreements';

function App() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Agreement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAgreements(JSON.parse(stored));
    } else {
      setAgreements(seedAgreements);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedAgreements));
    }
  }, []);

  useEffect(() => {
    if (agreements.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(agreements));
    }
  }, [agreements]);

  const handleSave = (agreement: Agreement) => {
    if (editTarget) {
      setAgreements((prev) =>
        prev.map((a) => (a.id === agreement.id ? agreement : a)),
      );
    } else {
      setAgreements((prev) => [...prev, agreement]);
    }
  };

  const handleEditClick = (agreement: Agreement) => {
    setEditTarget(agreement);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAgreements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClose = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const filtered = agreements.filter((a) => {
    if (filters.industry && a.industry !== filters.industry) return false;
    if (filters.region && a.region !== filters.region) return false;
    if (filters.status && a.status !== filters.status) return false;
    if (
      filters.organiser &&
      !a.leadOrganiser.toLowerCase().includes(filters.organiser.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
               Bargaining Tracker
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {agreements.length} agreements · Last updated{' '}
              {new Date().toLocaleDateString('en-NZ')}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => exportToCsv(filtered)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                setEditTarget(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700"
            >
              + Add Agreement
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar agreements={agreements} />

        {/* Filters */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
          totalCount={agreements.length}
          filteredCount={filtered.length}
        />

        {/* Table */}
        <AgreementTable
          agreements={filtered}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />

        {/* Modal */}
        {showForm && (
          <AgreementForm
            initial={editTarget}
            onSave={handleSave}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

export default App;
