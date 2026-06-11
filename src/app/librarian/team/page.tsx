
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, setDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, UserCheck, Mail, Lock, Loader2, UserPlus, ShieldAlert } from 'lucide-react';
import { UserProfile } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function TeamDirectoryPage() {
  const { user, profile, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'librarian' | 'author'>('author');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newEmail) return;

    setIsSubmitting(true);
    const email = newEmail.trim().toLowerCase();
    const docRef = doc(db, 'users', email);
    const data = {
      email,
      role: newRole,
      grantedBy: user?.email,
      grantedAt: new Date().toISOString(),
    };

    setDoc(docRef, data, { merge: true })
      .then(() => {
        toast({
          title: "Access Granted",
          description: `${email} has been authorized as a ${newRole}.`,
        });
        setNewEmail('');
      })
      .catch(async (err) => {
        const pError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: data
        });
        errorEmitter.emit('permission-error', pError);
      })
      .finally(() => setIsSubmitting(false));
  };

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
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold font-headline text-accent">Team Directory</h1>
            <p className="text-muted-foreground">Authorized personnel with access to internal archives and creative tools.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Grant Access Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-headline">
                  <UserPlus className="h-5 w-5 text-accent" />
                  Grant Internal Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGrantAccess} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Email Address</label>
                    <Input 
                      placeholder="colleague@university.edu" 
                      type="email" 
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="bg-muted/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Designated Role</label>
                    <Select 
                      value={newRole} 
                      onValueChange={(value: any) => setNewRole(value)}
                    >
                      <SelectTrigger className="bg-muted/20">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="librarian">Librarian (Reviewer)</SelectItem>
                        <SelectItem value="author">Author (Content Creator)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-background hover:bg-accent/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Member"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-destructive/5 border-destructive/20 p-4">
              <div className="flex gap-3">
                <ShieldAlert className="h-5 w-5 text-destructive shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-destructive uppercase">Administrative Notice</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Authorizing a member gives them access to non-redacted stories and sensitive qualitative data. Verify identity before granting status.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Directory Table */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-muted overflow-hidden h-full">
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
                        <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Authorized Email</TableHead>
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
                              Active
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
          </div>
        </div>
      </main>
    </div>
  );
}
