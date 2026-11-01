import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Submission, SubmissionComment } from '../types';
import {
  UserCheck,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  SlidersHorizontal,
  Clock,
  User,
} from 'lucide-react';

interface PeerReviewSectionProps {
  submission: Submission;
  onCommentAdded?: (newComment: SubmissionComment) => void;
  className?: string;
}

const SUPERVISOR_QUICK_CHIPS = [
  { label: 'Approved for Deployment', text: 'Appointed supervisor sign-off granted. Visuals, safe zones, and branding meet all guidelines.' },
  { label: 'Increase 6% Margin', text: 'Rework directive: Please increase text and logo clearance from the outer edges to at least 6%.' },
  { label: 'Enhance Contrast', text: 'Rework directive: Text has low contrast against the background image. Please darken background or use high-contrast tint.' },
  { label: 'Verify Contact & Legal', text: 'Directive: Ensure helpline telephone, social handle, and legal disclaimer are fully accurate and legible.' },
];

export const PeerReviewSection: React.FC<PeerReviewSectionProps> = ({
  submission,
  onCommentAdded,
  className = '',
}) => {
  const { currentUser, currentRole } = useAuth();

  const [commentText, setCommentText] = useState('');
  const [selectedVerdict, setSelectedVerdict] = useState<'APPROVED' | 'SUGGESTION' | 'QUESTION'>('SUGGESTION');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [localComments, setLocalComments] = useState<SubmissionComment[]>(submission?.comments || []);

  const supervisorName = submission?.assignedSupervisorName || 'Marcus Vance';
  const isCurrentUserTheSupervisor =
    (currentUser?.role === 'SUPERVISOR' && (currentUser?.name === supervisorName || submission?.assignedSupervisorId === currentUser?.id)) ||
    currentUser?.role === 'ADMIN';

  useEffect(() => {
    const initialComments = submission?.comments || [];
    const uniqueMap = new Map<string, SubmissionComment>();
    initialComments.forEach((c) => uniqueMap.set(c.id, c));
    setLocalComments(Array.from(uniqueMap.values()));

    if (submission?.id) {
      api.getComments(submission.id)
        .then((fetched) => {
          if (Array.isArray(fetched) && fetched.length > 0) {
            setLocalComments((prev) => {
              const mergedMap = new Map<string, SubmissionComment>();
              prev.forEach((c) => mergedMap.set(c.id, c));
              fetched.forEach((c) => mergedMap.set(c.id, c));
              return Array.from(mergedMap.values());
            });
          }
        })
        .catch(() => {});
    }
  }, [submission?.id, submission?.comments?.length]);

  if (!submission) {
    return (
      <div className={`rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 ${className}`}>
        <p className="text-xs font-syne font-bold">No submission selected for supervisor directives</p>
      </div>
    );
  }

  const rawComments = localComments.length > 0 ? localComments : (submission?.comments || []);
  const commentsMap = new Map<string, SubmissionComment>();
  rawComments.forEach((c) => commentsMap.set(c.id, c));
  const comments = Array.from(commentsMap.values());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const isSupervisorAction = isCurrentUserTheSupervisor || currentRole === 'SUPERVISOR' || currentRole === 'ADMIN';
      const commentPayload = {
        userId: currentUser?.id || 'usr-supervisor',
        userName: currentUser?.name || supervisorName,
        userRole: currentRole,
        userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: commentText.trim(),
        type: isSupervisorAction ? ('SUPERVISOR_DIRECTIVE' as any) : ('PEER_REVIEW' as const),
        peerTag: isSupervisorAction ? 'SUPERVISOR_NOTE' : 'EMPLOYEE_INQUIRY',
        peerVerdict: selectedVerdict,
      };

      const added = await api.addComment(submission.id, commentPayload);
      setLocalComments((prev) => {
        if (prev.some((c) => c.id === added.id)) return prev;
        return [...prev, added];
      });
      if (submission.comments) {
        if (!submission.comments.some((c) => c.id === added.id)) {
          submission.comments.push(added);
        }
      } else {
        submission.comments = [added];
      }
      if (onCommentAdded) {
        onCommentAdded(added);
      }
      setCommentText('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to post supervisor review comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyChip = (text: string) => {
    setCommentText(text);
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 ${className}`}>
      {/* Appointed Supervisor Designation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-[#ff5000] border border-orange-200">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-syne text-slate-900">
                Appointed Supervisor Review &amp; Directives
              </h3>
              <span className="rounded-full bg-slate-900 text-white px-2 py-0.2 text-[10px] font-bold font-space uppercase">
                1-on-1 Review
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Designated review supervisor: <strong className="text-slate-800 font-syne">{supervisorName}</strong>. Direct feedback between creator and appointed supervisor.
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {submission.workflowStatus === 'APPROVED' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold font-space text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Supervisor Cleared</span>
            </span>
          ) : submission.workflowStatus === 'CHANGES_REQUESTED' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold font-space text-amber-700">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              <span>Directives Pending Rework</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold font-space text-blue-700">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              <span>Awaiting Supervisor Review</span>
            </span>
          )}
        </div>
      </div>

      {/* Feed of supervisor directives and creator communication */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center">
            <MessageSquare className="mx-auto h-6 w-6 text-slate-300 mb-1.5" />
            <p className="text-xs font-semibold text-slate-600 font-syne">No supervisor directives logged yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isCurrentUserTheSupervisor
                ? 'Issue directives, suggestions, or sign-off below.'
                : `Submit inquiries or notes directly to appointed supervisor ${supervisorName}.`}
            </p>
          </div>
        ) : (
          comments.map((comment, idx) => {
            const isSupervisorRole =
              comment.userRole === 'SUPERVISOR' ||
              comment.userRole === 'ADMIN' ||
              comment.userName === supervisorName;
            const isApproved = comment.peerVerdict === 'APPROVED';
            const isQuestion = comment.peerVerdict === 'QUESTION';

            return (
              <div
                key={`${comment.id}-${idx}`}
                className={`rounded-xl border p-3.5 text-xs transition-all ${
                  isSupervisorRole
                    ? 'border-orange-200/70 bg-orange-50/40 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold font-syne text-slate-900">{comment.userName}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-space font-bold uppercase tracking-wider ${
                        isSupervisorRole
                          ? 'bg-slate-900 text-white'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {isSupervisorRole ? 'Appointed Supervisor' : 'Creator'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold font-space">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>Sign-off Ready</span>
                      </span>
                    ) : isQuestion ? (
                      <span className="inline-flex items-center gap-1 rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold font-space">
                        <HelpCircle className="h-3 w-3 text-blue-600" />
                        <span>Inquiry</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold font-space">
                        <AlertCircle className="h-3 w-3 text-amber-600" />
                        <span>Directive</span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-800 font-sans leading-relaxed pl-8">
                  {comment.content}
                </p>

                <div className="mt-1 pl-8 text-[10px] text-slate-400 font-space">
                  {new Date(comment.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 1-Click Supervisor Directive Templates */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-700 font-space block mb-2 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff5000]" /> Quick Supervisor Directives:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUPERVISOR_QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyChip(chip.text)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700 hover:bg-orange-50 hover:border-orange-200 hover:text-[#ff5000] transition-colors cursor-pointer font-sans"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directive / Message Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold font-syne text-slate-800">
            {isCurrentUserTheSupervisor ? 'Issue Directive as Appointed Supervisor' : 'Send Message to Supervisor'}:
          </span>

          {/* Quick status selector */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedVerdict('APPROVED')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold font-space transition-all cursor-pointer ${
                selectedVerdict === 'APPROVED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Sign-off
            </button>
            <button
              type="button"
              onClick={() => setSelectedVerdict('SUGGESTION')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold font-space transition-all cursor-pointer ${
                selectedVerdict === 'SUGGESTION'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Directive
            </button>
            <button
              type="button"
              onClick={() => setSelectedVerdict('QUESTION')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold font-space transition-all cursor-pointer ${
                selectedVerdict === 'QUESTION'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Inquiry
            </button>
          </div>
        </div>

        <textarea
          rows={2}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={
            isCurrentUserTheSupervisor
              ? 'Specify precise directives or sign-off instructions for the creator...'
              : `Type your question or response for supervisor ${supervisorName}...`
          }
          className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#ff5000] focus:ring-1 focus:ring-[#ff5000] outline-hidden resize-none font-sans"
        />

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-space">
            Direct communication tied to this creative version lifecycle.
          </span>

          <div className="flex items-center gap-2">
            {submitSuccess && (
              <span className="text-[11px] font-bold text-emerald-600 font-space flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Directive logged!
              </span>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-bold font-syne text-white hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
            >
              <Send className="h-3 w-3" />
              <span>{isSubmitting ? 'Posting...' : 'Post Directive'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
