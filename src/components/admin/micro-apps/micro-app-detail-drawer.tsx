
// src/components/admin/micro-apps/micro-app-detail-drawer.tsx
'use client';

import React, { useEffect, useState } from 'react'; // Added React import
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Save, PackageOpen, Settings2, AlertTriangle, DollarSign, ListChecks, Info, SlidersHorizontal, Users2, Eye, CreditCard } from 'lucide-react';
import type { MicroApp } from '@/types/micro-app';
import { Badge } from '@/components/ui/badge';

interface MicroAppDetailDrawerProps {
  app: MicroApp | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedApp: MicroApp) => void;
  availableAgents: string[];
}

const appCategories = ["Automation", "Analytics", "Security", "Productivity", "Development", "Monitoring", "Communication", "Utilities", "Core OS"];
const appStatuses: MicroApp['status'][] = ['enabled', 'disabled', 'dev-only', 'archived', 'beta'];
const deployableToOptions: MicroApp['deployableTo'][0][] = ['dashboard', 'loom-studio', 'dedicated-tab', 'none'];


export function MicroAppDetailDrawer({ app, isOpen, onOpenChange, onSave, availableAgents }: MicroAppDetailDrawerProps) {
  const [formData, setFormData] = useState<Partial<MicroApp>>(app || {});

  useEffect(() => {
    const initialMonetization = app?.monetization || { 
        enabled: false, 
        price: undefined, 
        billingCycle: undefined, 
        billingAgent: undefined,
        pricingTierId: undefined,
        stripeProductId: undefined,
        accessControlFlags: []
    };
    setFormData(app ? { ...app, monetization: initialMonetization } : { isVisible: true, monetization: initialMonetization });
  }, [app, isOpen]);

  if (!app) return null;

  const handleChange = (field: keyof MicroApp, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNestedChange = (outerField: keyof MicroApp, innerField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [outerField]: {
        // @ts-ignore
        ...(prev[outerField] || {}),
        [innerField]: value,
      },
    }));
  };


  const handleSaveClick = () => {
    const mergedApp = { ...app, ...formData };
    if (!mergedApp.displayName || !mergedApp.internalName) {
        alert("Display Name and Internal Name are required.");
        return;
    }
    // Ensure monetization object is structured correctly even if disabled
    if (!mergedApp.monetization?.enabled) {
        mergedApp.monetization = {
            enabled: false,
            // Keep other fields as they are or reset them
            price: mergedApp.monetization?.price,
            billingCycle: mergedApp.monetization?.billingCycle,
            billingAgent: mergedApp.monetization?.billingAgent,
            pricingTierId: mergedApp.monetization?.pricingTierId,
            stripeProductId: mergedApp.monetization?.stripeProductId,
            accessControlFlags: mergedApp.monetization?.accessControlFlags,
        };
    }

    onSave(mergedApp as MicroApp);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-border/60">
          <SheetTitle className="font-headline text-lg flex items-center">
            <PackageOpen className="mr-2 h-5 w-5 text-primary" />
            Edit: {formData.displayName || app.displayName}
          </SheetTitle>
          <SheetDescription className="text-xs">
            Internal ID: {app.id} | Version: {formData.version || app.version}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="grid gap-4 p-4">
            <div className="grid gap-1.5">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" value={formData.displayName || ''} onChange={(e) => handleChange('displayName', e.target.value)} className="bg-input border-input focus:ring-primary"/>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="internalName">Internal Name / Slug</Label>
              <Input id="internalName" value={formData.internalName || ''} onChange={(e) => handleChange('internalName', e.target.value)} className="bg-input border-input focus:ring-primary"/>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} className="min-h-[80px] bg-input border-input focus:ring-primary"/>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="icon">Icon (Lucide Name)</Label>
                    <Input id="icon" value={formData.icon || ''} onChange={(e) => handleChange('icon', e.target.value)} placeholder="e.g., Workflow" className="bg-input border-input focus:ring-primary"/>
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="version">Version</Label>
                    <Input id="version" value={formData.version || ''} onChange={(e) => handleChange('version', e.target.value)} placeholder="e.g., 1.0.0" className="bg-input border-input focus:ring-primary"/>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
                        <SelectTrigger id="category" className="bg-input border-input focus:ring-primary"><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>{appCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(val) => handleChange('status', val as MicroApp['status'])}>
                        <SelectTrigger id="status" className="bg-input border-input focus:ring-primary"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>{appStatuses.map(stat => <SelectItem key={stat} value={stat}>{stat}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" value={formData.tags?.join(', ') || ''} onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))} placeholder="e.g., ai, workflow, utility" className="bg-input border-input focus:ring-primary"/>
            </div>
            
            <Accordion type="multiple" className="w-full" defaultValue={["agents", "monetization", "flagsAndPermissions"]}>
                <AccordionItem value="agents">
                    <AccordionTrigger className="text-sm font-medium py-2 px-1 hover:no-underline"><Users2 className="mr-2 h-4 w-4 text-primary/80"/>Agent Dependencies</AccordionTrigger>
                    <AccordionContent className="pt-2 pb-0 px-1">
                        <div className="grid gap-1.5">
                            <Label htmlFor="agentDependencies" className="sr-only">Agent Dependencies</Label>
                            <Textarea 
                                id="agentDependencies" 
                                placeholder="Agent names, comma-separated"
                                value={formData.agentDependencies?.join(', ') || ''}
                                onChange={(e) => handleChange('agentDependencies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                                className="min-h-[60px] text-xs bg-input border-input focus:ring-primary"
                            />
                            <p className="text-xs text-muted-foreground">Available (example): {availableAgents.join(', ')}</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="deployment">
                    <AccordionTrigger className="text-sm font-medium py-2 px-1 hover:no-underline"><SlidersHorizontal className="mr-2 h-4 w-4 text-primary/80"/>Deployment & Entry</AccordionTrigger>
                    <AccordionContent className="pt-2 pb-0 px-1 space-y-3">
                         <div className="grid gap-1.5">
                            <Label htmlFor="entryPoint">Entry Point Path</Label>
                            <Input id="entryPoint" value={formData.entryPoint || ''} onChange={(e) => handleChange('entryPoint', e.target.value)} placeholder="e.g., /app/my-micro-app" className="bg-input border-input focus:ring-primary"/>
                        </div>
                         <div className="grid gap-1.5">
                            <Label htmlFor="deployableTo">Deployable To</Label>
                            <Select value={formData.deployableTo?.[0]} onValueChange={(val) => handleChange('deployableTo', [val as MicroApp['deployableTo'][0]])}>
                                <SelectTrigger id="deployableTo" className="bg-input border-input focus:ring-primary"><SelectValue placeholder="Select deploy target" /></SelectTrigger>
                                <SelectContent>{deployableToOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                            </Select>
                             <p className="text-xs text-muted-foreground">Currently supports single selection for simplicity.</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="monetization">
                    <AccordionTrigger className="text-sm font-medium py-2 px-1 hover:no-underline"><CreditCard className="mr-2 h-4 w-4 text-primary/80"/>Monetization & Pricing</AccordionTrigger>
                    <AccordionContent className="pt-2 pb-0 px-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="monetizationEnabled">Enable Monetization</Label>
                            <Switch id="monetizationEnabled" checked={formData.monetization?.enabled || false} onCheckedChange={(checked) => handleNestedChange('monetization', 'enabled', checked)} />
                        </div>
                        {formData.monetization?.enabled && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="price">Price</Label>
                                        <Input id="price" type="number" value={formData.monetization?.price || ''} onChange={(e) => handleNestedChange('monetization', 'price', parseFloat(e.target.value) || undefined)} placeholder="e.g., 19.99" className="bg-input border-input focus:ring-primary"/>
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="billingCycle">Billing Cycle</Label>
                                        <Select value={formData.monetization?.billingCycle} onValueChange={(val) => handleNestedChange('monetization', 'billingCycle', val)}>
                                            <SelectTrigger id="billingCycle" className="bg-input border-input focus:ring-primary"><SelectValue placeholder="Select cycle" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                                <SelectItem value="one-time">One-Time</SelectItem>
                                                <SelectItem value="usage-based">Usage-Based</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="billingAgent">Billing Agent</Label>
                                    <Select value={formData.monetization?.billingAgent} onValueChange={(val) => handleNestedChange('monetization', 'billingAgent', val)}>
                                        <SelectTrigger id="billingAgent" className="bg-input border-input focus:ring-primary"><SelectValue placeholder="Select billing agent" /></SelectTrigger>
                                        <SelectContent>{availableAgents.filter(a=>a !== 'None').map(agent => <SelectItem key={agent} value={agent}>{agent}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="pricingTierId">Pricing Tier ID</Label>
                                    <Input id="pricingTierId" value={formData.monetization?.pricingTierId || ''} onChange={(e) => handleNestedChange('monetization', 'pricingTierId', e.target.value)} placeholder="e.g., pro_tier_monthly" className="bg-input border-input focus:ring-primary"/>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="stripeProductId">Stripe Product ID</Label>
                                    <Input id="stripeProductId" value={formData.monetization?.stripeProductId || ''} onChange={(e) => handleNestedChange('monetization', 'stripeProductId', e.target.value)} placeholder="e.g., prod_XyzAbc123" className="bg-input border-input focus:ring-primary"/>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="accessControlFlags">Access Control Flags (comma-separated)</Label>
                                    <Input 
                                        id="accessControlFlags" 
                                        value={formData.monetization?.accessControlFlags?.join(', ') || ''} 
                                        onChange={(e) => handleNestedChange('monetization', 'accessControlFlags', e.target.value.split(',').map(f => f.trim()).filter(f => f))}
                                        placeholder="e.g., pro_access, beta_feature" 
                                        className="bg-input border-input focus:ring-primary"
                                    />
                                </div>
                            </>
                        )}
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="flagsAndPermissions">
                    <AccordionTrigger className="text-sm font-medium py-2 px-1 hover:no-underline"><ListChecks className="mr-2 h-4 w-4 text-primary/80"/>Flags & Permissions</AccordionTrigger>
                    <AccordionContent className="pt-2 pb-0 px-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isVisible" className="text-sm">Visible on Dashboard/Launchpad</Label>
                            <Switch id="isVisible" checked={formData.isVisible === undefined ? true : formData.isVisible} onCheckedChange={(val) => handleChange('isVisible', val)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="authRequired" className="text-sm">Authentication Required</Label>
                            <Switch id="authRequired" checked={formData.authRequired || false} onCheckedChange={(val) => handleChange('authRequired', val)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="isFeatured" className="text-sm">Featured App</Label>
                            <Switch id="isFeatured" checked={formData.flags?.isFeatured || false} onCheckedChange={(val) => handleNestedChange('flags', 'isFeatured', val)} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="requiresBeta" className="text-sm">Requires OS Beta Feature</Label>
                            <Switch id="requiresBeta" checked={formData.flags?.requiresBetaFeature || false} onCheckedChange={(val) => handleNestedChange('flags', 'requiresBetaFeature', val)} />
                        </div>
                         <div className="flex items-center justify-between">
                            <Label htmlFor="systemInternal" className="text-sm">System Internal (Hidden)</Label>
                            <Switch id="systemInternal" checked={formData.flags?.systemInternal || false} onCheckedChange={(val) => handleNestedChange('flags', 'systemInternal', val)} />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="permissionsRequired" className="text-sm">Permissions Required (comma-separated)</Label>
                            <Input id="permissionsRequired" value={formData.permissionsRequired?.join(', ') || ''} onChange={(e) => handleChange('permissionsRequired', e.target.value.split(',').map(t => t.trim()).filter(t => t))} placeholder="e.g., agent:execute, file:read" className="bg-input border-input focus:ring-primary"/>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

          </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t border-border/60">
          <SheetClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={handleSaveClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

    