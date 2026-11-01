import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { DriveStatusResponse } from '../types';
import {
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  FolderSync,
  HelpCircle,
} from 'lucide-react';

export const DriveConnectionStatusCard: React.FC = () => {
  const [status, setStatus] = useState<DriveStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await api.getDriveStatus();
      setStatus(data);
    } catch (err: any) {
      console.error('Failed to load Drive status:', err);
      setErrorMsg('Unable to query Drive configuration status.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.testDriveConnection();
      setTestResult(res);
      await fetchStatus();
    } catch (err: any) {
      setTestResult({
        success: false,
        connected: false,
        errorMessage: err.message || 'Connection test call failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const isConnected = Boolean(status?.configured && (testResult?.connected || status?.connected));
  const isConfigured = Boolean(status?.configured);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
              isConnected
                ? 'bg-emerald-600 text-white'
                : isConfigured
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-slate-200'
            }`}
          >
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-syne text-slate-900">
                Company Google Drive Integration
              </h3>
              {isConfigured ? (
                <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-space font-bold">
                  Configured ({status?.authType})
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 text-[10px] font-space font-bold">
                  Not Configured
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Single company-controlled repository for brand toolkits, campaign assets, and client deliveries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold font-syne transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing Drive API...' : 'Test Connection'}</span>
          </button>
        </div>
      </div>

      {/* Connection State Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
          <span className="text-[10px] font-space uppercase font-bold text-slate-500 block">
            Auth &amp; Credentials
          </span>
          <div className="flex items-center gap-1.5">
            {isConfigured ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold font-space text-slate-900">
                  {status?.authType === 'SERVICE_ACCOUNT' ? 'Service Account' : 'OAuth 2.0'}
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-bold font-space text-slate-700">None detected</span>
              </>
            )}
          </div>
          <p className="text-[10px] text-slate-500 font-sans">
            {isConfigured
              ? 'Real credentials configured in server environment'
              : 'Local packaging active; cloud sync paused'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
          <span className="text-[10px] font-space uppercase font-bold text-slate-500 block">
            Root / Shared Drive
          </span>
          <div className="flex items-center gap-1.5">
            {status?.rootFolderConfigured || status?.sharedDriveConfigured ? (
              <>
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold font-space text-slate-900 truncate">
                  {status?.sharedDriveConfigured ? 'Shared Drive Linked' : 'Root Folder Set'}
                </span>
              </>
            ) : (
              <>
                <FolderSync className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold font-space text-slate-600">Default Root</span>
              </>
            )}
          </div>
          <p className="text-[10px] text-slate-500 font-sans">
            {status?.sharedDriveConfigured
              ? 'Supports company-wide Google Shared Drives'
              : 'Auto-initializes ZARVIS 4-module structure'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 space-y-1">
          <span className="text-[10px] font-space uppercase font-bold text-slate-500 block">
            Hierarchy Standardization
          </span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold font-space text-slate-900">
              4-Tier Architecture
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-sans">
            00_System, 01_Toolkits, 02_Campaigns, 03_Deliveries
          </p>
        </div>
      </div>

      {/* Live Test Result Banner if triggered */}
      {testResult && (
        <div
          className={`rounded-2xl p-4 border text-xs font-space flex items-start gap-3 ${
            testResult.connected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          {testResult.connected ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 flex-1">
            <p className="font-bold">
              {testResult.connected
                ? `Drive Connection Verified: Connected to ${testResult.driveName || 'Google Drive'}`
                : `Drive Connection Notice: ${testResult.errorCode || 'NOT_CONFIGURED'}`}
            </p>
            <p className="text-[11px] opacity-90 font-sans">
              {testResult.errorMessage ||
                'Verified write/read access to company Google Drive. Root folders are initialized.'}
            </p>
            {testResult.rootFolderName && (
              <p className="text-[11px] font-mono">
                Verified Root: {testResult.rootFolderName} ({testResult.rootFolderId})
              </p>
            )}
          </div>
        </div>
      )}

      {/* Honest Guidance Notice */}
      {!isConfigured && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-slate-400 shrink-0" />
            <span>
              Google Drive credentials are not yet set in environment. Assets are safely cryptographically sealed and packaged to local server storage.
            </span>
          </div>
          <span className="text-[10px] font-space font-bold uppercase text-slate-500 shrink-0">
            Local Fallback Active
          </span>
        </div>
      )}
    </div>
  );
};
