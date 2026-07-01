import React, { useState } from 'react';
import { Calendar, Users, LayoutDashboard, ShieldAlert, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom'; 

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation(); // Track current URL


  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Appointments', icon: Calendar, href: '/appointments' },
    { name: 'Lawyers Management', icon: Users, href: '/lawyers' },
    { name: 'Availability Slots', icon: ShieldAlert, href: '/availability' },
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
    <nav className="flex flex-col gap-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            title={!isOpen ? item.name : ""}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all overflow-hidden whitespace-nowrap ${
              isActive
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            } ${!isOpen && 'justify-center'}`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {isOpen && <span>{item.name}</span>}
          </Link>
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
