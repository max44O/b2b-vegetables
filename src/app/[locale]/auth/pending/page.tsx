import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default async function PendingPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const t = await getTranslations();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">{t('auth.pending.title')}</CardTitle>
              <CardDescription className="text-lg">
                {t('auth.pending.message')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  {t('auth.pending.contact')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Us
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="ghost">
                      Return to Home
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@dimaxdistribution.ro'}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{process.env.NEXT_PUBLIC_COMPANY_PHONE || ''}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
















