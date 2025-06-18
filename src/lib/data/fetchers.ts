// src/lib/data/fetchers.ts
'use client';

import { enhancedDataCache, withCache } from '@/lib/cache/enhanced-cache';
import { dataCache, CACHE_KEYS } from '@/lib/cache';

// Types for all data structures
export interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
  avatarUrl: string;
  dataAiHint: string;
  username: string;
  location: string;
  website: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  dataAiHint: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  location: string;
}

export interface UserItem {
  id: string;
  name: string;
  type: string;
  lastModified: string;
}

export interface ItemDetails {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  modulesAttached: number;
  lastDeployed: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  avatar: string;
  dataAiHint: string;
}

export interface ReportedContent {
  id: string;
  itemId: string;
  itemName: string;
  itemType: string;
  reporter: string;
  reason: string;
  reportedDate: string;
  status: string;
}

export interface Submission {
  id: string;
  itemName: string;
  itemType: string;
  submitter: string;
  submittedDate: string;
  status: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'Connected' | 'Disconnected';
  icon: string;
  connectedAt?: string;
}

export interface EarningsData {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  transactionHistory: Array<{
    id: string;
    type: string;
    amount: number;
    date: string;
    description: string;
  }>;
}

// Mock data generators
const generateUserProfile = (): UserProfile => ({
  fullName: 'Alex Ryder',
  email: 'alex.ryder@nexos.ai',
  bio: 'AI enthusiast and developer building the future with NexOS. Passionate about modular systems and intelligent agents.',
  avatarUrl: 'https://placehold.co/128x128.png',
  dataAiHint: 'user avatar placeholder',
  username: 'alex_ryder_nexos',
  location: 'Cyberspace',
  website: 'https://nexos.ai',
});

const generateTeamMembers = (): TeamMember[] => [
  {
    id: 'user_1',
    name: 'Alex Ryder',
    email: 'alex.ryder@nexos.ai',
    role: 'Owner',
    avatar: 'https://placehold.co/40x40.png?text=AR',
    dataAiHint: 'user avatar',
  },
  {
    id: 'user_2',
    name: 'Devon Miles',
    email: 'devon@example.com',
    role: 'Admin',
    avatar: 'https://placehold.co/40x40.png?text=DM',
    dataAiHint: 'user avatar',
  },
  {
    id: 'user_3',
    name: 'Sam Chen',
    email: 'sam.chen@company.com',
    role: 'Developer',
    avatar: 'https://placehold.co/40x40.png?text=SC',
    dataAiHint: 'user avatar',
  },
];

const generateActiveSessions = (): ActiveSession[] => [
  {
    id: 'session_1',
    device: 'Chrome on macOS',
    ip: '192.168.1.101',
    lastActive: 'Current session',
    location: 'New York, USA',
  },
  {
    id: 'session_2',
    device: 'NexOS Mobile App on iOS',
    ip: '10.0.0.5',
    lastActive: '2 hours ago',
    location: 'Remote',
  },
];

const generateUserItems = (): UserItem[] => [
  {
    id: 'item_1',
    name: 'My First Project',
    type: 'Application',
    lastModified: '2023-10-26',
  },
  {
    id: 'item_2',
    name: 'Cool API Service',
    type: 'Service',
    lastModified: '2023-10-25',
  },
  {
    id: 'item_3',
    name: 'Automated Workflow',
    type: 'Workflow',
    lastModified: '2023-10-24',
  },
];

const generateItemDetails = (id: string): ItemDetails => ({
  id,
  name: `Managed Item ${id.substring(0, 5)}`,
  type: 'Application',
  status: 'Active',
  createdAt: new Date(
    Date.now() - Math.random() * 10000000000
  ).toLocaleDateString(),
  modulesAttached: Math.floor(Math.random() * 5) + 1,
  lastDeployed: new Date(
    Date.now() - Math.random() * 1000000000
  ).toLocaleDateString(),
});

