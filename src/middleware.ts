import createMiddleware from 'next-intl/middleware';

const locales = ['ro'];
const defaultLocale = 'ro';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default intlMiddleware;

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
