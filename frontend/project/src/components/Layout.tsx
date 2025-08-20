import React, { useEffect, useRef, useState } from "react";
import {
  User,
  LogOut,
  Building2,
  Home,
  FileText,
  CreditCard,
  Calendar,
  Settings,
  Users,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

type RoleUpper = "ADMIN" | "CUSTOMER";

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onViewChange,
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const normalizedRole = (
    user?.role ||
    localStorage.getItem("role") ||
    "CUSTOMER"
  )
    .toString()
    .toUpperCase() as RoleUpper;
  const isAdmin = normalizedRole === "ADMIN";

  const displayName =
    user?.name ||
    localStorage.getItem("name") ||
    localStorage.getItem("userName") ||
    "User";

  const [toast, setToast] = useState<string | null>(null);
  const dismissRef = useRef<number | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    if (dismissRef.current) window.clearTimeout(dismissRef.current);
    dismissRef.current = window.setTimeout(() => setToast(null), 1400);
  };

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && (setSidebarOpen(false), setProfileOpen(false));
    const onClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.body.style.overflow = "";
      if (dismissRef.current) window.clearTimeout(dismissRef.current);
    };
  }, [sidebarOpen]);

  const customerNavItems: ReadonlyArray<NavItem> = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "apply-loan", label: "Apply Loan", icon: FileText },
    { id: "my-loans", label: "My Loans", icon: CreditCard },
    { id: "payments", label: "Payments", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ];

  const adminNavItems: ReadonlyArray<NavItem> = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "customers", label: "Customers", icon: Users },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const navItems = (
    isAdmin ? adminNavItems : customerNavItems
  ) as ReadonlyArray<NavItem>;

  const handleSignOut = () => {
    setProfileOpen(false);
    logout();
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex'>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out shadow-2xl`}
      >
        <div className='flex items-center justify-between h-16 px-6 bg-gray-800'>
          <button
            type='button'
            onClick={() => {
              onViewChange("dashboard");
              setSidebarOpen(false);
            }}
            className='flex items-center space-x-3 group'
            aria-label='Go to dashboard'
          >
            <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg'>
              <Building2 className='w-5 h-5 text-white' />
            </div>
            <div className='text-left'>
              <h1 className='text-lg font-bold text-white group-hover:opacity-90'>
                LoanMS
              </h1>
              <p className='text-xs text-gray-400'>
                {isAdmin ? "Admin Panel" : "Customer Portal"}
              </p>
            </div>
          </button>

          <button
            type='button'
            onClick={() => setSidebarOpen(false)}
            className='text-gray-400 hover:text-white'
            aria-label='Close sidebar'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        <nav className='mt-8 px-4'>
          <div className='space-y-2'>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => {
                    onViewChange(item.id);
                    setSidebarOpen(false);
                    showToast(`${item.label} opened`);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className='w-5 h-5' />
                  <span className='font-medium'>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mobile-only Sign out at the bottom */}
        <div className='absolute bottom-0 left-0 right-0 p-4 bg-gray-800'>
          <div className='flex items-center space-x-3 mb-4'>
            <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full'>
              <User className='w-5 h-5 text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-white truncate'>
                {displayName}
              </p>
              <p className='text-xs text-gray-400 capitalize'>
                {isAdmin ? "Admin" : "Customer"}
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={handleSignOut}
            className='md:hidden w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-xl transition-all duration-200'
          >
            <LogOut className='w-4 h-4' />
            <span className='text-sm'>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      <button
        type='button'
        aria-label='Close sidebar backdrop'
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Top bar + main */}
      <div className='flex-1 flex flex-col'>
        <nav className='bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-30'>
          <div className='px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
              <div className='flex items-center space-x-4'>
                <button
                  type='button'
                  onClick={() => setSidebarOpen(true)}
                  className='text-gray-600 hover:text-gray-800'
                  aria-label='Open sidebar'
                >
                  <Menu className='w-6 h-6' />
                </button>
                <button
                  type='button'
                  className='flex items-center space-x-3'
                  onClick={() => onViewChange("dashboard")}
                  aria-label='Go to dashboard'
                >
                  <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg'>
                    <Building2 className='w-5 h-5 text-white' />
                  </div>
                  <h1 className='text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                    LoanMS
                  </h1>
                </button>
              </div>

              {/* Profile dropdown */}
              <div className='relative' ref={profileRef}>
                <button
                  type='button'
                  onClick={() => setProfileOpen((v) => !v)}
                  className='flex items-center gap-3 rounded-xl px-2 py-1 hover:bg-gray-100'
                  aria-haspopup='menu'
                  aria-expanded={profileOpen}
                >
                  <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full'>
                    <User className='w-4 h-4 text-gray-600' />
                  </div>
                  <div className='hidden sm:block text-left'>
                    <p className='text-sm font-medium text-gray-700'>
                      {displayName}
                    </p>
                    <p className='text-xs text-gray-500 capitalize'>
                      {isAdmin ? "Admin" : "Customer"}
                    </p>
                  </div>
                </button>

                {profileOpen && (
                  <div
                    role='menu'
                    className='absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden'
                  >
                    <div className='px-4 py-3 border-b'>
                      <p className='text-sm font-medium text-gray-800 truncate'>
                        {displayName}
                      </p>
                      <p className='text-xs text-gray-500 capitalize'>
                        {isAdmin ? "Admin" : "Customer"}
                      </p>
                    </div>
                    {!isAdmin && (
                      <button
                        role='menuitem'
                        onClick={() => {
                          onViewChange("profile");
                          setProfileOpen(false);
                        }}
                        className='w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50'
                      >
                        Profile
                      </button>
                    )}
                    <button
                      role='menuitem'
                      onClick={handleSignOut}
                      className='w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2'
                    >
                      <LogOut className='w-4 h-4' />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Always render the page content passed from App/AdminShell */}
        <main className='flex-1 px-4 sm:px-6 lg:px-8 py-8'>{children}</main>
      </div>

      {toast && (
        <div className='fixed bottom-6 right-6 z-[60]'>
          <div className='rounded-xl bg-slate-900 text-white px-4 py-3 shadow-lg flex items-center gap-3'>
            <span className='text-sm'>{toast}</span>
            <button
              type='button'
              className='text-white/70 hover:text-white'
              onClick={() => setToast(null)}
              aria-label='Dismiss'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