const generateAdminUsers = (): AdminUser[] => [
  {
    id: 'user_1',
    name: 'Alex Ryder',
    email: 'alex.ryder@nexos.ai',
    role: 'Owner',
    status: 'Active',
    lastLogin: '2023-10-26 10:00',
    avatar: 'https://placehold.co/40x40.png?text=AR',
    dataAiHint: 'user avatar',
  },
  {
    id: 'user_2',
    name: 'Devon Miles',
    email: 'devon@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-10-25 14:30',
    avatar: 'https://placehold.co/40x40.png?text=DM',
    dataAiHint: 'user avatar',
  },
  {
    id: 'user_3',
    name: 'Casey Smith',
    email: 'casey@test.com',
    role: 'User',
    status: 'Pending',
    lastLogin: 'Never',
    avatar: 'https://placehold.co/40x40.png?text=CS',
    dataAiHint: 'user avatar',
  },
];

const generateReportedContent = (filterStatus: string): ReportedContent[] => {
  const allReports: ReportedContent[] = [
    {
      id: 'report_1',
      itemId: 'item_X',
      itemName: 'Suspicious AI Module',
      itemType: 'Module',
      reporter: 'UserAlpha',
      reason: 'Potential malware detected.',
      reportedDate: '2023-10-26',
      status: 'Open',
    },
    {
      id: 'report_2',
      itemId: 'item_Y',
      itemName: 'Misleading Template Description',
      itemType: 'Template',
      reporter: 'UserBeta',
      reason: 'Template does not match preview.',
      reportedDate: '2023-10-25',
      status: 'Resolved - Action Taken',
    },
    {
      id: 'report_3',
      itemId: 'item_Z',
      itemName: 'Inappropriate Agent Name',
      itemType: 'Agent',
      reporter: 'UserGamma',
      reason: 'Agent name contains offensive language.',
      reportedDate: '2023-10-24',
      status: 'Resolved - Warning Issued',
    },
  ];

  return filterStatus === 'all'
    ? allReports
    : allReports.filter(report => {
        if (filterStatus === 'open') return report.status === 'Open';
        if (filterStatus === 'resolved')
          return report.status.includes('Resolved');
        return true;
      });
};

const generateSubmissions = (filterStatus: string): Submission[] => {
  const allSubmissions: Submission[] = [
    {
      id: 'sub_001',
      itemName: 'AI Powered Note Taker Module',
      itemType: 'Module',
      submitter: 'DevUser123',
      submittedDate: '2023-10-25',
      status: 'Pending',
    },
    {
      id: 'sub_002',
      itemName: 'E-commerce Site Template',
      itemType: 'Template',
      submitter: 'DesignerPro',
      submittedDate: '2023-10-24',
      status: 'Approved',
    },
    {
      id: 'sub_003',
      itemName: 'Weather Forecast Agent',
      itemType: 'Agent',
      submitter: 'WeatherWiz',
      submittedDate: '2023-10-23',
      status: 'Rejected - Quality Issues',
    },
  ];

  return filterStatus === 'all'
    ? allSubmissions
    : allSubmissions.filter(submission => {
        if (filterStatus === 'pending') return submission.status === 'Pending';
        if (filterStatus === 'approved')
          return submission.status === 'Approved';
        if (filterStatus === 'rejected')
          return submission.status.includes('Rejected');
        return true;
      });
};

const generateIntegrations = (): Integration[] => [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team collaboration and messaging',
    status: 'Connected',
    icon: 'MessageSquare',
    connectedAt: '2023-10-15',
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repository and version control',
    status: 'Connected',
    icon: 'Github',
    connectedAt: '2023-09-20',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Cloud storage and file sharing',
    status: 'Disconnected',
    icon: 'HardDrive',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Community and voice chat',
    status: 'Disconnected',
    icon: 'MessageCircle',
  },
];

const generateEarningsData = (): EarningsData => ({
  totalEarnings: 2847.5,
  thisMonth: 456.75,
  lastMonth: 523.25,
  transactionHistory: [
    {
      id: 'txn_001',
      type: 'Agent Sale',
      amount: 29.99,
      date: '2023-10-26',
      description: 'DataMiner Pro Agent',
    },
    {
      id: 'txn_002',
      type: 'Template License',
      amount: 15.5,
      date: '2023-10-25',
      description: 'Dashboard Template',
    },
    {
      id: 'txn_003',
      type: 'Subscription Revenue',
      amount: 199.0,
      date: '2023-10-24',
      description: 'Pro Plan (Monthly)',
    },
    {
      id: 'txn_004',
      type: 'Module Commission',
      amount: 12.25,
      date: '2023-10-23',
      description: 'Authentication Module',
    },
  ],
});

