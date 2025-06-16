
// src/app/(public)/privacy/page.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-headline text-foreground">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:font-headline prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:underline">
              <p>Welcome to NexOS Platform&apos;s Privacy Policy. This policy describes how we collect, use, and handle your personal information when you use our services.</p>

              <h2>1. Information We Collect</h2>
              <p>We may collect information you provide directly to us, such as when you create an account, as well as information automatically collected when you use our services (e.g., IP address, browser type).</p>
              
              <h2>2. How We Use Your Information</h2>
              <p>We use your information to provide, maintain, and improve our services, to communicate with you, and for security purposes.</p>

              <h2>3. Information Sharing</h2>
              <p>We do not sell your personal information. We may share information with third-party service providers who assist us in operating our platform, under strict confidentiality agreements.</p>
              
              <h2>4. Data Security</h2>
              <p>We implement industry-standard security measures to protect your information. However, no system is completely secure.</p>

              <h2>5. Your Choices</h2>
              <p>You can access and update your account information. You may also have rights regarding your data under applicable laws.</p>

              <h2>6. Changes to This Policy</h2>
              <p>We may update this policy from time to time. We will notify you of any significant changes.</p>

              <h2>7. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@nexosplatform.example.com.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

