'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';


// Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'NEGOTIATING' | 'WON' | 'LOST';
  source: string;
  value: number;
  projectType: string;
  address: string;
  notes: string;
  createdAt: string;
  lastContact: string;
  assignedTo: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  totalValue: number;
  projects: number;
  createdAt: string;
  lastContact: string;
}

export interface Project {
  id: string;
  title: string;
  accountId: string;
  clientName: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  value: number;
  startDate: string;
  endDate: string;
  assignedTo: string[];
  description: string;
  address: string;
  progress: number;
}

// Backward compatibility
export type Job = Project;

// Context interface
interface CRMContextType {
  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  // Accounts
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Stats
  stats: {
    totalLeads: number;
    totalAccounts: number;
    totalProjects: number;
    totalValue: number;
    conversionRate: number;
  };
  getStats: () => {
    totalLeads: number;
    totalAccounts: number;
    totalProjects: number;
    totalValue: number;
    conversionRate: number;
  };
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

// Initial mock data
const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+44 7700 900123',
    company: 'Johnson Properties',
    status: 'NEW',
    source: 'Website',
    value: 15000,
    projectType: 'Kitchen Renovation',
    address: '123 Oak Street, Manchester, M1 1AA',
    notes: 'Interested in modern kitchen design with island',
    createdAt: '2025-09-08T10:30:00Z',
    lastContact: '2025-09-08T10:30:00Z',
    assignedTo: 'John Smith',
  },
  {
    id: '2',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+44 7700 900124',
    company: 'Davis Developments',
    status: 'CONTACTED',
    source: 'Referral',
    value: 25000,
    projectType: 'Bathroom Suite',
    address: '456 Pine Avenue, Leeds, LS1 2BB',
    notes: 'Looking for luxury bathroom renovation',
    createdAt: '2025-09-07T14:20:00Z',
    lastContact: '2025-09-08T09:15:00Z',
    assignedTo: 'Emma Wilson',
  },
  {
    id: '3',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '+44 7700 900125',
    status: 'QUALIFIED',
    source: 'Google Ads',
    value: 8000,
    projectType: 'Wet Room',
    address: '789 Elm Road, Birmingham, B1 3CC',
    notes: 'Accessibility requirements for elderly parent',
    createdAt: '2025-09-06T11:45:00Z',
    lastContact: '2025-09-07T16:30:00Z',
    assignedTo: 'John Smith',
  },
];

const initialAccounts: Account[] = [
  {
    id: '1',
    name: 'John Williams',
    email: 'john.williams@email.com',
    phone: '+44 7700 800123',
    company: 'Williams Construction',
    address: '321 Cedar Lane, Liverpool, L1 4DD',
    status: 'ACTIVE',
    totalValue: 45000,
    projects: 3,
    createdAt: '2025-08-15T10:00:00Z',
    lastContact: '2025-09-08T14:20:00Z',
  },
  {
    id: '2',
    name: 'Emma Brown',
    email: 'emma.brown@email.com',
    phone: '+44 7700 800124',
    address: '654 Maple Street, Sheffield, S1 5EE',
    status: 'ACTIVE',
    totalValue: 18000,
    projects: 1,
    createdAt: '2025-08-20T13:30:00Z',
    lastContact: '2025-09-07T11:45:00Z',
  },
];

const initialProjects: Project[] = [
  {
    id: '1',
    title: 'Modern Kitchen Installation',
    accountId: '1',
    clientName: 'John Williams',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    value: 25000,
    startDate: '2025-09-01',
    endDate: '2025-09-20',
    assignedTo: ['Mike Johnson', 'Sarah Wilson'],
    description: 'Complete kitchen renovation with modern appliances',
    address: '321 Cedar Lane, Liverpool, L1 4DD',
    progress: 65,
  },
  {
    id: '2',
    title: 'Bathroom Suite Upgrade',
    accountId: '2',
    clientName: 'Emma Brown',
    status: 'PLANNING',
    priority: 'MEDIUM',
    value: 12000,
    startDate: '2025-09-15',
    endDate: '2025-09-30',
    assignedTo: ['Tom Brown'],
    description: 'Master bathroom suite with walk-in shower',
    address: '654 Maple Street, Sheffield, S1 5EE',
    progress: 10,
  },
];

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLeads = localStorage.getItem('crm-leads');
    const savedAccounts = localStorage.getItem('crm-accounts');
    const savedProjects = localStorage.getItem('crm-projects');

    setLeads(savedLeads ? JSON.parse(savedLeads) : initialLeads);
    setAccounts(savedAccounts ? JSON.parse(savedAccounts) : initialAccounts);
    setProjects(savedProjects ? JSON.parse(savedProjects) : initialProjects);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('crm-leads', JSON.stringify(leads));
    }
  }, [leads]);

  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem('crm-accounts', JSON.stringify(accounts));
    }
  }, [accounts]);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('crm-projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Lead functions
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, ...updates } : lead
    ));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  // Account functions
  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAccounts(prev => [newAccount, ...prev]);
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(account => 
      account.id === id ? { ...account, ...updates } : account
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
  };

  // Job functions
  const addProject = (projectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(job => 
      job.id === id ? { ...job, ...updates } : job
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(job => job.id !== id));
  };

  // Stats function
  const getStats = () => {
    const totalLeads = leads.length;
    const totalAccounts = accounts.length;
    const totalProjects = projects.length;
    const totalValue = projects.reduce((sum, project) => sum + project.value, 0);
    const wonLeads = leads.filter(lead => lead.status === 'WON').length;
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

    return {
      totalLeads,
      totalAccounts,
      totalProjects,
      totalValue,
      conversionRate,
    };
  };

  const value: CRMContextType = {
    leads,
    addLead,
    updateLead,
    deleteLead,
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    projects,
    addProject,
    updateProject,
    deleteProject,
    stats: getStats(),
    getStats,
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

// Backward compatibility - alias Account as Client for existing code
export type Client = Account;

export function useCRM() {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}
