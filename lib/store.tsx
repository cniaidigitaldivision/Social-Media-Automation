"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Type definitions based on store.js
export type Workspace = {
  id: string;
  name: string;
  accountsCount: number;
  isCurrent: boolean;
  logoText: string;
};

export type AppState = {
  currentScreen: string;
  auth: {
    isLoggedIn: boolean;
    user: {
      name: string;
      email: string;
      role: string;
      avatarInitials: string;
    };
  };
  workspaces: Workspace[];
  currentWorkspace: string;
  approvalRequiredForWorkspace: boolean;
  metrics: {
    scheduledThisWeek: number;
    scheduledTrend: string;
    pendingApprovals: number;
    connectedAccounts: number;
    failedPublishes: number;
  };
  recentActivities: any[];
  upcomingPosts: any[];
  calendar: any;
  approvals: any;
  connectedAccounts: any[];
  postStatusDetail: any;
  leadsCRM: any;
  modals: any;
};

const initialState: AppState = {
  currentScreen: 'dashboard',
  auth: {
    isLoggedIn: true,
    user: {
      name: '',
      email: '',
      role: '',
      avatarInitials: ''
    }
  },
  workspaces: [],
  currentWorkspace: '',
  approvalRequiredForWorkspace: true,
  metrics: {
    scheduledThisWeek: 0,
    scheduledTrend: '',
    pendingApprovals: 0,
    connectedAccounts: 0,
    failedPublishes: 0
  },
  recentActivities: [],
  upcomingPosts: [],
  calendar: {
    viewMode: 'month',
    currentMonth: 'October 2023',
    selectedDate: '2023-10-24',
    isDrawerOpen: true,
    drawerDateTitle: 'October 24, 2023',
    filterPlatform: 'all',
    filterStatus: 'all',
    scheduledList: []
  },
  approvals: {
    activeTab: 'pending',
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    items: []
  },
  connectedAccounts: [],
  postStatusDetail: null,
  leadsCRM: {
    metrics: {
      newLeadsThisMonth: 0,
      newLeadsTrend: '',
      totalLeads: 0,
      qualifiedLeads: 0,
      lostLeads: 0,
      lostLeadsTrend: ''
    },
    filterStatus: 'all',
    searchQuery: '',
    dateRange: 'Last 30 days',
    leadsList: []
  },
  modals: {
    isWorkspaceSwitcherOpen: false,
    isNewWorkspaceModalOpen: false,
    isLeadDetailOpen: false,
    selectedLead: null,
    isFullPreviewOpen: false,
    previewPostData: null,
    isNotificationsOpen: false,
    isSoundEnabled: true,
    isRequestChangesOpen: false,
    isOAuthModalOpen: false,
    oauthPlatform: null
  }
};

