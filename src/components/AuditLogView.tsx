import React, { useState, useEffect } from 'react';
import { AuditLog } from '../types';
import { api } from '../api';
import { ScrollText, Search, Filter, ShieldCheck, Clock, User } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs().then((res) => {
      setLogs(res);
      setLoading(false);
    });
  }, []);

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = selectedRole === 'ALL' || log.userRole === selectedRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 text-slate-900">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#ff5000]">
            [ REGULATORY COMPLIANCE ]
          </span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-xs font-space text-slate-500">SOC-2 &amp; Brand Safety Ledger</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-syne text-slate-900 tracking-tight">
          Immutable Audit Trail
        </h1>
        <p className="text-xs font-sans text-slate-500 max-w-xl mt-1 leading-relaxed">
          Complete verifiable timeline of all creative submissions, Gemini AI evaluations, routing
          triggers, manager approvals, and threshold adjustments.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden font-sans">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between bg-slate-900 text-white">
          <div>
            <h2 className="text-base font-bold font-syne text-white">
              Audit Event Log ({filtered.length} Records)
            </h2>
            <p className="text-xs font-space text-slate-400 mt-0.5">Chronological timestamped records</p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3.5 py-1.5 text-xs font-space text-white placeholder-slate-400 focus:border-[#ff5000] focus:outline-none"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-space text-white focus:border-[#ff5000] focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
              <option value="SYSTEM">System AI</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {filtered.map((log, lIdx) => (
            <div key={`${log.id}-${lIdx}`} className="p-4 hover:bg-slate-50 transition-colors text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[9px] font-space font-bold uppercase tracking-wider ${
                      log.userRole === 'ADMIN'
                        ? 'bg-slate-900 text-white border border-slate-700'
                        : log.userRole === 'MANAGER'
                        ? 'bg-[#ff5000]/15 text-[#ff5000] border border-[#ff5000]/30'
                        : log.userRole === 'SYSTEM'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    {log.userRole}
                  </span>
                  <span className="font-bold font-syne text-slate-900">{log.action}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span className="text-slate-500 font-space font-normal">{log.userName}</span>
                </div>
                <span className="text-[11px] font-space text-slate-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed font-sans">{log.details}</p>
              {(log.oldStatus || log.newStatus) && (
                <div className="flex items-center gap-1.5 text-[10px] font-space text-slate-500 pt-1">
                  <span>State Transition:</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 border border-slate-200 text-slate-800">
                    {log.oldStatus || 'INIT'}
                  </span>
                  <span>&rarr;</span>
                  <span className="rounded bg-slate-900 text-[#ff5000] px-1.5 py-0.5 font-bold">
                    {log.newStatus}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
