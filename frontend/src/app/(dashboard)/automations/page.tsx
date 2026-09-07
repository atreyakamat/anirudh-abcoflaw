'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { Card } from '@/components/ui/card';
import {
  Bot, Play, CheckCircle2, RefreshCw, Zap,
  Activity, Sparkles, ShieldCheck,
} from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  category: 'APPOINTMENTS' | 'BILLING' | 'CLIENTS' | 'AI';
  triggerEvent: string;
  status: 'ACTIVE' | 'INACTIVE';
  successCount: number;
  failureCount: number;
  lastRunAt: string | null;
  avgDurationMs: number;
  n8nWorkflowId?: string;
  webhookPath: string;
}

interface Log {
  id: string;
  workflowId: string;
  workflowName: string;
  event: string;
  status: 'SUCCESS' | 'FAILURE' | 'RETRYING';
  durationMs: number;
  responseCode: number;
  timestamp: string;
  payloadPreview: string;
}

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [runningId, setRunningId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wfRes, logsRes] = await Promise.all([
        api.get<Workflow[]>('/automations'),
        api.get<Log[]>('/automations/logs'),
      ]);
      setWorkflows(wfRes.data || []);
      setLogs(logsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch automations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await api.post<Workflow>(`/automations/${id}/toggle`, {});
      setWorkflows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: res.data.status } : w))
      );
    } catch (err) {
      console.error('Failed to toggle workflow', err);
    }
  };

  const handleRun = async (id: string) => {
    setRunningId(id);
    try {
      const res = await api.post<Log>(`/automations/${id}/trigger`, {
        triggeredFrom: 'AUTOMATION_DASHBOARD',
        testMode: true,
      });
      setLogs((prev) => [res.data, ...prev]);
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, successCount: w.successCount + 1, lastRunAt: new Date().toISOString() }
            : w
        )
      );
    } catch (err) {
      console.error('Failed to trigger workflow', err);
    } finally {
      setRunningId(null);
    }
  };

  const filteredWorkflows =
    activeCategory === 'ALL'
      ? workflows
      : workflows.filter((w) => w.category === activeCategory);

  const totalRuns = workflows.reduce((sum, w) => sum + w.successCount + w.failureCount, 0);
  const activeCount = workflows.filter((w) => w.status === 'ACTIVE').length;
  const aiCount = workflows.filter((w) => w.category === 'AI').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-7 h-7 text-primary" />
            Intelligent Automation Layer (n8n v1)
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Production orchestration platform: Decoupled events, n8n workflows & LLM AI assistants.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-accent hover:bg-accent/80 rounded-md transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-[#141517] sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Active Workflows</div>
            <div className="text-2xl font-bold">{activeCount} / {workflows.length}</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">System Executions</div>
            <div className="text-2xl font-bold">{totalRuns}</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">AI LLM Agents</div>
            <div className="text-2xl font-bold">{aiCount} Active</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Webhook Security</div>
            <div className="text-sm font-bold text-green-600 dark:text-green-400">HMAC SHA-256</div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto">
        {['ALL', 'APPOINTMENTS', 'BILLING', 'CLIENTS', 'AI'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            {cat === 'AI' ? '✨ AI WORKFLOWS' : cat}
          </button>
        ))}
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkflows.map((wf) => (
          <Card key={wf.id} className="p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    wf.category === 'AI'
                      ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {wf.category}
                </span>
                <button
                  onClick={() => handleToggle(wf.id)}
                  className={`w-10 h-5 flex items-center rounded-full p-0.5 transition ${
                    wf.status === 'ACTIVE' ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow" />
                </button>
              </div>

              <h3 className="font-semibold text-base mt-2 flex items-center gap-1.5">
                {wf.category === 'AI' && <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />}
                {wf.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-mono">{wf.triggerEvent}</p>
            </div>

            <div className="border-t pt-3 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Total Runs:</span>
                <span className="font-semibold text-foreground">{wf.successCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Latency:</span>
                <span className="font-semibold text-foreground">{wf.avgDurationMs} ms</span>
              </div>
              <div className="flex justify-between">
                <span>Last Execution:</span>
                <span className="font-semibold text-foreground">
                  {wf.lastRunAt ? new Date(wf.lastRunAt).toLocaleTimeString() : 'Never'}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleRun(wf.id)}
              disabled={runningId === wf.id}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${runningId === wf.id ? 'animate-pulse' : ''}`} />
              {runningId === wf.id ? 'Executing...' : 'Trigger Workflow Run'}
            </button>
          </Card>
        ))}
      </div>

      {/* Execution Logs Table */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Execution Logs & Audit History
          </h2>
          <span className="text-xs text-muted-foreground">Real-time n8n Webhook History</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground font-semibold">
              <tr>
                <th className="p-2.5 rounded-l">Workflow Name</th>
                <th className="p-2.5">Domain Event</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">HTTP Code</th>
                <th className="p-2.5">Latency</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5 rounded-r">Payload Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/40 transition">
                  <td className="p-2.5 font-medium">{log.workflowName}</td>
                  <td className="p-2.5 font-mono text-muted-foreground">{log.event}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-green-500/15 text-green-600 dark:text-green-400">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono">{log.responseCode}</td>
                  <td className="p-2.5">{log.durationMs} ms</td>
                  <td className="p-2.5 text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-2.5 font-mono text-[11px] text-muted-foreground truncate max-w-xs">
                    {log.payloadPreview}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
