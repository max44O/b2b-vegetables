'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { formatDateTime } from '@/lib/utils';
import { CheckCircle, XCircle, Ban, Eye, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface User {
  id: string;
  name: string | null;
  email: string;
  companyName: string | null;
  vatNumber: string | null;
  phoneNumber: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    rfqs: number;
  };
}

interface UserManagementProps {
  initialUsers: User[];
}

export function UserManagement({ initialUsers }: UserManagementProps) {
  const t = useTranslations('admin.userManagement');
  const tAdmin = useTranslations('admin');
  const tCommon = useTranslations('common');
  const params = useParams();
  const locale = (params?.locale as string) || 'ro';
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const { toast } = useToast();

  const handleUserAction = async (userId: string, action: 'approve' | 'reject' | 'disable' | 'enable') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local state
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, role: data.user.role }
            : user
        ));

        toast({
          title: tCommon('success'),
          description: tCommon('userUpdated'),
        });
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      toast({
        title: tCommon('error'),
        description: tCommon('userUpdateFailed'),
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'default';
      case 'CUSTOMER':
        return 'secondary';
      case 'PENDING':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('searchUsers')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRole === 'ALL' ? 'default' : 'outline'}
                onClick={() => setFilterRole('ALL')}
              >
                {t('allRoles')} ({users.length})
              </Button>
              <Button
                variant={filterRole === 'PENDING' ? 'default' : 'outline'}
                onClick={() => setFilterRole('PENDING')}
              >
                {t('pending')} ({users.filter(u => u.role === 'PENDING').length})
              </Button>
              <Button
                variant={filterRole === 'CUSTOMER' ? 'default' : 'outline'}
                onClick={() => setFilterRole('CUSTOMER')}
              >
                {t('customer')} ({users.filter(u => u.role === 'CUSTOMER').length})
              </Button>
              <Button
                variant={filterRole === 'ADMIN' ? 'default' : 'outline'}
                onClick={() => setFilterRole('ADMIN')}
              >
                {t('admin')} ({users.filter(u => u.role === 'ADMIN').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>{tAdmin('users')} ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('email')}</TableHead>
                <TableHead>{t('company')}</TableHead>
                <TableHead>{t('role')}</TableHead>
                <TableHead>{t('rfqs')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center">
                        {user.name || user.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.companyName || '-'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.email}</div>
                      {user.phoneNumber && (
                        <div className="text-muted-foreground">{user.phoneNumber}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {t(user.role.toLowerCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user._count.rfqs} {t('rfqs')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatDateTime(user.createdAt, locale)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user.role === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'approve')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {tAdmin('approve')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'reject')}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            {tAdmin('reject')}
                          </Button>
                        </>
                      )}
                      {user.role !== 'ADMIN' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUserAction(user.id, 'disable')}
                        >
                          <Ban className="h-3 w-3 mr-1" />
                          {tAdmin('disable')}
                        </Button>
                      )}
                      <Link href={`/admin/users/${user.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{tCommon('noResults')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}












