// src/app/home/page.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, LayoutGrid, PlusCircle, Settings, Search } from "lucide-react"; // Added Search

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-headline text-foreground">Dashboard</h1>
        <Link href="/home/items/new" legacyBehavior>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <a><PlusCircle className="mr-2 h-4 w-4" /> Create New Item</a>
          </Button>
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Micro-Apps</CardTitle> {/* Changed from Modules */}
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Across all items
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 New Edits</div>
            <p className="text-xs text-muted-foreground">
              In the last 24 hours
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 md:gap-4">
            <Link href="/home/items" legacyBehavior><Button asChild variant="outline"><a>View All Items</a></Button></Link>
            <Link href="/explore" legacyBehavior><Button asChild variant="outline"><a><Search className="mr-2 h-4 w-4"/>Explore Marketplace</a></Button></Link> {/* Updated to Explore Marketplace */}
            <Link href="/account/profile" legacyBehavior><Button asChild variant="outline"><a>Account Settings</a></Button></Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
