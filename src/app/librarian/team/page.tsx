"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldCheck, UserCheck, Mail, Lock, Loader2 } from 'lucide-react';
import { UserProfile } from '@/firebase/auth/use-user';

export default function TeamDirectoryPage() {
  const { user, profile, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  // Redirect if not a librarian
  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'librarian')) {
      router.push('/login');
    }
  }, [user, profile, authLoading, router]);

  // Query users with internal roles
  const teamQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'users'),
      where('role', 'in', ['librarian', 'author'])
    );
  }, [db]);

  const { data: teamMembers, loading: listLoading } = useCollection<UserProfile & { id: string }>(teamQuery);

  if (authLoading || !user || profile?.role !== 'librarian') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto animate-pulse" />
          <h2 className="text-xl font-headline font-bold">Verifying Credentials...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold font-headline text-accent">Team Directory</h1>
          <p className="text-muted-foreground">Authorized personnel with access to internal archives and creative tools.</p>
        </div>

        <Card className="bg-card/50 border-muted overflow-hidden">
          <CardHeader className="bg-primary/10 border-b border-muted">
            <CardTitle className="flex items-center gap-2 text-xl font-headline">
              <ShieldCheck className="h-5 w-5 text-accent" />
              Internal Authorization List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {listLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 text-accent animate-spin" />
              </div>
            ) : teamMembers && teamMembers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-muted">
                    <TableHead className="w-[300px] text-[10px] uppercase tracking-widest text-muted-foreground">User Email</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Role</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id} className="border-muted hover:bg-muted/10 transition-colors">
                      <TableCell className="font-medium flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {member.email}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={member.role === 'librarian' ? 'default' : 'secondary'} 
                          className="text-[10px] uppercase px-3 py-0.5"
                        >
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-xs text-green-400">
                          <UserCheck className="h-3 w-3" />
                          Authorized
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-20 text-center text-muted-foreground italic">
                No authorized personnel found in the directory.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
