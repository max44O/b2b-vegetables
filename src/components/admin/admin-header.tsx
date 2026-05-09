'use client';

import { useSession, signOut } from 'next-auth/react';
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
import { User, LogOut, Users, Package, FileText, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AdminHeader() {
  const { data: session } = useSession();
  const t = useTranslations('admin');
  const tNav = useTranslations('nav');

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="flex items-center space-x-2">
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
                href="/admin" 
                className="text-sm font-medium text-primary"
              >
                {t('dashboard')}
              </Link>
              <Link 
                href="/admin/users" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {t('users')}
              </Link>
              <Link 
                href="/admin/categories" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {t('categories')}
              </Link>
              <Link 
                href="/admin/products" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {t('products')}
              </Link>
              <Link 
                href="/admin/rfqs" 
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {t('rfqs')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <div className="flex items-center space-x-2">
                <Badge variant="default">ADMIN</Badge>
                
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
                    <DropdownMenuLabel>{t('title')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Home className="h-4 w-4 mr-2" />
                        {t('dashboard')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users" className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {t('users')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/products" className="flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        {t('products')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/rfqs" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        {t('rfqs')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {tNav('logout')}
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


