'use client';

import { CheckCircle2, Clock, Calendar, UserCheck, FileText, Lock } from 'lucide-react';

export type StageKey = 'BOOKED' | 'CONFIRMED' | 'LAWYER_ASSIGNED' | 'CONSULTATION_DONE' | 'DOCUMENTS_UPLOADED' | 'CLOSED';

interface ClientTimelineProps {
  currentStatus: string;
  hasLawyer?: boolean;
  hasDocuments?: boolean;
}

export function ClientTimeline({ currentStatus, hasLawyer = false, hasDocuments = false }: ClientTimelineProps) {
  const getStageStatus = (stage: StageKey) => {
    switch (stage) {
      case 'BOOKED':
        return 'completed';
      case 'CONFIRMED':
        return currentStatus === 'CONFIRMED' || currentStatus === 'COMPLETED' ? 'completed' : currentStatus === 'PENDING_REVIEW' ? 'current' : 'upcoming';
      case 'LAWYER_ASSIGNED':
        return hasLawyer || currentStatus === 'CONFIRMED' || currentStatus === 'COMPLETED' ? 'completed' : 'upcoming';
      case 'CONSULTATION_DONE':
        return currentStatus === 'COMPLETED' ? 'completed' : 'upcoming';
      case 'DOCUMENTS_UPLOADED':
        return hasDocuments ? 'completed' : 'upcoming';
      case 'CLOSED':
        return currentStatus === 'CANCELLED' ? 'cancelled' : currentStatus === 'COMPLETED' ? 'completed' : 'upcoming';
      default:
        return 'upcoming';
    }
  };

  const stages = [
    { key: 'BOOKED', label: 'Consultation Requested', icon: Calendar },
    { key: 'CONFIRMED', label: 'Slot Confirmed', icon: Clock },
    { key: 'LAWYER_ASSIGNED', label: 'Lawyer Assigned', icon: UserCheck },
    { key: 'CONSULTATION_DONE', label: 'Consultation Complete', icon: CheckCircle2 },
    { key: 'DOCUMENTS_UPLOADED', label: 'Case Files Uploaded', icon: FileText },
    { key: 'CLOSED', label: 'Matter Concluded', icon: Lock },
  ];

  return (
    <div className="bg-card border rounded-xl p-6 shadow-xs my-6">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
        Consultation & Matter Progress Tracker
      </h3>

      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
        {stages.map((stage, idx) => {
          const status = getStageStatus(stage.key as StageKey);
          const Icon = stage.icon;

          const isCompleted = status === 'completed';
          const isCurrent = status === 'current';

          return (
            <div key={stage.key} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 relative z-10 w-full md:w-auto">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 font-bold'
                    : isCurrent
                    ? 'bg-primary/10 text-primary border border-primary/40 animate-pulse'
                    : 'bg-muted text-muted-foreground border'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="text-left md:text-center">
                <p className={`text-xs font-medium ${isCompleted ? 'text-foreground font-semibold' : isCurrent ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {stage.label}
                </p>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {isCompleted ? 'Done' : isCurrent ? 'In Progress' : 'Pending'}
                </span>
              </div>

              {idx < stages.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-0.5 bg-border -z-10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
