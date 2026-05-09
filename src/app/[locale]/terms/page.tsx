import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';

export default async function TermsPage() {
  const t = await getTranslations('terms');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {t('title')}
              </h1>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              
              {/* 1. Introducere */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('intro.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('intro.content')}
                </p>
              </div>

              {/* 2. Domeniul de aplicare */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('scope.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('scope.content')}
                </p>
              </div>

              {/* 3. Contul Utilizatorului */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('account.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('account.content')}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  {[0, 1, 2].map((index) => (
                    <li key={index}>{t(`account.responsibilities.${index}`)}</li>
                  ))}
                </ul>
                <p className="text-gray-700 leading-relaxed italic">
                  {t('account.note')}
                </p>
              </div>

              {/* 4. Încheierea Contractului */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('contract.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('contract.content')}
                </p>
              </div>

              {/* 5. Produse și Disponibilitate */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('products.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('products.content')}
                </p>
              </div>

              {/* 6. Livrare */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('delivery.title')}
                </h2>
                <p 
                  className="text-gray-700 leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: t('delivery.content') }}
                />
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  {[0, 1, 2].map((index) => (
                    <li key={index}>{t(`delivery.exceptions.${index}`)}</li>
                  ))}
                </ul>
                <p className="text-gray-700 leading-relaxed italic">
                  {t('delivery.note')}
                </p>
              </div>

              {/* 7. Prețuri și Plăți */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('pricing.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('pricing.content')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t('pricing.payment')}
                </p>
              </div>

              {/* 8. Calitate și Conformitate */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('quality.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('quality.content')}
                </p>
                <p 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t('quality.reporting') }}
                />
              </div>

              {/* 9. Returnări */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('returns.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('returns.content')}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  {[0, 1, 2].map((index) => (
                    <li key={index}>{t(`returns.cases.${index}`)}</li>
                  ))}
                </ul>
                <p className="text-gray-700 leading-relaxed italic">
                  {t('returns.note')}
                </p>
              </div>

              {/* 10. Răspundere */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('liability.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('liability.content')}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  {[0, 1, 2].map((index) => (
                    <li key={index}>{t(`liability.exclusions.${index}`)}</li>
                  ))}
                </ul>
                <p className="text-gray-700 leading-relaxed italic">
                  {t('liability.note')}
                </p>
              </div>

              {/* 11. Protecția Datelor – GDPR */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('gdpr.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('gdpr.content')}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  {[0, 1, 2].map((index) => (
                    <li key={index}>{t(`gdpr.purposes.${index}`)}</li>
                  ))}
                </ul>
                <p className="text-gray-700 leading-relaxed italic">
                  {t('gdpr.note')}
                </p>
              </div>

              {/* 12. Modificarea Termenilor */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('modifications.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('modifications.content')}
                </p>
              </div>

              {/* 13. Legea Aplicabilă și Jurisdicția */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('law.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('law.content')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t('law.disputes')}
                </p>
              </div>

              {/* 14. Contact */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('contact.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  <strong>{t('contact.email')}</strong> {process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@dimaxdistribution.ro'}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>{t('contact.phone')}</strong> {process.env.NEXT_PUBLIC_COMPANY_PHONE || ''}
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

