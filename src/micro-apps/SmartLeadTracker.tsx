
'use client';

import React, { useState, useMemo, type FormEvent, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, PlusCircle, Trash2, Search, Sparkles, Loader2, AlertCircle, Download, Upload, UserCircle as UserIcon } from 'lucide-react';
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

// Simulate a user context - in a real app, this would come from auth or props
const SIMULATED_CURRENT_USER_ID = 'user_default_nexos'; 

const SmartLeadTracker: React.FC = () => {
  // User context for data namespacing
  const currentUserId = SIMULATED_CURRENT_USER_ID;
  // localStorage key is now namespaced by the currentUserId
  const localStorageKey = `nexos-smart-lead-tracker-leads_${currentUserId}`;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load leads from localStorage for the current user on initial component mount
  useEffect(() => {
    try {
      const storedLeadsJson = localStorage.getItem(localStorageKey);
      if (storedLeadsJson) {
        // Assuming stored leads are just {id, name, email}
        const parsedStoredLeads: Omit<Lead, 'isLoadingInsight' | 'insightError' | 'insight'>[] = JSON.parse(storedLeadsJson);
        if (Array.isArray(parsedStoredLeads)) {
          // Initialize UI-specific fields for each lead loaded from storage
          setLeads(parsedStoredLeads.map(lead => ({ ...lead, isLoadingInsight: false, insightError: undefined, insight: undefined })));
        } else {
          console.warn(`Invalid data found in localStorage for key ${localStorageKey}, resetting.`);
          localStorage.removeItem(localStorageKey);
          setLeads([]); // Reset to empty if data is corrupt
        }
      } else {
        setLeads([]); // No data for this user, start with empty
      }
    } catch (error) {
      console.error(`Error loading leads from localStorage for key ${localStorageKey}:`, error);
      localStorage.removeItem(localStorageKey);
      setLeads([]); // Reset to empty on error
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorageKey]); // Rerun this effect if the localStorageKey changes (e.g., user changes)

  // Save leads to localStorage for the current user whenever the leads state changes
  useEffect(() => {
    try {
      // Only store core lead data (id, name, email), not transient UI state like insights
      const leadsToStore = leads.map(({ id, name, email }) => ({ id, name, email }));
      localStorage.setItem(localStorageKey, JSON.stringify(leadsToStore));
    } catch (error) {
      console.error(`Error saving leads to localStorage for key ${localStorageKey}:`, error);
    }
  }, [leads, localStorageKey]); // Rerun this effect if leads or localStorageKey changes

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
    // Check for duplicates within the current user's leads
    if (leads.some(lead => lead.email.toLowerCase() === trimmedEmail.toLowerCase())) {
        toast({ title: "Duplicate Lead", description: "A lead with this email already exists for you.", variant: "destructive" });
        return;
    }

    const newLead: Lead = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: trimmedEmail,
      isLoadingInsight: false, // Initialize UI-specific fields
    };
    // Add new lead to the beginning of the list for better UX
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
    if (!leadToAnalyze) return; // Should not happen if UI is consistent

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

  // Helper function to escape CSV fields
  const escapeCSVField = (field: string | undefined): string => {
    if (field === undefined || field === null) return '';
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  };

  const exportLeadsToCSV = () => {
    // Exports leads for the current user (respecting filters)
    if (filteredLeads.length === 0) {
      toast({
        title: "Export Failed",
        description: "No leads to export. Add some leads or adjust your filters.",
        variant: "destructive",
      });
      return;
    }

    const headers = "Name,Email"; // Intentionally not exporting insights for simplicity and non-persistence requirement
    const rows = filteredLeads.map(lead => 
      `${escapeCSVField(lead.name)},${escapeCSVField(lead.email)}`
    );
    const csvContent = `${headers}\n${rows.join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `nexos_leads_export_${currentUserId}.csv`); // Filename includes user ID
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: `${filteredLeads.length} leads exported for user ${currentUserId}.`,
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({ title: "Import Cancelled", description: "No file selected.", variant: "default" });
      return;
    }

    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      toast({ title: "Import Failed", description: "Invalid file type. Please upload a CSV file.", variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        toast({ title: "Import Failed", description: "Could not read file content.", variant: "destructive" });
        return;
      }
      parseCSVAndAddLeads(text);
    };
    reader.onerror = () => {
      toast({ title: "Import Failed", description: "Error reading file.", variant: "destructive" });
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input after processing
  };

  const parseCSVAndAddLeads = (csvText: string) => {
    // Parses and adds leads for the current user
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== ''); // Handle different line endings
    if (lines.length < 2) { // Must have headers + at least one data row
      toast({ title: "Import Failed", description: "CSV file is empty or has no data rows.", variant: "destructive" });
      return;
    }

    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    const nameIndex = headers.indexOf('name');
    const emailIndex = headers.indexOf('email');

    if (nameIndex === -1 || emailIndex === -1) {
      toast({ title: "Import Failed", description: "CSV must contain 'Name' and 'Email' columns (case-insensitive).", variant: "destructive" });
      return;
    }

    let importedCount = 0;
    let skippedCount = 0;
    const newLeadsBuffer: Lead[] = []; // Buffer to collect new leads before setting state

    for (let i = 1; i < lines.length; i++) {
      // Basic CSV parsing, does not handle commas within quoted fields robustly.
      // For production, a proper CSV parsing library is recommended.
      const cells = lines[i].split(','); 
      const name = cells[nameIndex]?.trim();
      const email = cells[emailIndex]?.trim();

      if (name && email && email.includes('@')) {
        // Check for duplicates against existing leads (for the current user) AND leads already in this import batch
        const isDuplicateInExisting = leads.some(lead => lead.email.toLowerCase() === email.toLowerCase());
        const isDuplicateInBatch = newLeadsBuffer.some(nl => nl.email.toLowerCase() === email.toLowerCase());
        
        if (!isDuplicateInExisting && !isDuplicateInBatch) {
          newLeadsBuffer.push({
            id: crypto.randomUUID(),
            name,
            email,
            isLoadingInsight: false, // Initialize UI-specific fields
          });
          importedCount++;
        } else {
          skippedCount++;
        }
      } else {
        skippedCount++;
      }
    }

    if (newLeadsBuffer.length > 0) {
      // Add all new, non-duplicate leads to the state for the current user
      setLeads(prevLeads => [...newLeadsBuffer, ...prevLeads]);
    }

    // Provide feedback based on import results
    if (importedCount > 0) {
      toast({
        title: "Import Successful",
        description: `${importedCount} new leads imported for user ${currentUserId}. ${skippedCount} rows skipped (invalid or duplicate).`,
        variant: "default",
      });
    } else if (skippedCount > 0) {
      toast({
        title: "Import Note",
        description: `No new leads imported for user ${currentUserId}. ${skippedCount} rows were invalid or duplicates.`,
        variant: "default", // Use default variant for notes not necessarily errors
      });
    } else {
       toast({
        title: "Import Info",
        description: "No leads found to import in the file.",
        variant: "default",
      });
    }
  };

  // Helper to programmatically click the hidden file input
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const isAddLeadDisabled = !leadName.trim() || !leadEmail.trim();

  return (
    <Card className="w-full h-full flex flex-col border-none shadow-none bg-transparent p-1 md:p-2">
      <CardHeader className="pb-3 pt-1 px-2 md:px-3">
        <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-lg font-headline text-foreground">
            <Users className="mr-2 h-5 w-5 text-primary" /> Smart Lead Tracker
            </CardTitle>
            {/* Display current user context */}
            <div className="text-xs text-muted-foreground flex items-center">
                <UserIcon className="h-3.5 w-3.5 mr-1 text-primary/70" /> User: <span className="font-medium text-foreground/80 ml-1">{currentUserId}</span>
            </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">
          Manage leads and get AI-powered insights. Data is saved in your browser for the current user context.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-3 md:gap-4 px-2 md:px-3 overflow-hidden">
        {/* Form for adding leads */}
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

        {/* Leads list and controls */}
        <div className="flex-grow flex flex-col min-h-0">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-1.5 md:mb-2 gap-2">
            <h3 className="text-sm font-medium text-foreground">Current Leads ({filteredLeads.length})</h3>
            <div className="flex gap-2 w-full sm:w-auto">
                {/* Search Input */}
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
                {/* Hidden file input for CSV import */}
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv" // Restrict to CSV files
                    className="hidden" // Visually hidden
                    id="csv-importer" // For potential label association
                  />
                {/* Import Button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={triggerFileUpload} // Programmatically click the hidden file input
                    className="h-8 text-xs bg-card hover:bg-muted/70 border-primary/30"
                    title="Import leads from CSV"
                >
                    <Upload className="mr-2 h-3.5 w-3.5" /> Import
                </Button>
                {/* Export Button */}
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

          {/* Leads List Display */}
          {leads.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-center text-muted-foreground text-xs p-4 bg-muted/20 rounded-lg">
              No leads added yet for user {currentUserId}. Use the form above to add your first lead or import from CSV.
            </div>
          ) : filteredLeads.length === 0 && searchTerm ? (
            <div className="flex-grow flex items-center justify-center text-center text-muted-foreground text-xs p-4 bg-muted/20 rounded-lg">
              No leads found matching "{searchTerm}" for user {currentUserId}.
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
                        {/* AI Insight Section */}
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
                                disabled={lead.isLoadingInsight} // Ensure button is disabled while loading
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
