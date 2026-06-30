import React from 'react';
import { Calendar, Users, LayoutDashboard, ShieldAlert, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#', active: true },
    { name: 'Appointments', icon: Calendar, href: '#' },
    { name: 'Lawyers Management', icon: Users, href: '#' },
    { name: 'Availability Slots', icon: ShieldAlert, href: '#' },
  ];

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-r border-slate-800 bg-slate-950 p-4 text-slate-200">
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div className="px-2 py-3">
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            ABC of Law
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Firm Management Admin</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>

      {/* User Logout Footer */}
      <div className="border-t border-slate-900 pt-4 px-2">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-all">
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
