import { useState, useEffect } from 'react';
import type { Agreement, Industry, Region, Status } from '../types';

interface Props {
  initial?: Agreement | null;
  onSave: (agreement: Agreement) => void;
  onClose: () => void;
}

// Type aliases to avoid repeating long generics
type FormEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;
type BlurEvent = React.FocusEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

// Shared input class to avoid repeating the same string
const inputClass =
  'border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

const emptyForm = {
  employerName: '',
  industry: '' as Industry | '',
  region: '' as Region | '',
  ceaExpiryDate: '',
  status: '' as Status | '',
  leadOrganiser: '',
  leadEmail: '',
  estimatedMembers: '',
  notes: '',
};

type FormData = typeof emptyForm;
type Errors = Partial<Record<keyof FormData, string>>;
type Touched = Partial<Record<keyof FormData, boolean>>;

function validate(form: FormData): Errors {
  const errors: Errors = {};
  if (!form.employerName.trim())
    errors.employerName = 'Employer name is required';
  if (!form.industry) errors.industry = 'Industry is required';
  if (!form.region) errors.region = 'Region is required';
  if (!form.ceaExpiryDate) errors.ceaExpiryDate = 'Expiry date is required';
  if (!form.status) errors.status = 'Status is required';
  if (!form.leadOrganiser.trim())
    errors.leadOrganiser = 'Organiser name is required';
  if (!form.leadEmail.trim()) {
    errors.leadEmail = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.leadEmail)) {
    errors.leadEmail = 'Enter a valid email address';
  }
  if (!form.estimatedMembers) {
    errors.estimatedMembers = 'Member count is required';
  } else if (
    isNaN(Number(form.estimatedMembers)) ||
    Number(form.estimatedMembers) < 1
  ) {
    errors.estimatedMembers = 'Must be a positive number';
  }
  return errors;
}

export default function AgreementForm({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  useEffect(() => {
    if (initial) {
      setForm({
        employerName: initial.employerName,
        industry: initial.industry,
        region: initial.region,
        ceaExpiryDate: initial.ceaExpiryDate,
        status: initial.status,
        leadOrganiser: initial.leadOrganiser,
        leadEmail: initial.leadEmail,
        estimatedMembers: String(initial.estimatedMembers),
        notes: initial.notes,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setTouched({});
  }, [initial]);

  const handleChange = (e: FormEvent) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: BlurEvent) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const currentErrors = validate(form);
    setErrors(currentErrors);
  };

  const handleSubmit = () => {
    const allTouched = Object.fromEntries(
      Object.keys(emptyForm).map((k) => [k, true]),
    ) as Touched;
    setTouched(allTouched);

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const saved: Agreement = {
      id: initial?.id ?? String(Date.now()),
      employerName: form.employerName.trim(),
      industry: form.industry as Industry,
      region: form.region as Region,
      ceaExpiryDate: form.ceaExpiryDate,
      status: form.status as Status,
      leadOrganiser: form.leadOrganiser.trim(),
      leadEmail: form.leadEmail.trim(),
      estimatedMembers: Number(form.estimatedMembers),
      notes: form.notes.trim(),
      dateLastUpdated: new Date().toISOString().split('T')[0],
    };

    onSave(saved);
    onClose();
  };

  // Renders label + input/select/textarea + error message
  const field = (
    label: string,
    name: keyof FormData,
    children: React.ReactNode,
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase">
        {label}
      </label>
      {children}
      {touched[name] && errors[name] && (
        <span className="text-xs text-red-500">{errors[name]}</span>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            {initial ? 'Edit Agreement' : 'Add Agreement'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field(
            'Employer Name',
            'employerName',
            <input
              name="employerName"
              value={form.employerName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. AeroGround Services NZ"
              className={inputClass}
            />,
          )}

          {field(
            'Industry',
            'industry',
            <select
              name="industry"
              value={form.industry}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass}
            >
              <option value="">Select industry</option>
              <option value="Aviation">Aviation</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Health">Health</option>
              <option value="Public & Commercial">Public & Commercial</option>
            </select>,
          )}

          {field(
            'Region',
            'region',
            <select
              name="region"
              value={form.region}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass}
            >
              <option value="">Select region</option>
              <option value="Auckland">Auckland</option>
              <option value="Wellington">Wellington</option>
              <option value="Christchurch">Christchurch</option>
              <option value="National">National</option>
            </select>,
          )}

          {field(
            'CEA Expiry Date',
            'ceaExpiryDate',
            <input
              type="date"
              name="ceaExpiryDate"
              value={form.ceaExpiryDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass}
            />,
          )}

          {field(
            'Status',
            'status',
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass}
            >
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="In Bargaining">In Bargaining</option>
              <option value="Ratified">Ratified</option>
              <option value="Expired">Expired</option>
            </select>,
          )}

          {field(
            'Estimated Members',
            'estimatedMembers',
            <input
              type="number"
              name="estimatedMembers"
              value={form.estimatedMembers}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. 320"
              min={1}
              className={inputClass}
            />,
          )}

          {field(
            'Lead Organiser',
            'leadOrganiser',
            <input
              name="leadOrganiser"
              value={form.leadOrganiser}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Aroha Ngata"
              className={inputClass}
            />,
          )}

          {field(
            'Lead Email',
            'leadEmail',
            <input
              type="email"
              name="leadEmail"
              value={form.leadEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. aroha.ngata@example.nz"
              className={inputClass}
            />,
          )}

          <div className="sm:col-span-2">
            {field(
              'Notes',
              'notes',
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Any relevant notes..."
                rows={3}
                className={`${inputClass} resize-none`}
              />,
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          >
            {initial ? 'Save Changes' : 'Add Agreement'}
          </button>
        </div>
      </div>
    </div>
  );
}
