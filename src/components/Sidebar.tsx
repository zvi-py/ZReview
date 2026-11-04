import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import {
  TrendingUp,
  FolderKanban,
  Sliders,
  ScrollText,
  Building2,
  BarChart3,
  Plus,
  Shield,
  CalendarPlus,
  LogOut,
  Clock,
  Users,
  UserCheck,
  CheckCircle2,
  X,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewSubmission: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenNewSubmission,
}) => {
  const { currentRole, currentUser, logout } = useAuth();

  const employeeNav: NavItem[] = [
    { id: 'showcase', label: 'Architectural Showcase', icon: CheckCircle2, badge: 'New' },
    { id: 'creatives', label: 'My Posters', icon: FolderKanban },
    { id: 'peer-review', label: 'Supervisor Feedback', icon: UserCheck },
    { id: 'brands', label: 'Brand Guidelines', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const adminNav: NavItem[] = [
    { id: 'showcase', label: 'Architectural Showcase', icon: CheckCircle2, badge: 'New' },
    { id: 'client-ready', label: 'Client-Ready Posters', icon: CheckCircle2, badge: 'Approved' },
    { id: 'submissions', label: 'All Posters', icon: FolderKanban },
    { id: 'employee-report', label: 'Team Reports', icon: Users },
    { id: 'projects', label: 'Campaign Projects', icon: CalendarPlus },
    { id: 'brands', label: 'Brand Rules', icon: Building2 },
    { id: 'impact', label: 'AI Impact', icon: TrendingUp },
    { id: 'audit-logs', label: 'Audit Trail', icon: ScrollText },
  ];

  const supervisorNav: NavItem[] = [
    { id: 'showcase', label: 'Architectural Showcase', icon: CheckCircle2, badge: 'New' },
    { id: 'queue', label: 'Review Queue', icon: FolderKanban },
    { id: 'campaigns', label: 'Assigned Campaigns', icon: CalendarPlus },
    { id: 'peer-review', label: 'Directives & Feedback', icon: UserCheck },
    { id: 'brands', label: 'Brand Guidelines', icon: Building2 },
  ];

  const navItems =
    currentRole === 'ADMIN'
      ? adminNav
      : currentRole === 'SUPERVISOR'
      ? supervisorNav
      : employeeNav;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <aside className="relative ml-auto flex h-full w-80 max-w-full flex-col justify-between bg-white p-6 shadow-2xl border-l border-slate-200 z-50 animate-in slide-in-from-right duration-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur-md shadow-xs ring-1 ring-[#FFD0E0]/80 p-0.5">
                <BrandLogo size={24} />
              </div>
              <span className="font-extrabold font-syne text-slate-900 tracking-tight text-base">
                ZReview Navigation
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Action Button - Employee Only */}
          {currentRole === 'EMPLOYEE' && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNewSubmission();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff5000] hover:bg-[#e04600] px-4 py-3 text-xs font-bold font-syne text-white shadow-md shadow-[#ff5000]/25 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Upload New Creative</span>
            </button>
          )}

          {/* Navigation Links */}
          <div className="space-y-2">
            <span className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400 px-2 block">
              Workspace Perspectives
            </span>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (currentRole === 'ADMIN' && activeTab === 'dashboard' && item.id === 'submissions');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-syne transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 ${
                          isActive ? 'text-[#ff5000]' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="rounded-full bg-[#ff5000]/15 text-[#ff5000] px-2 py-0.5 text-[9px] font-space font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info (No photo fixture, clean name & role) */}
        {currentUser && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex flex-col text-left">
              <p className="font-bold text-slate-900 font-syne">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 font-space">{currentUser.role}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-2 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
