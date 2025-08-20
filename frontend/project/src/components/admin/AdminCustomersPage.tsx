import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { fetchCustomers, AdminUser } from "../../lib/admin";

const AdminCustomersPage: React.FC = () => {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await fetchCustomers();
        if (alive) setRows(data);
      } catch (e: any) {
        if (alive)
          setErr(e?.response?.data?.message || "Failed to load customers");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className='space-y-6'>
      <header className='flex items-center gap-3'>
        <Users className='w-6 h-6 text-blue-600' />
        <h1 className='text-2xl font-bold text-gray-800'>Customers</h1>
      </header>

      {err && (
        <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-red-700'>
          {err}
        </div>
      )}

      <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border'>
        <div className='p-4 border-b text-sm text-gray-500'>
          Total:{" "}
          <span className='font-medium text-gray-700'>
            {loading ? "—" : rows.length}
          </span>
        </div>
        <div className='p-4 overflow-x-auto'>
          {loading ? (
            <div className='text-gray-600 py-8'>Loading…</div>
          ) : (
            <table className='w-full'>
              <thead>
                <tr className='text-left text-sm text-gray-600 border-b'>
                  <th className='py-2 pr-4'>Name</th>
                  <th className='py-2 pr-4'>Email</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className='border-b hover:bg-gray-50'>
                    <td className='py-3 pr-4 font-medium text-gray-800'>
                      {c.name || "—"}
                    </td>
                    <td className='py-3 pr-4 text-gray-700'>{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminCustomersPage;
