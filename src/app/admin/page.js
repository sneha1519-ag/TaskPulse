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
import { Skeleton } from "@/components/ui/skeleton";
import {
  UserPlus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Users,
  Mail,
  Calendar,
  Shield,
  Search,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvites, setShowInvites] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -5,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.06,
        duration: 0.35,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
    hover: {
      backgroundColor: "var(--subtle-hover)",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } }
  };

  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

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
      Promise.all([fetchInvitations(), fetchUsers()])
          .finally(() => {
            // Add a slight delay for a smoother transition
            setTimeout(() => setLoading(false), 300);
          });
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
      setActionLoading(true);
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
      setActionLoading(false);
    }
  };

  const handleDeleteInvitation = async (id) => {
    if (!confirm('Are you sure you want to delete this invitation?')) return;

    try {
      setActionLoading(true);
      const response = await fetch(`/api/invitation/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete invitation');

      setSuccess('Invitation deleted successfully!');
      fetchInvitations();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Get non-admin users and filter based on search term
  const nonAdminUsers = users.filter(user => user.role !== 'admin');
  const filteredUsers = searchTerm
      ? nonAdminUsers.filter(user =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
      : nonAdminUsers;

  // Filter invitations based on search term
  const filteredInvitations = searchTerm
      ? invitations.filter(invitation => invitation.email.toLowerCase().includes(searchTerm.toLowerCase()))
      : invitations;

  // Loading skeleton screen
  if (status === 'loading' || loading) {
    return (
        <div className="container mx-auto p-6 space-y-10 max-w-7xl">
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-6"
          >
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Skeleton className="h-40 rounded-2xl" />
                </motion.div>
            ))}
          </div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Skeleton className="h-96 rounded-2xl" />
          </motion.div>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-7xl">
        {/* Admin Header */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10"
        >
          <div className="flex items-center gap-5">
            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
            >
              <Avatar className="h-16 w-16 border-2 border-primary/10 shadow-lg">
                <AvatarImage src={session?.user?.image} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                  {session?.user?.firstName?.[0]}{session?.user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome, {session?.user?.firstName} {session?.user?.lastName}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            className="relative w-full sm:w-72 mt-4 sm:mt-0"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search users or invites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 rounded-2xl border-primary/20 shadow-sm focus-visible:ring-primary bg-background hover:border-primary/40 transition-all duration-300"
            />
          </motion.div>
        </motion.div>

        {/* Notifications */}
        <AnimatePresence>
          {error && (
              <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                  className="mb-8"
              >
                <Alert variant="destructive" className="border-red-200 shadow-md rounded-2xl">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="ml-2 text-base">{error}</AlertDescription>
                </Alert>
              </motion.div>
          )}

          {success && (
              <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                  className="mb-8"
              >
                <Alert className="border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 shadow-md rounded-2xl">
                  <CheckCircle className="h-5 w-5" />
                  <AlertDescription className="ml-2 text-base">{success}</AlertDescription>
                </Alert>
              </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-10">
          <TabsList className="w-full max-w-md mx-auto md:w-auto grid grid-cols-3 md:inline-flex rounded-2xl p-1.5 shadow-md bg-background border-primary/10 border">
            <TabsTrigger value="users" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:dark:bg-primary data-[state=active]:dark:text-primary-foreground transition-all duration-300">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="invitations" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:dark:bg-primary data-[state=active]:dark:text-primary-foreground transition-all duration-300">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Invitations</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:dark:bg-primary data-[state=active]:dark:text-primary-foreground transition-all duration-300">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Create User</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Statistics Cards */}
              <motion.div variants={itemVariants} whileHover="hover">
                <motion.div variants={cardHoverVariants}>
                  <Card className="overflow-hidden border-0 shadow-lg rounded-2xl bg-gradient-to-br from-white to-blue-50 dark:from-black dark:to-blue-950/30 transition-all duration-300 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2.5 rounded-full bg-blue-100 dark:bg-blue-900/30 shadow-inner">
                          <Users className="h-5 w-5 text-primary dark:text-primary" />
                        </div>
                        Total Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-5xl font-bold text-primary dark:text-primary">
                        {nonAdminUsers.length}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Non-admin user accounts
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} whileHover="hover">
                <motion.div variants={cardHoverVariants}>
                  <Card className="overflow-hidden border-0 shadow-lg rounded-2xl bg-gradient-to-br from-white to-green-50 dark:from-black dark:to-green-950/30 transition-all duration-300 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2.5 rounded-full bg-green-100 dark:bg-green-900/30 shadow-inner">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        Active Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-5xl font-bold text-green-600 dark:text-green-400">
                        {nonAdminUsers.filter(u => u.isActive).length}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Active user accounts
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} whileHover="hover">
                <motion.div variants={cardHoverVariants}>
                  <Card className="overflow-hidden border-0 shadow-lg rounded-2xl bg-gradient-to-br from-white to-amber-50 dark:from-black dark:to-amber-950/30 transition-all duration-300 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2.5 rounded-full bg-amber-100 dark:bg-amber-900/30 shadow-inner">
                          <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        Pending Invites
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">
                        {invitations.filter(i => i.status === 'pending').length}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Awaiting acceptance
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Users Table */}
              <motion.div variants={itemVariants} className="md:col-span-3">
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <CardHeader className="bg-card px-6 border-b border-primary/5">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <CardTitle className="text-2xl">User Accounts</CardTitle>
                        <CardDescription className="text-base mt-1">
                          Manage all non-admin users in the system
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="font-normal text-base py-1.5 px-3 rounded-full">
                        {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-b border-primary/5">
                            <TableHead className="w-1/3 text-base font-medium">User</TableHead>
                            <TableHead className="w-1/3 text-base font-medium">Email</TableHead>
                            <TableHead className="w-1/6 text-base font-medium">Role</TableHead>
                            <TableHead className="w-1/6 text-base font-medium">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <AnimatePresence>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center py-16 text-muted-foreground text-lg">
                                    {searchTerm ? 'No matching users found' : 'No users found'}
                                  </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user, i) => (
                                    <motion.tr
                                        key={user._id}
                                        custom={i}
                                        variants={tableRowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        whileHover="hover"
                                        onClick={() => router.push(`/admin/user/${user._id}`)}
                                        className="cursor-pointer group transition-colors duration-300"
                                        style={{ "--subtle-hover": "var(--hover-bg)" }}
                                    >
                                      <TableCell className="py-4">
                                        <div className="flex items-center gap-4">
                                          <motion.div
                                              whileHover={{ scale: 1.08 }}
                                              transition={{ duration: 0.2 }}
                                          >
                                            <Avatar className="h-12 w-12 border-2 border-primary/10 shadow-md transition-transform group-hover:border-primary/30 duration-300">
                                              <AvatarImage src={user.profileImage} />
                                              <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">
                                                {user.firstName?.[0]}{user.lastName?.[0]}
                                              </AvatarFallback>
                                            </Avatar>
                                          </motion.div>
                                          <div>
                                            <p className="font-medium text-lg">{user.firstName} {user.lastName}</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                              <Activity className="h-3 w-3" />
                                              Last active: {new Date().toLocaleDateString()}
                                            </p>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell className="font-mono text-base">{user.email}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-medium text-sm py-1 px-2 rounded-xl">
                                          {user.role}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {user.isActive ? (
                                            <Badge variant="outline" className="bg-green-50/80 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800 flex items-center gap-1.5 font-medium text-sm py-1 px-2 rounded-xl">
                                              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                              Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-red-50/80 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800 font-medium text-sm py-1 px-2 rounded-xl">
                                              Inactive
                                            </Badge>
                                        )}
                                      </TableCell>
                                    </motion.tr>
                                ))
                            )}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </div>
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
                transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
            >
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                <CardHeader className="bg-card px-6 border-b border-primary/5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl">Sent Invitations</CardTitle>
                      <CardDescription className="text-base mt-1">
                        Manage invitations sent to new users
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="font-normal text-base py-1.5 px-3 rounded-full">
                      {filteredInvitations.length} {filteredInvitations.length === 1 ? 'Invitation' : 'Invitations'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-primary/5">
                          <TableHead className="w-1/3 text-base font-medium">Email</TableHead>
                          <TableHead className="w-1/3 text-base font-medium">Status</TableHead>
                          <TableHead className="w-1/4 text-base font-medium">Expires At</TableHead>
                          <TableHead className="w-1/12 text-base font-medium">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filteredInvitations.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-16 text-muted-foreground text-lg">
                                  {searchTerm ? 'No matching invitations found' : 'No invitations found'}
                                </TableCell>
                              </TableRow>
                          ) : (
                              filteredInvitations.map((invitation, i) => (
                                  <motion.tr
                                      key={invitation._id}
                                      custom={i}
                                      variants={tableRowVariants}
                                      initial="hidden"
                                      animate="visible"
                                      exit="exit"
                                      whileHover="hover"
                                      className="transition-colors duration-300"
                                      style={{ "--subtle-hover": "var(--hover-bg)" }}
                                  >
                                    <TableCell className="font-medium font-mono text-base py-4">{invitation.email}</TableCell>
                                    <TableCell>
                                      <Badge
                                          variant="outline"
                                          className={
                                            invitation.status === 'pending'
                                                ? 'bg-yellow-50/80 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800 flex items-center gap-1.5 font-medium text-sm py-1 px-2 rounded-xl'
                                                : invitation.status === 'accepted'
                                                    ? 'bg-green-50/80 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800 font-medium text-sm py-1 px-2 rounded-xl'
                                                    : 'bg-red-50/80 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800 font-medium text-sm py-1 px-2 rounded-xl'
                                          }
                                      >
                                        {invitation.status === 'pending' && (
                                            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                        )}
                                        {invitation.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-base">{new Date(invitation.expiresAt).toLocaleDateString()}</span>
                                      </div>
                                      {new Date(invitation.expiresAt) < new Date() && (
                                          <span className="text-sm text-red-500 mt-1 block">Expired</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <motion.div
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                      >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteInvitation(invitation._id);
                                            }}
                                            disabled={actionLoading}
                                            className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                                        >
                                          <Trash2 className="h-5 w-5" />
                                        </Button>
                                      </motion.div>
                                    </TableCell>
                                  </motion.tr>
                              ))
                          )}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Create User Tab */}
          <TabsContent value="create">
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
            >
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl max-w-3xl mx-auto">
                <CardHeader className="bg-card border-b border-primary/5">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-2 rounded-full bg-primary/10">
                      <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    Create New User
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    Send an invitation to onboard a new user
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <form onSubmit={handleSendInvitation} className="space-y-8">
                    <div className="space-y-4">
                      <Label htmlFor="email" className="text-base font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 py-6 text-base rounded-2xl border-primary/20 shadow-sm focus-visible:ring-primary hover:border-primary/40 transition-all duration-300"
                            placeholder="Enter user email address"
                            required
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        An invitation will be sent to this email address with instructions to create an account
                      </p>
                    </div>

                    <motion.div
                        className="pt-2"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                      <Button
                          type="submit"
                          className="w-full sm:w-auto gap-2 py-6 px-8 text-base font-medium rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
                          disabled={actionLoading || !email}
                      >
                        {actionLoading ? (
                            <>
                              <span className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </>
                        ) : (
                            <>
                              <UserPlus className="h-5 w-5" />
                              Send Invitation
                            </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t border-primary/5 flex flex-col items-start px-6 py-6">
                  <h4 className="text-lg font-medium mb-3">What happens next?</h4>
                  <ol className="text-base text-muted-foreground space-y-2.5 list-decimal pl-5">
                    <li>An invitation email will be sent to the address</li>
                    <li>The recipient will have 7 days to accept the invitation</li>
                    <li>Upon acceptance, they'll create a password and complete their profile</li>
                    <li>Once completed, they'll be able to access the platform</li>
                  </ol>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-full flex items-center justify-center bg-primary/10 text-primary dark:bg-primary-foreground/10 dark:text-primary-foreground">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage users, view analytics, and control system settings
              </p>
            </div>
          </div>
        </motion.div>
      </div>
  );
}