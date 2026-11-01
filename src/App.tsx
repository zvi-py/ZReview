import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './api';
import { Submission, Brand } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { ManagerReviewScreen } from './components/ManagerReviewScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalyticsView } from './components/AnalyticsView';
import { BrandGuidelinesView } from './components/BrandGuidelinesView';
import { AuditLogView } from './components/AuditLogView';
import { NewSubmissionModal } from './components/NewSubmissionModal';
import { ScoreReportModal } from './components/ScoreReportModal';
import { ReworkModal } from './components/ReworkModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { ClientShareModal } from './components/ClientShareModal';
import { ClientReviewPortal } from './components/ClientReviewPortal';
import { ResumeShowcaseModal } from './components/ResumeShowcaseModal';
import { ArchitecturalShowcase } from './components/ArchitecturalShowcase';
import { ZReviewVideoDemoModal } from './components/ZReviewVideoDemoModal';
import { LoginPage } from './components/LoginPage';
import { Loader2 } from 'lucide-react';

function ZMain() {
  const {
    currentUser,
    isAuthLoading,
    currentRole,
    activeTab,
    setActiveTab,
    refreshNotifications,
  } = useAuth();

  const mainRef = React.useRef<HTMLElement>(null);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal / Active Screen States
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isResumeShowcaseOpen, setIsResumeShowcaseOpen] = useState(false);
  const [isNewSubmissionOpen, setIsNewSubmissionOpen] = useState(false);
  const [selectedSubmissionForReport, setSelectedSubmissionForReport] = useState<Submission | null>(
    null
  );
  const [selectedSubmissionForRework, setSelectedSubmissionForRework] = useState<Submission | null>(
    null
  );
  const [selectedSubmissionForVersions, setSelectedSubmissionForVersions] =
    useState<Submission | null>(null);
  const [activeReviewSubmission, setActiveReviewSubmission] = useState<Submission | null>(null);
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);
  const [selectedSubmissionForClientShare, setSelectedSubmissionForClientShare] = useState<Submission | null>(null);

  const [clientPortalSubId, setClientPortalSubId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('clientShare') || params.get('clientReview') || params.get('subId') || null;
    }
    return null;
  });

  // Ensure view resets to top on initial login and tab change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeTab, currentUser?.id]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async (retryCount = 0) => {
    try {
      const [subs, bList] = await Promise.all([api.getSubmissions(), api.getBrands()]);
      setSubmissions(Array.isArray(subs) ? subs : []);
      setBrands(Array.isArray(bList) ? bList : []);
    } catch (err) {
      if (retryCount < 3) {
        setTimeout(() => loadInitialData(retryCount + 1), 500 * (retryCount + 1));
        return;
      }
      console.warn('Could not load initial submissions from server, using empty list fallback:', err);
      setSubmissions([]);
      setBrands([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmissionCreated = (newSub: Submission) => {
    setSubmissions((prev) => [newSub, ...prev]);
    setIsNewSubmissionOpen(false);
    setSelectedSubmissionForReport(newSub);
    refreshNotifications();
  };

  const handleVersionCreated = (updatedSub: Submission) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updatedSub.id ? updatedSub : s)));
    setSelectedSubmissionForRework(null);
    setSelectedSubmissionForReport(updatedSub);
    refreshNotifications();
  };

  const handleManagerReview = async (
    submissionId: string,
    decision: 'APPROVED' | 'REQUEST_CHANGES' | 'REJECTED',
    comment?: string
  ) => {
    try {
      const reviewer = {
        id: currentUser?.id || 'usr-nminds-admin',
        name: currentUser?.name || 'NMinds Admin',
      };

      const updated = await api.reviewSubmission(
        submissionId,
        decision,
        reviewer.id,
        reviewer.name,
        comment
      );

      setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      if (selectedSubmissionForReport?.id === updated.id) {
        setSelectedSubmissionForReport(updated);
      }
      if (activeReviewSubmission?.id === updated.id) {
        setActiveReviewSubmission(null);
      }
      refreshNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const openSubmissionById = (id: string) => {
    const sub = submissions.find((s) => s.id === id);
    if (sub) {
      setSelectedSubmissionForReport(sub);
    }
  };

  if (clientPortalSubId) {
    return (
      <ClientReviewPortal
        submissionId={clientPortalSubId}
        onExit={() => {
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('clientShare');
            url.searchParams.delete('clientReview');
            url.searchParams.delete('subId');
            window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
          }
          setClientPortalSubId(null);
        }}
      />
    );
  }

  if (isAuthLoading || (currentUser && isLoading)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#ff5000]" />
          <span className="text-xs font-bold font-space tracking-wider uppercase text-slate-400">
            Initializing Z Enterprise Suite...
          </span>
        </div>
      </div>
    );
  }

  // If user is not authenticated, render Login Page
  if (!currentUser) {
    return <LoginPage onSuccess={() => loadInitialData()} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Application Header */}
      <Header
        onOpenNewSubmission={() => setIsNewSubmissionOpen(true)}
        onSelectSubmission={openSubmissionById}
        onToggleMenu={() => setIsSidebarDrawerOpen(true)}
        onOpenResumeShowcase={() => setIsResumeShowcaseOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Responsive Role-Driven Slide-over Sidebar Drawer */}
        <Sidebar
          isOpen={isSidebarDrawerOpen}
          onClose={() => setIsSidebarDrawerOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewSubmission={() => setIsNewSubmissionOpen(true)}
        />

        {/* Dynamic Content Viewport */}
        {activeTab === 'showcase' || activeTab === 'dashboard' ? (
          <div className="flex-1 overflow-hidden min-h-0">
            <ArchitecturalShowcase
              submissions={submissions}
              brands={brands}
              onSelectSubmission={(sub) => setSelectedSubmissionForReport(sub)}
              onOpenScoreReport={(sub) => setSelectedSubmissionForReport(sub)}
              onOpenNewSubmission={() => setIsNewSubmissionOpen(true)}
              onOpenArchitectureModal={() => setIsResumeShowcaseOpen(true)}
              onOpenDemo={() => setIsDemoOpen(true)}
              onSwitchToWorkspace={(tab) => {
                if (tab) setActiveTab(tab);
                else if (currentRole === 'ADMIN') setActiveTab('submissions');
                else if (currentRole === 'SUPERVISOR') setActiveTab('queue');
                else setActiveTab('creatives');
              }}
            />
          </div>
        ) : (
          <main ref={mainRef} className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 bg-white">
            <div className="mx-auto max-w-7xl">
              {/* If actively in detailed review mode */}
              {activeReviewSubmission ? (
                <ManagerReviewScreen
                  submission={activeReviewSubmission}
                  onBack={() => setActiveReviewSubmission(null)}
                  onManagerReview={handleManagerReview}
                />
              ) : (
                <>
                  {/* 1. EMPLOYEE VIEWS: Exclusively Employee Dashboard on Main Page */}
                  {currentRole === 'EMPLOYEE' && (
                    <>
                      {activeTab === 'brands' ? (
                        <BrandGuidelinesView />
                      ) : activeTab === 'analytics' ? (
                        <AnalyticsView />
                      ) : (
                        <EmployeeDashboard
                          submissions={submissions}
                          initialView={
                            activeTab === 'peer-review'
                              ? 'peer-review'
                              : 'creatives'
                          }
                          activeTab={activeTab}
                          onTabChange={(tab) => setActiveTab(tab)}
                          onOpenNewSubmission={() => setIsNewSubmissionOpen(true)}
                          onSelectSubmission={(sub) => setSelectedSubmissionForReport(sub)}
                          onOpenRework={(sub) => setSelectedSubmissionForRework(sub)}
                          onOpenDemo={() => setIsDemoOpen(true)}
                        />
                      )}
                    </>
                  )}

                  {/* 2. ADMIN VIEWS */}
                  {currentRole === 'ADMIN' && (
                    <>
                      {activeTab === 'audit-logs' ? (
                        <AuditLogView />
                      ) : (
                        <AdminDashboard
                          initialTab={
                            activeTab === 'client-ready'
                              ? 'client-ready'
                              : activeTab === 'employee-report' || activeTab === 'employee-progress'
                              ? 'employee-report'
                              : activeTab === 'impact'
                              ? 'impact'
                              : activeTab === 'submissions'
                              ? 'submissions'
                              : activeTab === 'velocity'
                              ? 'velocity'
                              : activeTab === 'peer-review'
                              ? 'peer-review'
                              : activeTab === 'brands'
                              ? 'brands'
                              : activeTab === 'projects'
                              ? 'projects'
                              : 'client-ready'
                          }
                          onSelectSubmission={(sub) => setSelectedSubmissionForReport(sub)}
                          onOpenNewSubmission={() => setIsNewSubmissionOpen(true)}
                        />
                      )}
                    </>
                  )}

                  {/* 3. SUPERVISOR VIEWS */}
                  {currentRole === 'SUPERVISOR' && (
                    <>
                      {activeTab === 'brands' ? (
                        <BrandGuidelinesView />
                      ) : (
                        <SupervisorDashboard
                          submissions={submissions}
                          initialTab={
                            activeTab === 'campaigns'
                              ? 'campaigns'
                              : activeTab === 'velocity'
                              ? 'velocity'
                              : activeTab === 'peer-review'
                              ? 'peer-review'
                              : 'queue'
                          }
                          onSelectSubmission={(sub) => setSelectedSubmissionForReport(sub)}
                          onOpenNewSubmission={() => setIsNewSubmissionOpen(true)}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </main>
        )}
      </div>

      {/* MODAL 1: New Submission Wizard */}
      <NewSubmissionModal
        isOpen={isNewSubmissionOpen}
        onClose={() => setIsNewSubmissionOpen(false)}
        onSubmissionComplete={handleSubmissionCreated}
        onOpenScoreReport={(sub) => setSelectedSubmissionForReport(sub)}
        onShareWithClient={(sub) => setSelectedSubmissionForClientShare(sub)}
      />

      {/* MODAL 2: Dedicated Detailed Score Report View */}
      <ScoreReportModal
        isOpen={!!selectedSubmissionForReport}
        submission={selectedSubmissionForReport}
        onClose={() => setSelectedSubmissionForReport(null)}
        onOpenRework={(sub) => {
          setSelectedSubmissionForReport(null);
          setSelectedSubmissionForRework(sub);
        }}
        onManagerReview={handleManagerReview}
      />

      {/* MODAL 3: Employee Rework & Version Submission Modal */}
      <ReworkModal
        isOpen={!!selectedSubmissionForRework}
        submission={selectedSubmissionForRework}
        onClose={() => setSelectedSubmissionForRework(null)}
        onVersionCreated={handleVersionCreated}
      />

      {/* MODAL 4: Version Progression Timeline Modal */}
      <VersionHistoryModal
        isOpen={!!selectedSubmissionForVersions}
        submission={selectedSubmissionForVersions}
        onClose={() => setSelectedSubmissionForVersions(null)}
      />

      {/* MODAL 5: Dedicated Client Direct Share Modal */}
      {selectedSubmissionForClientShare && (
        <ClientShareModal
          isOpen={!!selectedSubmissionForClientShare}
          submission={selectedSubmissionForClientShare}
          brand={brands.find((b) => b.id === selectedSubmissionForClientShare.brandId)}
          onClose={() => setSelectedSubmissionForClientShare(null)}
          onUpdated={(updated) => {
            setSubmissions((prev) =>
              prev.map((s) => (s.id === updated.id ? updated : s))
            );
            if (selectedSubmissionForReport?.id === updated.id) {
              setSelectedSubmissionForReport(updated);
            }
            setSelectedSubmissionForClientShare(updated);
          }}
        />
      )}

      {/* MODAL 6: Resume & System Architecture Walkthrough */}
      <ResumeShowcaseModal
        isOpen={isResumeShowcaseOpen}
        onClose={() => setIsResumeShowcaseOpen(false)}
        onSelectSubmission={openSubmissionById}
        onOpenClientPortal={() => setClientPortalSubId('SUB-102')}
      />

      {/* MODAL 7: ZReview Interactive Product Tour & System Video Demo */}
      <ZReviewVideoDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onOpenNewSubmission={() => {
          setIsDemoOpen(false);
          setIsNewSubmissionOpen(true);
        }}
        onSetThreshold={(threshold) => {
          // Live threshold adjustment in interactive demo
          console.log('Demo threshold set to:', threshold);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ZMain />
    </AuthProvider>
  );
}
