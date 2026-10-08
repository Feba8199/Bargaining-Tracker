import type { Industry, Region, Status } from '../types';

export interface Filters {
  industry: Industry | '';
  region: Region | '';
  status: Status | '';
  organiser: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export const defaultFilters: Filters = {
  industry: '',
  region: '',
  status: '',
  organiser: '',
};

export default function FilterBar({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Industry */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Industry
          </label>
          <select
            value={filters.industry}
            onChange={(e) =>
              onChange({
                ...filters,
                industry: e.target.value as Industry | '',
              })
            }
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Industries</option>
            <option value="Aviation">Aviation</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Health">Health</option>
            <option value="Public & Commercial">Public & Commercial</option>
          </select>
        </div>

        {/* Region */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) =>
              onChange({ ...filters, region: e.target.value as Region | '' })
            }
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Regions</option>
            <option value="Auckland">Auckland</option>
            <option value="Wellington">Wellington</option>
            <option value="Christchurch">Christchurch</option>
            <option value="National">National</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              onChange({ ...filters, status: e.target.value as Status | '' })
            }
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="In Bargaining">In Bargaining</option>
            <option value="Ratified">Ratified</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        {/* Organiser search */}
        <div className="flex flex-col gap-1 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Organiser
          </label>
          <input
            type="text"
            placeholder="Search organiser..."
            value={filters.organiser}
            onChange={(e) =>
              onChange({ ...filters, organiser: e.target.value })
            }
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Reset + count */}
        <div className="flex flex-col gap-1 ml-auto items-end">
          <span className="text-xs text-gray-400">
            Showing {filteredCount} of {totalCount}
          </span>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
