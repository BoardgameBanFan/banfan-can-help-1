import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import i18nextScannerConf from '@/i18next-scanner.config.js';

export default getRequestConfig(async () => {
  const headerList = await headers();
  const languages = headerList.get('Accept-Language')?.split(',');

  const locale = languages.find(lang => i18nextScannerConf.options.lngs.includes(lang)) || 'en';

  return {
    locale,
    messages: (await import(`../../public/locales/${locale}/common.json`)).default,
  };
});