type AppContextType = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateState: (updates: Partial<AppState>) => void;
  // Specific Actions
  setWorkspace: (name: string) => void;
  toggleWorkspaceSwitcher: (open?: boolean) => void;
  toggleApprovalRequired: () => void;
  approvePost: (id: string) => void;
  rejectPost: (id: string) => void;
  retryPipelinePlatform: (id: string) => void;
  refreshToken: (id: string) => void;
  addLead: (lead: any) => void;
  openFullPostPreview: (postData: any) => void;
  openRequestChangesModal: (id?: string) => void;
  closeModals: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const setWorkspace = (name: string) => {
    setState(prev => ({
      ...prev,
      currentWorkspace: name,
      workspaces: prev.workspaces.map(ws => ({ ...ws, isCurrent: ws.name === name })),
      modals: { ...prev.modals, isWorkspaceSwitcherOpen: false }
    }));
  };

  const toggleWorkspaceSwitcher = (open?: boolean) => {
    setState(prev => ({
      ...prev,
      modals: { ...prev.modals, isWorkspaceSwitcherOpen: open !== undefined ? open : !prev.modals.isWorkspaceSwitcherOpen }
    }));
  };

  const toggleApprovalRequired = () => {
    setState(prev => ({
      ...prev,
      approvalRequiredForWorkspace: !prev.approvalRequiredForWorkspace
    }));
  };

  const approvePost = (id: string) => {
    setState(prev => {
      const newItems = prev.approvals.items.filter((i: any) => i.id !== id);
      const newPendingCount = Math.max(0, prev.approvals.pendingCount - 1);
      return {
        ...prev,
        approvals: {
          ...prev.approvals,
          items: newItems,
          pendingCount: newPendingCount,
          approvedCount: prev.approvals.approvedCount + 1
        },
        metrics: {
          ...prev.metrics,
          pendingApprovals: newPendingCount
        }
      };
    });
  };

  const rejectPost = (id: string) => {
    setState(prev => {
      const newItems = prev.approvals.items.filter((i: any) => i.id !== id);
      const newPendingCount = Math.max(0, prev.approvals.pendingCount - 1);
      return {
        ...prev,
        approvals: {
          ...prev.approvals,
          items: newItems,
          pendingCount: newPendingCount,
          rejectedCount: prev.approvals.rejectedCount + 1
        },
        metrics: {
          ...prev.metrics,
          pendingApprovals: newPendingCount
        }
      };
    });
  };

  const retryPipelinePlatform = (id: string) => {
    setState(prev => {
      if (!prev.postStatusDetail) return prev;
      const newPipeline = prev.postStatusDetail.pipeline.map((p: any) => {
        if (p.id === id) {
          return { ...p, status: 'Publishing...', statusType: 'warning' };
        }
        return p;
      });
      return {
        ...prev,
        postStatusDetail: { ...prev.postStatusDetail, pipeline: newPipeline }
      };
    });

    setTimeout(() => {
      setState(prev => {
        if (!prev.postStatusDetail) return prev;
        const newPipeline = prev.postStatusDetail.pipeline.map((p: any) => {
          if (p.id === id) {
            return { 
              ...p, 
              status: 'Published', 
              statusType: 'success', 
              actionType: 'link', 
              hasErrorBanner: false 
            };
          }
          return p;
        });
        return {
          ...prev,
          postStatusDetail: { 
            ...prev.postStatusDetail, 
            pipeline: newPipeline,
            isError: false,
            bannerMessage: 'All platforms published successfully!',
            bannerSubtitle: 'Your post is now live across Facebook, Instagram, LinkedIn, and X.'
          },
          metrics: {
            ...prev.metrics,
            failedPublishes: Math.max(0, prev.metrics.failedPublishes - 1)
          }
        };
      });
    }, 1400);
  };

  const refreshToken = (id: string) => {
    setState(prev => ({
      ...prev,
      connectedAccounts: prev.connectedAccounts.map((a: any) => 
        a.id === id ? { ...a, isRefreshing: true } : a
      )
    }));

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        connectedAccounts: prev.connectedAccounts.map((a: any) => 
          a.id === id ? { 
            ...a, 
            isRefreshing: false,
            status: 'Connected',
            statusType: 'success',
            expiryText: 'Expires in 60 days',
            actionText: 'Refresh Token',
            actionIcon: 'refresh'
          } : a
        )
      }));
    }, 1200);
  };

  const addLead = (leadData: any) => {
    setState(prev => {
      const newLead = {
        id: `lead-${Date.now()}`,
        name: leadData.name || 'New Lead',
        initials: (leadData.name || 'NL').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
        phone: leadData.phone || '+1 (555) 000-0000',
        source: leadData.source || 'Website',
        sourceIcon: leadData.sourceIcon || 'globe',
        status: leadData.status || 'New',
        statusType: 'info',
        assigned: leadData.assigned || 'Sarah Smith',
        lastActivity: 'Just now'
      };
      return {
        ...prev,
        leadsCRM: {
          ...prev.leadsCRM,
          leadsList: [newLead, ...prev.leadsCRM.leadsList],
          metrics: {
            ...prev.leadsCRM.metrics,
            totalLeads: prev.leadsCRM.metrics.totalLeads + 1,
            newLeadsThisMonth: prev.leadsCRM.metrics.newLeadsThisMonth + 1
          }
        }
      };
    });
  };

  const openFullPostPreview = (postData: any) => {
    setState(prev => ({
      ...prev,
      modals: { ...prev.modals, isFullPreviewOpen: true, previewPostData: postData }
    }));
  };

  const openRequestChangesModal = (id?: string) => {
    setState(prev => ({
      ...prev,
      modals: { ...prev.modals, isRequestChangesOpen: true }
    }));
  };

  const closeModals = () => {
    setState(prev => ({
      ...prev,
      modals: {
        ...prev.modals,
        isWorkspaceSwitcherOpen: false,
        isNewWorkspaceModalOpen: false,
        isFullPreviewOpen: false,
        isRequestChangesOpen: false,
        isOAuthModalOpen: false,
        isNewLeadModalOpen: false
      }
    }));
  };

  const contextValue = {
    state,
    setState,
    updateState,
    setWorkspace,
    toggleWorkspaceSwitcher,
    toggleApprovalRequired,
    approvePost,
    rejectPost,
    retryPipelinePlatform,
    refreshToken,
    addLead,
    openFullPostPreview,
    openRequestChangesModal,
    closeModals
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
}
