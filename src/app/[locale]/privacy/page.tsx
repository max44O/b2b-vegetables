import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');

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
              <p className="text-lg text-gray-600 italic">
                {t('subtitle')}
              </p>
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

              {/* 2. Operator de date */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('operator.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('operator.content')}
                </p>
                <p className="text-gray-700 leading-relaxed mb-2">
                  {t('operator.contact')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>{t('operator.email')}</strong> {process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@dimaxdistribution.ro'}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>{t('operator.phone')}</strong> {process.env.NEXT_PUBLIC_COMPANY_PHONE || ''}
                </p>
              </div>

              {/* 3. Datele colectate */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('data.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('data.content')}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <li key={index}>{t(`data.categories.${index}`)}</li>
                  ))}
                </ul>
              </div>

              {/* 4. Scopul prelucrării datelor */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('purpose.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('purpose.content')}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <li key={index}>{t(`purpose.purposes.${index}`)}</li>
                  ))}
                </ul>
                <p className="text-gray-700 leading-relaxed italic">
                  {t('purpose.note')}
                </p>
              </div>

              {/* 5. Temeiul legal */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('legal.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('legal.content')}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {[0, 1, 2, 3].map((index) => (
                    <li key={index}>{t(`legal.bases.${index}`)}</li>
                  ))}
                </ul>
              </div>

              {/* 6. Stocarea datelor */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('storage.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('storage.content')}
                </p>
              </div>

              {/* 7. Partajarea datelor */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('sharing.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('sharing.content')}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  {[0, 1, 2].map((index) => (
                    <li key={index}>{t(`sharing.parties.${index}`)}</li>
                  ))}
                </ul>
                <p className="text-gray-700 leading-relaxed italic">
                  {t('sharing.note')}
                </p>
              </div>

              {/* 8. Drepturile utilizatorului */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('rights.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('rights.content')}
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                  {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                    <li key={index}>{t(`rights.list.${index}`)}</li>
                  ))}
                </ul>
                <p className="text-gray-700 leading-relaxed italic">
                  {t('rights.note')}
                </p>
              </div>

              {/* 9. Securitatea datelor */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('security.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('security.content')}
                </p>
              </div>

              {/* 10. Cookies */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('cookies.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('cookies.content')}
                </p>
                <p className="text-gray-700 leading-relaxed italic">
                  {t('cookies.note')}
                </p>
              </div>

              {/* 11. Modificarea Politicii */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('modifications.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('modifications.content')}
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





