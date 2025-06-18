'use client';

import React, {
  useState,
  useMemo,
  type FormEvent,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VirtualList } from '@/components/ui/virtual-list';
import {
  Users,
  PlusCircle,
  Trash,
  MagnifyingGlass as Search,
  Sparkle as Sparkles,
  CircleNotch as Loader2,
  Warning as AlertCircle,
  Download,
  Upload,
  User as UserIcon,
  ArrowsClockwise as RefreshCcw,
} from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  generateLeadInsight,
  type GenerateLeadInsightInput,
  type GenerateLeadInsightOutput,
} from '@/ai/flows/generate-lead-insight';
import { useToast } from '@/hooks/use-toast';
import { useWebWorker } from '@/hooks/use-web-worker';

interface Lead {
  id: string;
  name: string;
  email: string;
  insight?: string;
  isLoadingInsight?: boolean;
  insightError?: string;
}

// Simulate a user context - in a real app, this would come from auth or props
const SIMULATED_CURRENT_USER_ID = 'user_default_nexos';

// Memoized Lead Item component for better performance
const LeadItem = React.memo<{
  lead: Lead;
  onDelete: (id: string) => void;
  onGenerateInsight: (id: string) => void;
}>(({ lead, onDelete, onGenerateInsight }) => {
  const handleDelete = useCallback(
    () => onDelete(lead.id),
    [onDelete, lead.id]
  );
  const handleInsight = useCallback(
    () => onGenerateInsight(lead.id),
    [onGenerateInsight, lead.id]
  );

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserIcon className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{lead.name}</p>
              <p className="text-xs text-muted-foreground">{lead.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleInsight}
              disabled={lead.isLoadingInsight}
              className="text-xs"
            >
              {lead.isLoadingInsight ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1 h-3 w-3" />
                  Insight
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-xs text-destructive hover:text-destructive"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {lead.insight && (
          <div className="mt-3 rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">
              <Sparkles className="mr-1 inline h-3 w-3" />
              AI Insight: {lead.insight}
            </p>
          </div>
        )}

        {lead.insightError && (
          <div className="mt-3 rounded-md bg-destructive/10 p-2">
            <p className="text-xs text-destructive">
              <AlertCircle className="mr-1 inline h-3 w-3" />
              Error: {lead.insightError}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

LeadItem.displayName = 'LeadItem';

const SmartLeadTracker: React.FC = React.memo(() => {
  // User context for data namespacing
  const currentUserId = SIMULATED_CURRENT_USER_ID;
  // localStorage key is now namespaced by the currentUserId
  const localStorageKey = `nexos-smart-lead-tracker-leads_${currentUserId}`;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { execute: executeWorkerTask } = useWebWorker();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load leads from localStorage for the current user on initial component mount
  useEffect(() => {
    try {
      const storedLeadsJson = localStorage.getItem(localStorageKey);
      if (storedLeadsJson) {
        const parsedStoredLeads: Omit<
          Lead,
          'isLoadingInsight' | 'insightError' | 'insight'
        >[] = JSON.parse(storedLeadsJson);
        if (Array.isArray(parsedStoredLeads)) {
          setLeads(
            parsedStoredLeads.map(lead => ({
              ...lead,
              isLoadingInsight: false,
              insightError: undefined,
              insight: undefined,
            }))
          );
        } else {
          console.warn(
            `Invalid data found in localStorage for key ${localStorageKey}, resetting.`
          );
          localStorage.removeItem(localStorageKey);
          setLeads([]);
        }
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error(
        `Error loading leads from localStorage for key ${localStorageKey}:`,
        error
      );
      localStorage.removeItem(localStorageKey);
      setLeads([]);
    }
  }, [localStorageKey]);

  // Save leads to localStorage for the current user whenever the leads state changes
  useEffect(() => {
    try {
      const leadsToStore = leads.map(({ id, name, email }) => ({
        id,
        name,
        email,
      }));
      localStorage.setItem(localStorageKey, JSON.stringify(leadsToStore));
    } catch (error) {
      console.error(
        `Error saving leads to localStorage for key ${localStorageKey}:`,
        error
      );
    }
  }, [leads, localStorageKey]);

  // Use Web Worker for filtering large datasets
  const filteredLeads = useMemo(() => {
    if (!searchTerm.trim()) {
      return leads;
    }

    // For large datasets, use Web Worker
    if (leads.length > 1000) {
      executeWorkerTask({
        type: 'SEARCH_ITEMS',
        data: leads,
        options: {
          searchTerm: searchTerm.toLowerCase(),
          searchFields: ['name', 'email'],
        },
      })
        .then(result => {
          // Handle async result if needed
        })
        .catch(console.error);

      // Return synchronous filter for now
      return leads.filter(
        lead =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // For smaller datasets, use regular filter
    return leads.filter(
      lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm, executeWorkerTask]);

  const handleAddLead = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedName = leadName.trim();
      const trimmedEmail = leadEmail.trim();

      if (!trimmedName || !trimmedEmail) {
        toast({
          title: 'Validation Error',
          description: 'Please enter both name and email for the lead.',
          variant: 'destructive',
        });
        return;
      }
      if (!trimmedEmail.includes('@')) {
        toast({
          title: 'Validation Error',
          description: 'Please enter a valid email address.',
          variant: 'destructive',
        });
        return;
      }

      // Check for duplicates
      const isDuplicate = leads.some(
        lead => lead.email.toLowerCase() === trimmedEmail.toLowerCase()
      );
      if (isDuplicate) {
        toast({
          title: 'Duplicate Lead',
          description: 'A lead with this email already exists.',
          variant: 'destructive',
        });
        return;
      }

      const newLead: Lead = {
        id: crypto.randomUUID(),
        name: trimmedName,
        email: trimmedEmail,
        isLoadingInsight: false,
      };

      setLeads(prevLeads => [newLead, ...prevLeads]);
      setLeadName('');
      setLeadEmail('');
      toast({
        title: 'Lead Added',
        description: `${trimmedName} has been added to your leads.`,
      });
    },
    [leadName, leadEmail, leads, toast]
  );

  const handleDeleteLead = useCallback(
    (id: string) => {
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
      toast({
        title: 'Lead Removed',
        description: 'The lead has been removed from your list.',
      });
    },
    [toast]
  );

  const handleGenerateInsight = useCallback(
    async (leadId: string) => {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      setLeads(prevLeads =>
        prevLeads.map(l =>
          l.id === leadId
            ? { ...l, isLoadingInsight: true, insightError: undefined }
            : l
        )
      );

      try {
        const input: GenerateLeadInsightInput = {
          name: lead.name,
          email: lead.email,
        };
        const result: GenerateLeadInsightOutput =
          await generateLeadInsight(input);

        setLeads(prevLeads =>
          prevLeads.map(l =>
            l.id === leadId
              ? {
                  ...l,
                  insight: result.insight,
                  isLoadingInsight: false,
                  insightError: undefined,
                }
              : l
          )
        );

        toast({
          title: 'Insight Generated',
          description: 'AI insight generated successfully!',
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to generate insight';

        setLeads(prevLeads =>
          prevLeads.map(l =>
            l.id === leadId
              ? { ...l, isLoadingInsight: false, insightError: errorMessage }
              : l
          )
        );

        toast({
          title: 'Insight Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
    [leads, toast]
  );

  const handleExportLeads = useCallback(() => {
    if (leads.length === 0) {
      toast({
        title: 'No Leads',
        description: 'There are no leads to export.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const csvHeader = 'Name,Email\n';
      const csvRows = leads
        .map(lead => `"${lead.name}","${lead.email}"`)
        .join('\n');
      const csvContent = csvHeader + csvRows;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `leads_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Successful',
        description: 'Leads have been exported to CSV file.',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export leads. Please try again.',
        variant: 'destructive',
      });
    }
  }, [leads, toast]);

  // Memoized render function for virtual list
  const renderLeadItem = useCallback(
    (lead: Lead, index: number) => (
      <div key={lead.id} className="p-2">
        <LeadItem
          lead={lead}
          onDelete={handleDeleteLead}
          onGenerateInsight={handleGenerateInsight}
        />
      </div>
    ),
    [handleDeleteLead, handleGenerateInsight]
  );

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <Users className="mr-2 h-5 w-5 text-primary" />
          Smart Lead Tracker
        </CardTitle>
        <CardDescription className="text-sm">
          Manage your leads with AI-powered insights. Currently tracking{' '}
          {leads.length} lead{leads.length !== 1 ? 's' : ''}.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-4">
        {/* Add Lead Form */}
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="lead-name" className="text-sm font-medium">
                Lead Name
              </Label>
              <Input
                id="lead-name"
                placeholder="Enter lead's full name"
                value={leadName}
                onChange={e => setLeadName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lead-email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="Enter lead's email"
                value={leadEmail}
                onChange={e => setLeadEmail(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </form>

        <Separator />

        {/* Actions Row */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportLeads}
            disabled={leads.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search leads by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Leads List with Virtualization */}
        <div className="min-h-0 flex-1">
          {filteredLeads.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <Users className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? 'No leads found matching your search.'
                  : 'No leads added yet. Add your first lead above!'}
              </p>
            </div>
          ) : (
            <VirtualList
              items={filteredLeads}
              itemHeight={120}
              containerHeight={400}
              renderItem={renderLeadItem}
              keyExtractor={lead => lead.id}
              className="w-full"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
});

SmartLeadTracker.displayName = 'SmartLeadTracker';

export default SmartLeadTracker;
