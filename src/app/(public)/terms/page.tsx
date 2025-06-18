// src/app/(public)/terms/page.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-foreground md:text-4xl">
              Terms of Service
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none sm:prose-base lg:prose-lg prose-headings:font-headline prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:underline">
              <p>
                Please read these Terms of Service (&quot;Terms&quot;) carefully
                before using the NexOS Platform (&quot;Service&quot;) operated
                by Us.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Service, you agree to be bound by
                these Terms. If you disagree with any part of the terms, then
                you may not access the Service.
              </p>

              <h2>2. Accounts</h2>
              <p>
                When you create an account with us, you must provide information
                that is accurate, complete, and current at all times. Failure to
                do so constitutes a breach of the Terms, which may result in
                immediate termination of your account on our Service.
              </p>

              <h2>3. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                NexOS Platform and its licensors.
              </p>

              <h2>4. User Content</h2>
              <p>
                Our Service allows you to post, link, store, share and otherwise
                make available certain information, text, graphics, videos, or
                other material (&quot;Content&quot;). You are responsible for
                the Content that you post on or through the Service, including
                its legality, reliability, and appropriateness.
              </p>

              <h2>5. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>

              <h2>6. Limitation Of Liability</h2>
              <p>
                In no event shall NexOS Platform, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages...
              </p>

              <h2>7. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with
                the laws of [Your Jurisdiction], without regard to its conflict
                of law provisions.
              </p>

              <h2>8. Changes</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. We will try to provide at least
                30 days&apos; notice prior to any new terms taking effect.
              </p>

              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at legal@nexosplatform.example.com.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
