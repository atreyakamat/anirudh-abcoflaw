'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useState, useMemo } from 'react';
import { formatDate, formatTime, getStatusColor, getStatusLabel } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, List } from 'lucide-react';
import type { Appointment } from '@/types';

type ViewMode = 'month' | 'week' | 'day' | 'agenda';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const startDate = useMemo(() => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setDate(1);
    } else if (viewMode === 'week') {
      const day = d.getDay();
      d.setDate(d.getDate() - day);
    }
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentDate, viewMode]);

  const endDate = useMemo(() => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + 1, 0);
    } else if (viewMode === 'week') {
      const day = d.getDay();
      d.setDate(d.getDate() + (6 - day));
    }
    d.setHours(23, 59, 59, 999);
    return d;
  }, [currentDate, viewMode]);

  const { data: appointments, isLoading } = useQuery({
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

  const prevPeriod = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1, 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const nextPeriod = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1, 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const currentDateStr = currentDate.toISOString().split('T')[0];
  const selectedDayAppts = appointmentsByDate[currentDateStr] || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Legal Calendar & Hearing Schedule</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Consultation time slots, court appearances, and advocate schedule</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-0.5 bg-muted/60 text-xs font-semibold">
            {(['month', 'week', 'day', 'agenda'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                  viewMode === mode ? 'bg-background text-foreground shadow-2xs font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-accent shadow-2xs">
            Today
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-card border rounded-xl shadow-2xs">
        <div className="flex items-center gap-3">
          <button onClick={prevPeriod} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-semibold text-base">
            {viewMode === 'month' && currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            {viewMode === 'week' && `Week of ${startDate.toLocaleDateString()}`}
            {(viewMode === 'day' || viewMode === 'agenda') && formatDate(currentDate.toISOString())}
          </span>
          <button onClick={nextPeriod} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <span className="text-xs text-muted-foreground font-mono">
          {appointments?.length || 0} Scheduled Events
        </span>
      </div>

      {/* View Renderers */}
      {viewMode === 'month' && (
        <div className="border rounded-xl overflow-hidden bg-card shadow-2xs">
          <div className="grid grid-cols-7 bg-muted/80 text-muted-foreground border-b">
            {weekDays.map((day) => (
              <div key={day} className="p-3 text-center text-xs font-semibold tracking-wider uppercase">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="border-t border-r p-2 min-h-[110px] bg-muted/20" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayAppts = appointmentsByDate[dateStr] || [];
              const isToday = todayStr === dateStr;

              return (
                <div
                  key={day}
                  onClick={() => { setCurrentDate(new Date(dateStr)); setViewMode('day'); }}
                  className={`border-t border-r p-2 min-h-[110px] hover:bg-accent/30 transition-colors cursor-pointer ${
                    isToday ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${
                      isToday ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' : 'text-foreground'
                    }`}>
                      {day}
                    </span>
                    {dayAppts.length > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {dayAppts.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1">
                    {dayAppts.slice(0, 3).map((apt) => (
                      <div key={apt.id} className={`text-[11px] p-1 rounded font-medium ${getStatusColor(apt.status)} truncate shadow-2xs`}>
                        {formatTime(apt.preferredTime)} {apt.client?.firstName}
                      </div>
                    ))}
                    {dayAppts.length > 3 && (
                      <span className="text-[10px] text-muted-foreground block text-right font-medium">+{dayAppts.length - 3} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'day' && (
        <div className="bg-card border rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-semibold text-base flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <span>Schedule for {formatDate(currentDate.toISOString())}</span>
            </h3>
            <span className="text-xs font-mono text-muted-foreground">{selectedDayAppts.length} consultations</span>
          </div>

          {selectedDayAppts.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No consultations scheduled for this date.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayAppts.map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl border bg-background hover:bg-accent/40 transition-colors flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-bold text-sm">{formatTime(apt.preferredTime)}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {getStatusLabel(apt.status)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{apt.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <User className="w-3.5 h-3.5" />
                      <span>{apt.client?.firstName} {apt.client?.lastName} ({apt.client?.email})</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(viewMode === 'week' || viewMode === 'agenda') && (
        <div className="bg-card border rounded-xl p-6 shadow-2xs space-y-4">
          <h3 className="font-semibold text-base flex items-center gap-2 border-b pb-3">
            <List className="w-4 h-4 text-primary" />
            <span>{viewMode === 'week' ? 'Weekly Agenda Overview' : 'Chronological Consultation Agenda'}</span>
          </h3>

          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">Loading schedule...</div>
          ) : (appointments || []).length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">No upcoming appointments in this period.</div>
          ) : (
            <div className="space-y-3">
              {(appointments || []).map((apt) => (
                <div key={apt.id} className="p-4 rounded-xl border bg-background hover:bg-accent/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-primary">{formatDate(apt.preferredDate)}</span>
                      <span className="text-xs font-bold">{formatTime(apt.preferredTime)}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${getStatusColor(apt.status)}`}>
                        {getStatusLabel(apt.status)}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{apt.description}</p>
                    <p className="text-xs text-muted-foreground">{apt.client?.firstName} {apt.client?.lastName} • {apt.client?.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
