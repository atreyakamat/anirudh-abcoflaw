'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useState, useMemo } from 'react';
import { formatTime, getStatusColor, getStatusLabel } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Appointment } from '@/types';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDate = useMemo(() => {
    const d = new Date(currentDate);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentDate]);

  const endDate = useMemo(() => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1, 0);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [currentDate]);

  const { data: appointments } = useQuery({
    queryKey: ['calendar-appointments', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const res = await api.calendar.getAppointments(startDate.toISOString(), endDate.toISOString());
      return res.data.data as Appointment[];
    },
  });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments?.forEach((apt) => {
      const key = new Date(apt.preferredDate).toISOString().split('T')[0];
      if (!map[key]) map[key] = [];
      map[key].push(apt);
    });
    return map;
  }, [appointments]);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 hover:bg-accent rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-medium">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-accent rounded-lg"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 bg-muted">
          {weekDays.map((day) => <div key={day} className="p-3 text-center text-sm font-medium">{day}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="border-t border-r p-2 min-h-[100px] bg-muted/30" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAppts = appointmentsByDate[dateStr] || [];
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            return (
              <div key={day} className={`border-t border-r p-2 min-h-[100px] ${isToday ? 'bg-primary/5' : ''}`}>
                <span className={`text-sm font-medium ${isToday ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>{day}</span>
                <div className="mt-1 space-y-1">{dayAppts.slice(0, 3).map((apt) => (
                  <div key={apt.id} className={`text-xs p-1 rounded ${getStatusColor(apt.status)} truncate`}>{formatTime(apt.preferredTime)} {apt.client?.firstName}</div>
                ))}{dayAppts.length > 3 && <span className="text-xs text-muted-foreground">+{dayAppts.length - 3} more</span>}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}