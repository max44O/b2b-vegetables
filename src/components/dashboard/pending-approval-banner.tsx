'use client';

import { useTranslations } from 'next-intl';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function PendingApprovalBanner() {
  const t = useTranslations('dashboard.pendingApproval');

  return (
    <Alert className="mb-6 border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <strong>{t('title')}</strong> - {t('message')}
      </AlertDescription>
    </Alert>
  );
}
















