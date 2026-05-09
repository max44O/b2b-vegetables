import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search } from 'lucide-react';
import { Header } from '@/components/navigation/header';
import { Footer } from '@/components/navigation/footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">404 - Pagină negăsită</CardTitle>
            <CardDescription>
              Pagina pe care o cauți nu există sau a fost mutată.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Acasă
                </Button>
              </Link>
              <Link href="/products" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Produse
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}





