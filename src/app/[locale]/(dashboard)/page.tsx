'use client';

import React from 'react';
import Header from '@/components/common/header/header';
import { useI18n } from '@/locales/client';

export default function HomePage() {
  const t = useI18n();

  return (
    <div className="relative min-h-screen w-full">
      <Header title={t('common.dashboard')} />

      <div className="w-full p-4 lg:p-6">
        {/* begin: Power BI Dashboard */}
        <div className="mt-8">
          <div className="mt-4 w-full rounded-lg border p-5">
            <iframe
              title="Power BI Dashboard"
              width="100%"
              height="900px" // Set a specific height, adjust as needed
              src="https://app.powerbi.com/reportEmbed?reportId=0f696e3a-9dd4-4868-93c3-3a21ef6bbd9f&autoAuth=true&ctid=8fd1c308-7186-47ee-93c5-5646318d1edc"
              frameBorder="0"
              allowFullScreen
              style={{ border: 'none' }} // Remove iframe border
            ></iframe>
          </div>
        </div>
        {/* end: Power BI Dashboard */}
      </div>
    </div>
  );
}
