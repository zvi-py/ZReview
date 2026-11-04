import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { BrandLogo } from './BrandLogo';
import { Floating3DBackground } from './Floating3DBackground';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Loader2,
  Paintbrush,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickLogin = async (email: string, role: UserRole, roleTitle: string) => {
    setIsLoading(true);
    setLoadingRole(roleTitle);
    setError(null);
    try {
      await login(email, role, 'password123');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingRole(null);
    }
  };

  const personas = [
    {
      id: 'creator',
      role: 'EMPLOYEE' as UserRole,
      email: 'alex.rivera@zarvis.ai',
      name: 'Alex Rivera',
      title: 'Lead AI Engineer & Poster Creator',
      badge: 'Creator Workspace',
      badgeColor: 'bg-[#FFF0F5] text-[#D82666] border-[#FFD0E0]',
      actionLabel: 'Enter as Creator',
      description: 'Upload campaign posters, run real-time multimodal AI evaluations, and view instant "Why to Change" directives.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      icon: Paintbrush,
    },
    {
      id: 'supervisor',
      role: 'SUPERVISOR' as UserRole,
      email: 'elena.rostova@zarvis.ai',
      name: 'Elena Rostova',
      title: 'VP of Brand Quality & QC Lead',
      badge: 'Supervisor Desk (≥85%)',
      badgeColor: 'bg-[#EBF5E9] text-[#244A20] border-[#BED8B9]',
      actionLabel: 'Enter as Supervisor',
      description: 'Review pre-screened posters that scored ≥85% on Brand Toolkits & Meta Rules, and execute final human sign-offs.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      icon: UserCheck,
    },
    {
      id: 'admin',
      role: 'ADMIN' as UserRole,
      email: 'david.sterling@zarvis.ai',
      name: 'David Sterling',
      title: 'Executive Director & Policy Admin',
      badge: 'Governance & Thresholds',
      badgeColor: 'bg-[#FAF8F3] text-[#3D4F3B] border-[#E8E3D5]',
      actionLabel: 'Enter as Admin',
      description: 'Configure approval score thresholds, manage brand rule parameters, and inspect team velocity reports.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF7EE] text-[#182817] flex flex-col justify-between font-sans selection:bg-[#2E5629] selection:text-white overflow-hidden">
      {/* 3D Moving Matcha & Strawberry Cream Orbs */}
      <Floating3DBackground />

      {/* Top Application Header */}
      <header className="relative z-20 flex h-18 w-full items-center justify-between border-b border-[#E8E3D5] bg-[#FAF7EE]/90 backdrop-blur-xl px-5 sm:px-8 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur-md shadow-xs ring-1 ring-[#FFD0E0]/80 p-0.5">
            <BrandLogo size={32} />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-[#182817] text-lg font-syne leading-none block">
              ZReview
            </span>
            <span className="text-[10px] font-space text-[#677A65] font-semibold tracking-wider uppercase">
              Media Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-[#E8E3D5] px-3 py-1 text-xs font-semibold text-[#182817] shadow-2xs backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2E5629]" />
            <span>Instant Access</span>
          </span>
        </div>
      </header>

      {/* Main Stage: Simple, Elegant "Enter As" Selection */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-5xl mx-auto w-full">
        {/* Title Header */}
        <div className="text-center space-y-2.5 max-w-2xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF5E9] border border-[#BED8B9] px-3.5 py-1 text-xs font-bold text-[#244A20] font-syne shadow-2xs backdrop-blur-md">
            <span>Multimodal Vision Compliance Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#182817] font-syne">
            Enter Workspace
          </h1>

          <p className="text-xs sm:text-sm text-[#526850] font-sans max-w-lg mx-auto">
            Choose your role to instantly test the 85% Score Gate, poster pre-flight AI audits, and supervisor review.
          </p>
        </div>

        {error && (
          <div className="w-full max-w-md mb-6 rounded-2xl bg-[#FFF0F5] border border-[#FFD0E0] p-3 text-xs font-semibold text-[#D82666] text-center">
            {error}
          </div>
        )}

        {/* 3 Simple, Clean "Enter As" Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl">
          {personas.map((p) => {
            const isThisLoading = isLoading && loadingRole === p.actionLabel;

            return (
              <div
                key={p.id}
                onClick={() => !isLoading && handleQuickLogin(p.email, p.role, p.actionLabel)}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white/95 hover:bg-white transition-all text-left border border-[#E8E3D5] hover:border-[#BED8B9] shadow-sm hover:shadow-xl hover:shadow-[#2E5629]/10 cursor-pointer backdrop-blur-xl"
              >
                <div>
                  {/* Role Badge & Indicator (No photo fixture) */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-bold font-syne ${p.badgeColor}`}
                    >
                      {p.badge}
                    </span>
                    <span className="text-[10px] font-space text-[#677A65]">Quick Access</span>
                  </div>

                  {/* Name & Title */}
                  <h3 className="text-base font-bold font-syne text-[#182817] group-hover:text-[#2E5629] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#526850] font-medium mt-0.5">
                    {p.title}
                  </p>
                  <p className="text-[11px] text-[#8E9F8C] font-mono mt-0.5">
                    {p.email}
                  </p>

                  {/* Brief description */}
                  <p className="text-xs text-[#3D4F3B] font-sans mt-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Big Clean "Enter as..." Button */}
                <div className="pt-4 mt-5 border-t border-[#F0ECE1]">
                  <button
                    type="button"
                    disabled={isLoading}
                    className="w-full flex items-center justify-between rounded-xl bg-[#182817] group-hover:bg-[#2E5629] text-white px-4 py-2.5 text-xs font-bold font-syne transition-all cursor-pointer shadow-xs"
                  >
                    {isThisLoading ? (
                      <span className="flex items-center gap-2 mx-auto">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Entering...</span>
                      </span>
                    ) : (
                      <>
                        <span>{p.actionLabel}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Simple Clean Footer */}
      <footer className="w-full border-t border-[#E8E3D5] bg-white/70 py-4 px-6 text-center text-xs text-[#677A65] font-space backdrop-blur-md">
        ZReview Media Intelligence &copy; 2026 &bull; AI Creative Compliance &amp; 85% Approval Gate
      </footer>
    </div>
  );
};
