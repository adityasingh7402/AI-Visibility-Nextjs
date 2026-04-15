'use client';

/**
 * Friendly error states with retry buttons and contextual suggestions.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home, ArrowLeft, Search } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHome?: boolean;
  showBack?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  showHome = true,
  showBack = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{message}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        )}
        {showBack && (
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
        )}
        {showHome && (
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export function ReportNotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
        <Search className="h-8 w-8 text-amber-500" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">Report not found</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        This report may have been deleted, or the link might be incorrect.
        If you just started an analysis, it may still be processing.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/dashboard/reports">
          <Button className="gap-2">
            <Search className="h-4 w-4" /> Browse Reports
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" /> Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function EmptyBrandsState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <p className="text-5xl mb-4">🏢</p>
      <h2 className="text-xl font-bold text-foreground mb-2">No brands tracked yet</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        Start tracking brands to monitor their AI visibility over time.
        You&apos;ll see maturity levels, trends, and recommendations here.
      </p>
      <Link href="/dashboard/analysis">
        <Button className="gap-2">
          Run Your First Analysis
        </Button>
      </Link>
    </div>
  );
}

export function WelcomeState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <p className="text-6xl mb-6">👋</p>
      <h1 className="text-2xl font-black text-foreground mb-3">Welcome to AI Visibility Platform</h1>
      <p className="text-sm text-muted-foreground max-w-lg mb-8">
        Measure how visible your brand is across AI assistants like ChatGPT, Gemini, and Perplexity.
        Get actionable insights to improve your AI presence.
      </p>
      <div className="flex items-center gap-4">
        <Link href="/dashboard/analysis">
          <Button size="lg" className="gap-2 text-base font-semibold">
            🚀 Start Your First Analysis
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl w-full">
        {[
          { icon: '🔍', title: 'AEO Scan', desc: 'Quick AI mention check across providers' },
          { icon: '📊', title: 'GEO Analysis', desc: 'Full 17-dimension visibility audit' },
          { icon: '📈', title: 'Track Progress', desc: 'Monitor visibility trends over time' },
        ].map(item => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl mb-2">{item.icon}</p>
            <p className="text-sm font-bold text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
