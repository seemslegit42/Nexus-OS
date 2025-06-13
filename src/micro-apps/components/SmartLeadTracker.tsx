
'use client';

import React, { useState, useMemo, type FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, PlusCircle, Trash2, Search, Sparkles, Loader2, AlertCircle, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { generateLeadInsight, type GenerateLeadInsightInput, type GenerateLeadInsightOutput } from '@/ai/flows/generate-lead-insight';
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  insight?: string;
  isLoadingInsight?: boolean;
  insightError?: string;
}

const LOCAL_STORAGE_KEY = 'nexos-smart-lead-tracker-leads';

const SmartLeadTracker: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Load leads from localStorage on initial component mount
  useEffect(() => {
    try {
      const storedLeads = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedLeads) {
        const parsedLeads: Omit<Lead, 'isLoadingInsight' | 'insightError' | 'insight'>[] = JSON.parse(storedLeads);
        if (Array.isArray(parsedLeads)) {
          setLeads(parsedLeads.map(lead => ({ ...lead, isLoadingInsight: false, insightError: undefined, insight: undefined })));
        } else {
          console.warn('Invalid data found in localStorage for leads, resetting.');
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading leads from localStorage:', error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  // Save leads to localStorage whenever the leads state changes
  useEffect(() => {
    try {
      const leadsToStore = leads.map(({ id, name, email }) => ({ id, name, email }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leadsToStore));
    } catch (error) {
      console.error('Error saving leads to localStorage:', error);
    }
  }, [leads]);

  const filteredLeads = useMemo(() => {
    if (!searchTerm.trim()) {
      return leads;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(lowercasedSearchTerm) ||
        lead.email.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [leads, searchTerm]);

  const handleAddLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = leadName.trim();
    const trimmedEmail = leadEmail.trim();

    if (!trimmedName || !trimmedEmail) {
      toast({ title: "Validation Error", description: "Please enter both name and email for the lead.", variant: "destructive" });
      return;
    }
    if (!trimmedEmail.includes('@')) {
      toast({ title: "Validation Error", description: "Please enter a valid email address.", variant: "destructive" });
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
    toast({ title: "Lead Added", description: `${trimmedName} has been successfully added.`, variant: "default" });
  };

  const handleDeleteLead = (leadId: string) => {
    const leadToDelete = leads.find(lead => lead.id === leadId);
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    if (leadToDelete) {
      toast({ title: "Lead Deleted", description: `${leadToDelete.name} has been removed.`, variant: "default" });
    }
  };

  const handleGetInsight = async (leadId: string) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, isLoadingInsight: true, insight: undefined, insightError: undefined } : lead
      )
    );

    const leadToAnalyze = leads.find(lead => lead.id === leadId);
    if (!leadToAnalyze) return;

    try {
      const input: GenerateLeadInsightInput = { name: leadToAnalyze.name, email: leadToAnalyze.email };
      const result: GenerateLeadInsightOutput = await generateLeadInsight(input);
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, insight: result.insight, isLoadingInsight: false } : lead
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get insight.';
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, insightError: errorMessage, isLoadingInsight: false } : lead
        )
      );
      console.error(`Error getting insight for lead ${leadId}:`, err);
    }
  };

  const escapeCSVField = (field: string): string => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const exportLeadsToCSV = () => {
    if (filteredLeads.length === 0) {
      toast({
        title: "Export Failed",
        description: "No leads to export. Add some leads or adjust your filters.",
        variant: "destructive",
      });
      return;
    }

    const headers = "Name,Email";
    const rows = filteredLeads.map(lead => 
      `${escapeCSVField(lead.name)},${escapeCSVField(lead.email)}`
    );
    const csvContent = `${headers}\n${rows.join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { // Feature detection
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "nexos_leads_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: `${filteredLeads.length} leads exported to nexos_leads_export.csv.`,
        variant: "default",
      });
    } else {
       toast({
        title: "Export Failed",
        description: "CSV export is not supported in this browser.",
        variant: "destructive",
      });
    }
  };

  const isAddLeadDisabled = !leadName.trim() || !leadEmail.trim();

  return (
    <Card className="w-full h-full flex flex-col border-none shadow-none bg-transparent p-1 md:p-2">
      <CardHeader className="pb-3 pt-1 px-2 md:px-3">
        <CardTitle className="flex items-center text-lg font-headline text-foreground">
          <Users className="mr-2 h-5 w-5 text-primary" /> Smart Lead Tracker
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Manage leads and get AI-powered insights. Data is saved in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-3 md:gap-4 px-2 md:px-3 overflow-hidden">
        <Card className="bg-card/70 backdrop-blur-sm border-primary/20 rounded-xl p-3 md:p-4 shadow-lg flex-shrink-0">
          <form onSubmit={handleAddLead} className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Add New Lead</h3>
            <div className="grid gap-1.5">
              <Label htmlFor="leadName" className="text-xs">Lead Name</Label>
              <Input
                id="leadName"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="e.g., Ada Lovelace"
                className="h-9 text-sm bg-input border-input focus:ring-primary"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="leadEmail" className="text-xs">Lead Email</Label>
              <Input
                id="leadEmail"
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder="e.g., ada@example.com"
                className="h-9 text-sm bg-input border-input focus:ring-primary"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-9 text-sm bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
              disabled={isAddLeadDisabled}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Lead
            </Button>
          </form>
        </Card>

        <Separator className="my-1 md:my-2 bg-primary/20" />

        <div className="flex-grow flex flex-col min-h-0">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-1.5 md:mb-2 gap-2">
            <h3 className="text-sm font-medium text-foreground">Current Leads ({filteredLeads.length})</h3>
            <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0 w-full sm:max-w-[200px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"/>
                    <Input
                        type="search"
                        placeholder="Filter leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8 text-xs pl-8 bg-input border-input focus:ring-primary w-full"
                    />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={exportLeadsToCSV}
                    className="h-8 text-xs bg-card hover:bg-muted/70 border-primary/30"
                    title="Export filtered leads to CSV"
                >
                    <Download className="mr-2 h-3.5 w-3.5" /> Export ({filteredLeads.length})
                </Button>
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-center text-muted-foreground text-xs p-4 bg-muted/20 rounded-lg">
              No leads added yet. Use the form above to add your first lead.
            </div>
          ) : filteredLeads.length === 0 && searchTerm ? (
            <div className="flex-grow flex items-center justify-center text-center text-muted-foreground text-xs p-4 bg-muted/20 rounded-lg">
              No leads found matching "{searchTerm}".
            </div>
          ) : (
            <ScrollArea className="flex-grow border border-primary/20 bg-background/30 rounded-lg p-0.5">
              <div className="space-y-2 p-1.5 md:p-2">
                {filteredLeads.map((lead) => (
                  <Card key={lead.id} className="bg-card/80 backdrop-blur-sm border-primary/15 rounded-lg shadow-sm hover:border-primary/30 transition-colors">
                    <div className="p-2.5 md:p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.email}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                            title={`Delete ${lead.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 pt-2 border-t border-primary/10">
                          {lead.isLoadingInsight && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                              Getting insight...
                            </div>
                          )}
                          {lead.insightError && (
                            <div className="flex items-center text-xs text-destructive">
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Error: {lead.insightError}
                            </div>
                          )}
                          {lead.insight && !lead.isLoadingInsight && (
                            <div className="text-xs">
                              <p className="font-medium text-primary mb-0.5">AI Insight:</p>
                              <p className="text-muted-foreground bg-muted/30 p-1.5 rounded-md">{lead.insight}</p>
                            </div>
                          )}
                          {!lead.isLoadingInsight && !lead.insight && !lead.insightError && (
                             <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGetInsight(lead.id)}
                                className="h-7 text-xs bg-accent/10 border-accent/30 text-accent-foreground hover:bg-accent/20"
                                disabled={lead.isLoadingInsight}
                              >
                                <Sparkles className="mr-2 h-3.5 w-3.5" /> Get Insight
                              </Button>
                          )}
                        </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartLeadTracker;

