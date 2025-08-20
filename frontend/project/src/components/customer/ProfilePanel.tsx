import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { User, Mail, BadgeCheck } from "lucide-react";

const ProfilePanel: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className='space-y-6'>
      <header>
        <h1 className='text-2xl font-bold text-gray-800'>Profile</h1>
        <p className='text-gray-600'>Your account information</p>
      </header>

      <div className='bg-white/80 rounded-2xl shadow border p-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 grid place-items-center'>
            <User className='w-6 h-6 text-white' />
          </div>
          <div>
            <div className='text-lg font-semibold text-gray-800'>
              {user?.name || "—"}
            </div>
            <div className='text-sm text-gray-500 capitalize'>
              {user?.role?.toLowerCase()}
            </div>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <div className='rounded-xl border p-4'>
            <div className='flex items-center gap-2 text-gray-700 font-medium'>
              <Mail className='w-4 h-4' />
              Email
            </div>
            <div className='mt-2 text-gray-800'>{user?.email || "—"}</div>
          </div>
          <div className='rounded-xl border p-4'>
            <div className='flex items-center gap-2 text-gray-700 font-medium'>
              <BadgeCheck className='w-4 h-4' />
              Status
            </div>
            <div className='mt-2 text-gray-800'>Active</div>
          </div>
        </div>

        <div className='flex gap-3'>
          <button
            onClick={logout}
            className='px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
