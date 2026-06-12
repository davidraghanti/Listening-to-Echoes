
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldCheck, Key, Trash2, Lock, Loader2, Plus, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessCode {
  id: string;
  role: 'librarian' | 'author';
  label: string;
}

export default function TeamDirectoryPage() {
  const { user, profile, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [newLabel, setNewLabel] = useState('');
  const [newRole, setNewRole] = useState<'librarian' | 'author'>('author');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== 'librarian')) {
      router.push('/login');
    }
  }, [user, profile, authLoading, router]);

  const codesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'access_codes'));
  }, [db]);

  const { data: codes, loading: listLoading } = useCollection<AccessCode>(codesQuery);

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newLabel) return;

    setIsSubmitting(true);
    
    // Generate a random 10-digit code
    const generatedCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const docRef = doc(db, 'access_codes', generatedCode);
    
    const data = {
      role: newRole,
      label: newLabel.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(docRef, data);
      toast({
        title: "Access Code Created",
        description: `Code ${generatedCode} is now active for ${newLabel}.`,
      });
      setNewLabel('');
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Could not save the new access code."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCode = async (codeId: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'access_codes', codeId));
      toast({ title: "Code Revoked", description: "This access code can no longer be used." });
    } catch (err) {
      toast({ variant: "destructive", title: "Action Failed" });
    }
  };

  if (authLoading || !user || profile?.role !== 'librarian') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold font-headline text-accent">Access Management</h1>
          <p className="text-muted-foreground">Generate and manage 10-digit codes for internal repository access.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-muted">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-headline">
                  <Plus className="h-5 w-5 text-accent" />
                  New Access Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateCode} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">User/Team Label</label>
                    <Input 
                      placeholder="e.g., Editorial Team" 
                      required
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="bg-muted/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Role</label>
                    <Select value={newRole} onValueChange={(value: any) => setNewRole(value)}>
                      <SelectTrigger className="bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="librarian">Librarian</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-background hover:bg-accent/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate 10-Digit Code"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-accent shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Provide these codes to team members. They will enter the code on the login page to gain internal access.
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-muted h-full overflow-hidden">
              <CardHeader className="bg-primary/10 border-b border-muted">
                <CardTitle className="flex items-center gap-2 text-xl font-headline">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  Active Access Codes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {listLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 text-accent animate-spin" />
                  </div>
                ) : codes && codes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-muted">
                        <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Label</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Role</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">10-Digit Code</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {codes.map((item) => (
                        <TableRow key={item.id} className="border-muted hover:bg-muted/10">
                          <TableCell className="font-medium">{item.label}</TableCell>
                          <TableCell>
                            <Badge variant={item.role === 'librarian' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                              {item.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <code className="text-accent font-mono font-bold tracking-widest">{item.id}</code>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteCode(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-20 text-center text-muted-foreground italic">
                    No active access codes found.
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
