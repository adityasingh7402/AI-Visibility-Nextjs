'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Copy, Check } from 'lucide-react';

interface MarkdownReportViewerProps {
  markdown: string | null | undefined;
  brandName?: string;
  reportDate?: string;
  reportId?: string;
}

export function MarkdownReportViewer({
  markdown,
  brandName = 'report',
  reportDate,
  reportId,
}: MarkdownReportViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleDownloadMd = useCallback(() => {
    if (!markdown) return;
    const safeBrand = (brandName || 'report').replace(/[^a-zA-Z0-9_-]/g, '_');
    const dateStr = reportDate
      ? new Date(reportDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    const filename = `ai-visibility-${safeBrand}-${dateStr}.md`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [markdown, brandName, reportDate]);

  const handleDownloadPdf = useCallback(async () => {
    if (!markdown) return;
    // Dynamic import to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    const container = document.createElement('div');
    container.className = 'prose prose-sm max-w-none';
    container.style.padding = '32px';
    container.style.fontFamily = 'system-ui, sans-serif';

    // Render markdown to HTML using a temporary ReactDOM render
    // Simpler approach: convert markdown to HTML via the existing rendered element
    const rendered = document.querySelector('[data-report-markdown]');
    if (rendered) {
      container.innerHTML = rendered.innerHTML;
    } else {
      container.innerText = markdown;
    }

    const safeBrand = (brandName || 'report').replace(/[^a-zA-Z0-9_-]/g, '_');
    const dateStr = reportDate
      ? new Date(reportDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `ai-visibility-${safeBrand}-${dateStr}.pdf`,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(container)
      .save();
  }, [markdown, brandName, reportDate]);

  const handleCopyMarkdown = useCallback(async () => {
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [markdown]);

  if (!markdown) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">
            Markdown report not available for this analysis.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Reports generated after this update will include a downloadable markdown report.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Report</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
            {copied ? (
              <><Check className="h-3.5 w-3.5 mr-1.5" />Copied</>
            ) : (
              <><Copy className="h-3.5 w-3.5 mr-1.5" />Copy</>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadMd}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            .md
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            .pdf
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <article data-report-markdown className="prose prose-sm dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-table:text-sm prose-th:text-left prose-td:py-1.5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </article>
      </CardContent>
    </Card>
  );
}
