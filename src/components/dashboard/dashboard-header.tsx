'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, ShoppingCart, FileText } from 'lucide-react';

export function DashboardHeader() {
  const { data: session } = useSession();
  const t = useTranslations('nav');
  const tRfq = useTranslations('rfq');

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-32 flex items-center justify-start">
                <img
                  src="/logo.png"
                  alt="Dimax Distribution"
                  className="h-full w-auto object-contain max-w-full"
                  style={{ display: 'block' }}
                  onError={(e) => {
                    console.error('Logo failed to load:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-primary"
              >
                {t('dashboard')}
              </Link>
              <Link 
                href="/products" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {t('products')}
              </Link>
              <Link 
                href="/rfq/cart" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {tRfq('cart')}
              </Link>
              <Link 
                href="/rfq/my-requests" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {tRfq('myRequests')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <div className="flex items-center space-x-2">
                <Badge variant={session.user.role === 'ADMIN' ? 'default' : 'secondary'}>
                  {session.user.role}
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {session.user.name || session.user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {t('dashboard')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/rfq/cart" className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {tRfq('cart')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/rfq/my-requests" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {tRfq('myRequests')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


