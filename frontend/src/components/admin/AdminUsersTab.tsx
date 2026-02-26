import { useState, useMemo } from 'react';
import { useGetAllUsers, useAssignUserRole } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Loader2, AlertCircle, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { Principal } from '@icp-sdk/core/principal';
import { UserRole } from '../../backend';
import { toast } from 'sonner';

export default function AdminUsersTab() {
  const { data: users, isLoading } = useGetAllUsers();
  const assignRole = useAssignUserRole();
  const [principalInput, setPrincipalInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Validate Principal ID format
  const isPrincipalValid = (principalStr: string): boolean => {
    try {
      Principal.fromText(principalStr);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddUser = async () => {
    const trimmedPrincipal = principalInput.trim();
    
    if (!trimmedPrincipal) {
      toast.error('Please enter a Principal ID');
      return;
    }

    if (!isPrincipalValid(trimmedPrincipal)) {
      toast.error('Invalid Principal ID format');
      return;
    }

    try {
      const principal = Principal.fromText(trimmedPrincipal);
      await assignRole.mutateAsync({ principal, role: UserRole.admin });
      toast.success('User added/promoted to admin successfully');
      setPrincipalInput('');
    } catch (error: any) {
      console.error('Failed to add user:', error);
      toast.error(error.message || 'Failed to add user');
    }
  };

  const handlePromote = async (principalStr: string) => {
    try {
      const principal = Principal.fromText(principalStr);
      await assignRole.mutateAsync({ principal, role: UserRole.admin });
      toast.success('User promoted to admin');
    } catch (error: any) {
      console.error('Failed to promote user:', error);
      toast.error(error.message || 'Failed to promote user');
    }
  };

  const handleDemote = async (principalStr: string) => {
    // Check if this is the last admin
    const adminCount = users?.filter((u) => u.role === UserRole.admin).length || 0;
    if (adminCount <= 1) {
      toast.error('Cannot demote the last remaining admin');
      return;
    }

    try {
      const principal = Principal.fromText(principalStr);
      await assignRole.mutateAsync({ principal, role: UserRole.user });
      toast.success('User demoted to user');
    } catch (error: any) {
      console.error('Failed to demote user:', error);
      toast.error(error.message || 'Failed to demote user');
    }
  };

  // Filter users based on search and role filter
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter((user) => {
      const principalStr = user.principal.toString();
      const matchesSearch = principalStr.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const getRoleBadgeVariant = (role: UserRole): 'default' | 'secondary' | 'outline' => {
    switch (role) {
      case UserRole.admin:
        return 'default';
      case UserRole.user:
        return 'secondary';
      case UserRole.guest:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const adminCount = users?.filter((u) => u.role === UserRole.admin).length || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add User</CardTitle>
          <CardDescription>Add a new user or promote an existing user to admin by entering their Principal ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="principal">Principal ID</Label>
              <Input
                id="principal"
                value={principalInput}
                onChange={(e) => setPrincipalInput(e.target.value)}
                placeholder="Enter Internet Identity Principal ID"
                disabled={assignRole.isPending}
              />
            </div>
            <Button
              onClick={handleAddUser}
              disabled={!principalInput.trim() || assignRole.isPending}
              size="icon"
            >
              {assignRole.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>View and manage user roles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Principal ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={UserRole.admin}>Admin</SelectItem>
                <SelectItem value={UserRole.user}>User</SelectItem>
                <SelectItem value={UserRole.guest}>Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !users || users.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No users found.</AlertDescription>
            </Alert>
          ) : filteredUsers.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No users match your search criteria.</AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Principal ID</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const principalStr = user.principal.toString();
                    const isLastAdmin = user.role === UserRole.admin && adminCount <= 1;

                    return (
                      <TableRow key={principalStr}>
                        <TableCell className="font-mono text-xs">
                          <div className="max-w-[300px] truncate" title={principalStr}>
                            {principalStr}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {user.role !== UserRole.admin && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePromote(principalStr)}
                                disabled={assignRole.isPending}
                              >
                                <ChevronUp className="mr-1 h-3 w-3" />
                                Promote
                              </Button>
                            )}
                            {user.role === UserRole.admin && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDemote(principalStr)}
                                disabled={assignRole.isPending || isLastAdmin}
                                title={isLastAdmin ? 'Cannot demote the last admin' : 'Demote to user'}
                              >
                                <ChevronDown className="mr-1 h-3 w-3" />
                                Demote
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
