
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const DocsViewer: React.FC = () => {
  return (
    <Card className="w-full h-full border-none shadow-none bg-transparent p-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-sm font-medium text-foreground">
            <BookOpen className="mr-2 h-4 w-4 text-primary" /> Document Viewer App
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">This is the Document Viewer micro-application.</p>
        <p className="text-xs text-muted-foreground mt-1">Content for documents would be displayed here dynamically.</p>
      </CardContent>
    </Card>
  );
};
export default DocsViewer;
