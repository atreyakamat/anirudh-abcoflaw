import React, { useState } from 'react';
import { Calendar, Users, LayoutDashboard, Clock, LogOut, Menu, Scale, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import { logoutUser } from '../../services/authService';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // 1. Add the handleLogout logic block here
  const handleLogout = async () => {
    try {
      await logoutUser();
      // subscribeToAuthChanges inside App.jsx will catch this and boot the user to /login instantly
    } catch (error) {
      console.error("Session termination encountered an exception:", error);
    }
  };

  const navigation = [
    { name: 'Dashboard',          icon: LayoutDashboard, href: '/' },
    { name: 'Appointments',       icon: Calendar,        href: '/appointments' },
    { name: 'Lawyers Management', icon: Users,           href: '/lawyers' },
    { name: 'Availability Slots', icon: Clock,           href: '/availability' },
  ];

  return (
    <div
      className={`flex h-screen flex-col justify-between border-r border-border bg-card transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* ── Top section ── */}
      <div className="flex flex-col gap-6 overflow-hidden">
        {/* Brand header */}
        <div
          className={`flex items-center border-b border-border px-4 py-4 ${
            isOpen ? 'justify-between' : 'justify-center'
          }`}
        >
          {isOpen && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Scale className="h-4 w-4" />
              </div>
              <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                ABC of Law
              </span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-ghost shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                title={!isOpen ? item.name : ''}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors overflow-hidden whitespace-nowrap ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                } ${!isOpen && 'justify-center'}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {isOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Footer ── */}
      <div className="flex flex-col gap-1 border-t border-border p-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
            !isOpen && 'justify-center'
          }`}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 shrink-0" />
          ) : (
            <Moon className="h-4 w-4 shrink-0" />
          )}
          {isOpen && (
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>

        {/* 2. Attached the onClick trigger to the Log out button element */}
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive ${
            !isOpen && 'justify-center'
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {isOpen && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
}
