import React, { useState } from "react";
import { Settings } from "lucide-react";

const Row: React.FC<{
  label: string;
  desc: string;
  checked: boolean;
  onChange: (b: boolean) => void;
}> = ({ label, desc, checked, onChange }) => (
  <div className='flex items-center justify-between py-4 border-b'>
    <div>
      <p className='font-medium text-gray-800'>{label}</p>
      <p className='text-sm text-gray-500'>{desc}</p>
    </div>
    <label className='inline-flex items-center cursor-pointer'>
      <input
        type='checkbox'
        className='sr-only'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`w-11 h-6 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full transform translate-y-0.5 transition ${
            checked ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </span>
    </label>
  </div>
);

const AdminSettingsPage: React.FC = () => {
  const [autoEmail, setAutoEmail] = useState(true);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <section className='space-y-6'>
      <header className='flex items-center gap-3'>
        <Settings className='w-7 h-7 text-gray-700' />
        <div>
          <h2 className='text-2xl font-bold text-gray-800'>Settings</h2>
          <p className='text-gray-600'>Workspace preferences</p>
        </div>
      </header>

      <div className='bg-white/80 rounded-2xl border p-6'>
        <Row
          label='Auto email on approval'
          desc='Send customers an email automatically when a loan is approved.'
          checked={autoEmail}
          onChange={setAutoEmail}
        />
        <Row
          label='Require 2-factor for admins'
          desc='Add extra security for admin sign-in.'
          checked={twoFA}
          onChange={setTwoFA}
        />
      </div>
    </section>
  );
};

export default AdminSettingsPage;