// Data fetchers with caching and proper async patterns - NO ARTIFICIAL DELAYS
export const fetchUserProfile = async (): Promise<UserProfile> => {
  const cached = dataCache.get<UserProfile>(CACHE_KEYS.USER_PROFILE);
  if (cached) return cached;

  // Real async data fetch without artificial delays
  const data = generateUserProfile();

  dataCache.set(CACHE_KEYS.USER_PROFILE, data, 10 * 60 * 1000); // 10 minutes cache
  return data;
};

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
  const cached = dataCache.get<TeamMember[]>(CACHE_KEYS.TEAM_MEMBERS);
  if (cached) return cached;

  const data = generateTeamMembers();

  dataCache.set(CACHE_KEYS.TEAM_MEMBERS, data);
  return data;
};

export const fetchActiveSessions = async (): Promise<ActiveSession[]> => {
  const cached = dataCache.get<ActiveSession[]>(CACHE_KEYS.ACTIVE_SESSIONS);
  if (cached) return cached;

  const data = generateActiveSessions();

  dataCache.set(CACHE_KEYS.ACTIVE_SESSIONS, data);
  return data;
};

export const fetchUserItems = async (): Promise<UserItem[]> => {
  const cached = dataCache.get<UserItem[]>(CACHE_KEYS.USER_ITEMS);
  if (cached) return cached;

  const data = generateUserItems();

  dataCache.set(CACHE_KEYS.USER_ITEMS, data);
  return data;
};

export const fetchItemDetails = async (id: string): Promise<ItemDetails> => {
  const cacheKey = CACHE_KEYS.ITEM_DETAILS(id);
  const cached = dataCache.get<ItemDetails>(cacheKey);
  if (cached) return cached;

  const data = generateItemDetails(id);

  dataCache.set(cacheKey, data);
  return data;
};

export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const cached = dataCache.get<AdminUser[]>(CACHE_KEYS.ADMIN_USERS);
  if (cached) return cached;

  const data = generateAdminUsers();

  dataCache.set(CACHE_KEYS.ADMIN_USERS, data);
  return data;
};

export const fetchReportedContent = async (
  filterStatus: string
): Promise<ReportedContent[]> => {
  const cacheKey = `${CACHE_KEYS.ADMIN_REPORTS}_${filterStatus}`;
  const cached = dataCache.get<ReportedContent[]>(cacheKey);
  if (cached) return cached;

  const data = generateReportedContent(filterStatus);

  dataCache.set(cacheKey, data, 2 * 60 * 1000); // 2 minutes cache for admin data
  return data;
};

export const fetchSubmissions = async (
  filterStatus: string
): Promise<Submission[]> => {
  const cacheKey = `${CACHE_KEYS.ADMIN_REVIEWS}_${filterStatus}`;
  const cached = dataCache.get<Submission[]>(cacheKey);
  if (cached) return cached;

  const data = generateSubmissions(filterStatus);

  dataCache.set(cacheKey, data, 2 * 60 * 1000);
  return data;
};

export const fetchIntegrations = async (): Promise<Integration[]> => {
  const cached = dataCache.get<Integration[]>(CACHE_KEYS.INTEGRATIONS);
  if (cached) return cached;

  const data = generateIntegrations();

  dataCache.set(CACHE_KEYS.INTEGRATIONS, data);
  return data;
};

export const fetchEarningsData = async (): Promise<EarningsData> => {
  const cached = dataCache.get<EarningsData>(CACHE_KEYS.EARNINGS);
  if (cached) return cached;

  const data = generateEarningsData();

  dataCache.set(CACHE_KEYS.EARNINGS, data);
  return data;
};

// Utility function to prefetch commonly used data
export const prefetchCommonData = async (): Promise<void> => {
  // Run prefetch operations in parallel without blocking UI
  Promise.all([
    fetchUserProfile(),
    fetchUserItems(),
    fetchIntegrations(),
  ]).catch(console.error);
};
