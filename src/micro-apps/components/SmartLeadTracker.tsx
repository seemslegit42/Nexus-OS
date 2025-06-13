
'use client';

import React, { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Lead {
  id: string;
  name: string;
  email: string;
}

const SmartLeadTracker: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');

  const handleAddLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) {
      // Basic validation: ensure name and email are not empty
      // In a real app, add more robust validation (e.g., email format)
      alert('Please enter both name and email for the lead.');
      return;
    }
    const newLead: Lead = {
      id: crypto.randomUUID(),
      name: leadName.trim(),
      email: leadEmail.trim(),
    };
    setLeads(prevLeads => [newLead, ...prevLeads]);
    setLeadName('');
    setLeadEmail('');
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
  };

  return (
    <Card className="w-full h-full flex flex-col border-none shadow-none bg-transparent p-1 md:p-2">
      <CardHeader className="pb-3 pt-1 px-2 md:px-3">
        <CardTitle className="flex items-center text-lg font-headline text-foreground">
          <Users className="mr-2 h-5 w-5 text-primary" /> Smart Lead Tracker
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Manage and track your valuable leads.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-3 md:gap-4 px-2 md:px-3 overflow-hidden">
        <Card className="bg-card/70 backdrop-blur-sm border-primary/20 rounded-xl p-3 md:p-4 shadow-lg">
          <form onSubmit={handleAddLead} className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Add New Lead</h3>
            <div className="grid gap-1.5">
              <Label htmlFor="leadName" className="text-xs">Lead Name</Label>
              <Input
                id="leadName"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="e.g., Ada Lovelace"
                required
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
                required
                className="h-9 text-sm bg-input border-input focus:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full h-9 text-sm bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Lead
            </Button>
          </form>
        </Card>

        <Separator className="my-1 md:my-2 bg-primary/20" />

        <div className="flex-grow flex flex-col min-h-0">
          <h3 className="text-sm font-medium text-foreground mb-1.5 md:mb-2">Current Leads ({leads.length})</h3>
          {leads.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-center text-muted-foreground text-xs p-4 bg-muted/20 rounded-lg">
              No leads added yet. Use the form above to add your first lead.
            </div>
          ) : (
            <ScrollArea className="flex-grow border border-primary/20 bg-background/30 rounded-lg p-0.5">
              <div className="space-y-2 p-1.5 md:p-2">
                {leads.map((lead) => (
                  <Card key={lead.id} className="p-2.5 md:p-3 bg-card/80 backdrop-blur-sm border-primary/15 rounded-lg shadow-sm">
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
