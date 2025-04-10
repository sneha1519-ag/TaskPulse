'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Trash2, AlertCircle, CheckCircle, Users, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";


export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [status, session, router]);

  // Fetch invitations and users
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchInvitations();
      fetchUsers();
    }
  }, [session]);

  const fetchInvitations = async () => {
    try {
      const response = await fetch('/api/invitation');
      if (!response.ok) throw new Error('Failed to fetch invitations');
      const data = await response.json();
      setInvitations(data.invitations);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send invitation');
      }

      setSuccess('Invitation sent successfully!');
      setEmail('');
      fetchInvitations();
      fetchUsers(); // Refresh users since a new user might have been created
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvitation = async (id) => {
    if (!confirm('Are you sure you want to delete this invitation?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/invitation/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete invitation');

      setSuccess('Invitation deleted successfully!');
      fetchInvitations();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get non-admin users
  const nonAdminUsers = users.filter(user => user.role !== 'admin');

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className= "container mx-auto p-6 max-w-6xl">
      {/* Admin Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {session?.user?.firstName} {session?.user?.lastName}
            </h1>
            <p className="text-muted-foreground">
              Admin Dashboard
            </p>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 border-green-500 text-green-700 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="create">Create User</TabsTrigger>
        </TabsList>

        {/* Users Tab - Bento Grid */}
        <TabsContent value="users">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="card-3d logo-card fade-in animation-delay-200 bg-gradient-to-br from-[#F3F0F7] to-[#B9A7D0] dark:from-[#B2BA99] dark:to-[#59643E] border-[#6F648A]-200 dark:border-[#3C4DO3]-200 hover-border-effect">
              <CardHeader className="pb-2">
                <CardTitle className="text-black dark:text-white flex items-center gap-2 font-heading text-lg">
                  <Users className="h-5 w-5" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-black dark:text-white font-heading">{nonAdminUsers.length}</p>
                <p className="text-sm text-black dark:text-white mt-1">Non-admin user accounts</p>
              </CardContent>
            </Card>

            <Card className="card-3d logo-card fade-in animation-delay-200 bg-gradient-to-br from-[#F3F0F7] to-[#B9A7D0] dark:from-[#59643E] dark:to-[#B2BA99] border-[#6F648A]-200 dark:border-[#909B75]-800 hover-border-effect">
              <CardHeader className="pb-2">
                <CardTitle className="text-black dark:text-white flex items-center gap-2 font-heading text-lg">
                  <CheckCircle className="h-5 w-5" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-black dark:text-white font-heading">{nonAdminUsers.filter(u => u.isActive).length}</p>
                <p className="text-sm text-black dark:text-white mt-1">Active Users</p>
              </CardContent>
            </Card>

            <Card className="card-3d logo-card fade-in animation-delay-200 bg-gradient-to-br from-[#B9A7D0] to-[#F3F0F7] dark:from-[#B2BA99] dark:to-[#59643E] border-[#6F648A]-200 dark:border-[#909B75]-800 hover-border-effect">
              <CardHeader className="pb-2">
                <CardTitle className="text-black dark:text-white flex items-center gap-2 font-heading text-lg">
                  <Mail className="h-5 w-5" />
                  Pending Invites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-black dark:text-white font-heading">{invitations.filter(i => i.status === 'pending').length}</p>
                <p className="text-sm text-black dark:text-white mt-1">Pending Invites</p>
              </CardContent>
            </Card>

            <motion.div variants={itemVariants} className="md:col-span-3">
              <Card className="shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>User Accounts</CardTitle>
                  <CardDescription>Manage all non-admin users in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nonAdminUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        nonAdminUsers.map((user) => (
                          <TableRow 
                            key={user._id} 
                            onClick={() => router.push(`/admin/user/${user._id}`)}
                            className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.isActive ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Sent Invitations</CardTitle>
                <CardDescription>Manage invitations sent to users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                          No invitations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      invitations.map((invitation) => (
                        <TableRow key={invitation._id} className="hover:bg-muted/50 transition-colors duration-200">
                          <TableCell>{invitation.email}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                invitation.status === 'pending' ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-50' :
                                invitation.status === 'accepted' ? 'bg-green-50 text-green-700 hover:bg-green-50' :
                                'bg-red-50 text-red-700 hover:bg-red-50'
                              }
                            >
                              {invitation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(invitation.expiresAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <motion.div whileTap={{ scale: 0.95 }}>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteInvitation(invitation._id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Create User Tab */}
        <TabsContent value="create">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
                <CardDescription>Send an invitation to a new user</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendInvitation} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1"
                        placeholder="Enter user email address"
                        required
                      />
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button type="submit" disabled={loading} className="gap-2">
                          <UserPlus className="h-4 w-4" />
                          Send Invitation
                        </Button>
                      </motion.div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      An invitation will be sent to this email address
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 