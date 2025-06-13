
'use client';

import React, { useState, useMemo, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, PlusCircle, Trash2, Search } from 'lucide-react'; // Added Search icon
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  email: string;
}

const SmartLeadTracker: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Memoized filtered leads based on searchTerm
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
    // Trim inputs for validation
    const trimmedName = leadName.trim();
    const trimmedEmail = leadEmail.trim();

    if (!trimmedName || !trimmedEmail) {
      // This alert is a basic feedback. In a more complex app, inline errors would be better.
      alert('Please enter both name and email for the lead.');
      return;
    }
    // Basic email format check (can be improved with regex)
    if (!trimmedEmail.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    const newLead: Lead = {
      id: crypto.randomUUID(), // Generate a unique ID for each lead
      name: trimmedName,
      email: trimmedEmail,
    };
    // Add new lead to the beginning of the array for better UX (newest first)
    setLeads(prevLeads => [newLead, ...prevLeads]);
    // Clear input fields after adding
    setLeadName('');
    setLeadEmail('');
    // console.log('Lead added:', newLead); // For debugging/feedback
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    // console.log('Lead deleted:', leadId); // For debugging/feedback
  };

  // Determine if the add lead button should be disabled
  const isAddLeadDisabled = !leadName.trim() || !leadEmail.trim();

  return (
    <Card className="w-full h-full flex flex-col border-none shadow-none bg-transparent p-1 md:p-2">
      <CardHeader className="pb-3 pt-1 px-2 md:px-3">
        <CardTitle className="flex items-center text-lg font-headline text-foreground">
          <Users className="mr-2 h-5 w-5 text-primary" /> Smart Lead Tracker
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Manage and track your valuable leads efficiently.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-3 md:gap-4 px-2 md:px-3 overflow-hidden">
        {/* Add Lead Form Section */}
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
              disabled={isAddLeadDisabled} // Disable button based on input state
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Lead
            </Button>
          </form>
        </Card>

        <Separator className="my-1 md:my-2 bg-primary/20" />

        {/* Leads List and Filter Section */}
        <div className="flex-grow flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-1.5 md:mb-2">
            <h3 className="text-sm font-medium text-foreground">Current Leads ({filteredLeads.length})</h3>
            <div className="relative w-full max-w-[200px] sm:max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"/>
                <Input
                    type="search"
                    placeholder="Filter leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 text-xs pl-8 bg-input border-input focus:ring-primary"
                />
            </div>
          </div>

          {leads.length === 0 ? ( // Check original leads length for initial empty state
            <div className="flex-grow flex items-center justify-center text-center text-muted-foreground text-xs p-4 bg-muted/20 rounded-lg">
              No leads added yet. Use the form above to add your first lead.
            </div>
          ) : filteredLeads.length === 0 && searchTerm ? ( // Show if search yields no results
            <div className="flex-grow flex items-center justify-center text-center text-muted-foreground text-xs p-4 bg-muted/20 rounded-lg">
              No leads found matching "{searchTerm}".
            </div>
          ) : (
            <ScrollArea className="flex-grow border border-primary/20 bg-background/30 rounded-lg p-0.5">
              <div className="space-y-2 p-1.5 md:p-2">
                {filteredLeads.map((lead) => (
                  <Card key={lead.id} className="p-2.5 md:p-3 bg-card/80 backdrop-blur-sm border-primary/15 rounded-lg shadow-sm hover:border-primary/30 transition-colors">
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
