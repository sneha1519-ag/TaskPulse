'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

import {
  Check,
  Clock,
  CalendarIcon,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Plus,
  User,
  Mail,
  Phone,
  ArrowLeft,
  BarChart3,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import MiniAdminCalendar from "@/components/adminComponents/mini-admin-calendar";
import { motion, AnimatePresence } from "framer-motion";
import UserAnalytics from "@/app/admin/user/[userId]/analytics";

export default function UserDetail() {
  const pathname = usePathname();
  const router = useRouter();
  const userId = pathname.split('/')[3];
  const { data: session, status } = useSession();

  // State management
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [tasksByPriority, setTasksByPriority] = useState({});
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [taskFormLoading, setTaskFormLoading] = useState(false);
  const [eventFormLoading, setEventFormLoading] = useState(false);
  const [taskFormError, setTaskFormError] = useState(null);
  const [eventFormError, setEventFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Form data
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDateTime: '',
    endDateTime: ''
  });

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
    hidden: { y: 15, opacity: 0 },
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

  const cardHoverVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
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
  }, [status, session]);

  // Fetch user details, tasks and events
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchUserDetails();
    }
  }, [userId, status, session]);

  // Success message auto-dismiss
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();

      setUser(data.user);
      setTasks(data.tasks);
      setTasksByPriority(data.tasksByPriority);
      setTaskCounts(data.taskCounts);

      // Format events for the calendar component
      const formattedEvents = data.events.map(event => {
        let startTime = event.startTime;
        let endTime = event.endTime;

        if (startTime && typeof startTime === 'string') {
          try {
            startTime = new Date(startTime).toISOString();
          } catch (e) {
            console.error('Error formatting startTime:', e);
          }
        }

        if (endTime && typeof endTime === 'string') {
          try {
            endTime = new Date(endTime).toISOString();
          } catch (e) {
            console.error('Error formatting endTime:', e);
          }
        }

        return {
          ...event,
          title: event.title || event.summary || 'Untitled Event',
          startTime: startTime,
          endTime: endTime
        };
      });

      setEvents(formattedEvents);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      setTaskFormLoading(true);
      setTaskFormError(null);

      const taskWithStatus = {
        ...taskFormData,
        status: 'pending'
      };

      const response = await fetch(`/api/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskWithStatus)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add task');
      }

      setTaskFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      setIsAddTaskOpen(false);
      setSuccessMessage('Task added successfully');

      fetchUserDetails();
    } catch (err) {
      setTaskFormError(err.message);
      console.error(err);
    } finally {
      setTaskFormLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      setEventFormLoading(true);
      setEventFormError(null);

      if (!eventFormData.startDateTime || !eventFormData.endDateTime) {
        throw new Error('Start and end date/time are required');
      }

      const startDateTime = new Date(eventFormData.startDateTime).toISOString();
      const endDateTime = new Date(eventFormData.endDateTime).toISOString();

      const response = await fetch(`/api/users/${userId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: eventFormData.title,
          description: eventFormData.description,
          location: eventFormData.location,
          startDateTime: startDateTime,
          endDateTime: endDateTime
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add event');
      }

      setEventFormData({
        title: '',
        description: '',
        location: '',
        startDateTime: '',
        endDateTime: ''
      });
      setIsAddEventOpen(false);
      setSuccessMessage('Event added successfully');

      fetchUserDetails();
    } catch (err) {
      setEventFormError(err.message);
      console.error(err);
    } finally {
      setEventFormLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "No date";

    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 mr-1 text-red-600 dark:text-red-400" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 mr-1 text-yellow-600 dark:text-yellow-400" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'low':
        return 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      default:
        return 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-800/50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'in_progress':
        return 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'cancelled':
        return 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default:
        return 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-800/50';
    }
  };

  const renderSkeletonLoader = () => (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>

        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
  );

  // When the button is clicked, toggle the analytics view
  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  if (loading && !user) {
    return (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          {renderSkeletonLoader()}
        </div>
    );
  }

  if (error) {
    return (
        <div className="container mx-auto px-4 py-12">
          <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl relative mb-6 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
              role="alert"
          >
            <span className="block text-lg font-medium mb-1">Error</span>
            <span className="block">{error}</span>
          </motion.div>
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
          >
            <Button
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2 bg-gradient-to-r from-[#2D336B] to-[#2D336B]/80 hover:to-[#2D336B] dark:from-[#A9B5DF] dark:to-[#A9B5DF]/80 dark:hover:to-[#A9B5DF]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Dashboard
            </Button>
          </motion.div>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2D336B] to-[#4B57A8] bg-clip-text text-transparent dark:from-[#A9B5DF] dark:to-white">
            User Profile
          </h1>

          <div className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                  onClick={toggleAnalytics}
                  className={`flex items-center gap-2 rounded-2xl ${
                      showAnalytics
                          ? "bg-[#2D336B] text-white dark:bg-[#A9B5DF] dark:text-gray-900"
                          : "border-[#2D336B] text-[#2D336B] dark:border-[#A9B5DF] dark:text-[#A9B5DF]"
                  }`}
                  variant={showAnalytics ? "default" : "outline"}
              >
                <BarChart3 className="h-4 w-4" />
                {showAnalytics ? "Hide Analytics" : "Show Analytics"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                  onClick={() => router.push('/admin')}
                  className="flex items-center gap-2 rounded-2xl border-[#2D336B] text-[#2D336B] dark:border-[#A9B5DF] dark:text-[#A9B5DF]"
                  variant="outline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Success message */}
        <AnimatePresence>
          {successMessage && (
              <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-2xl relative mb-6 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
                  role="alert"
              >
                <span className="block text-lg font-medium mb-1">Success</span>
                <span className="block">{successMessage}</span>
                <button
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={() => setSuccessMessage(null)}
                >
                  <span className="sr-only">Close</span>
                  <span className="text-xl">&times;</span>
                </button>
              </motion.div>
          )}
        </AnimatePresence>

        {/* User Profile Card */}
        {user && (
            <motion.div
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={cardHoverVariants}
                className="bg-white dark:bg-black rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 mb-8 overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-[#2D336B] to-[#4B57A8] dark:from-[#A9B5DF] dark:to-[#4B57A8]/70"></div>
                <div className="absolute -bottom-12 left-8">
                  <Avatar className="h-24 w-24 border-4 border-white dark:border-black shadow-lg bg-gradient-to-br from-[#2D336B] to-[#4B57A8] dark:from-[#A9B5DF] dark:to-[#A9B5DF]/70">
                    <AvatarFallback className="text-3xl font-bold text-white dark:text-gray-900">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <div className="px-8 pt-16 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      <p>{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={`px-3 py-1 text-sm rounded-full 
                  ${user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                        : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                    }`}
                    >
                      {user.role}
                    </Badge>

                    <Badge
                        className={`px-3 py-1 text-sm rounded-full
                  ${user.isActive
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                            : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                        }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
        )}

        {/* Analytics Dashboard */}
        <AnimatePresence>
          {showAnalytics && (
              <motion.div
                  initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.3 }}
              >
                <UserAnalytics userId={userId} userData={user} />
              </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area with Tabs */}
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <Tabs
              defaultValue="overview"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
          >
            <TabsList className="mb-6 bg-gray-100/80 dark:bg-gray-900/30 p-1 rounded-2xl">
              <TabsTrigger
                  value="overview"
                  className="rounded-xl px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-[#2D336B] dark:data-[state=active]:text-[#A9B5DF] data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                  value="tasks"
                  className="rounded-xl px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-[#2D336B] dark:data-[state=active]:text-[#A9B5DF] data-[state=active]:shadow-sm"
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger
                  value="calendar"
                  className="rounded-xl px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:text-[#2D336B] dark:data-[state=active]:text-[#A9B5DF] data-[state=active]:shadow-sm"
              >
                Calendar
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Task Stats Card */}
                <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2">
                  <Card className="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold text-[#2D336B] dark:text-[#A9B5DF]">
                          Task Overview
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                          Summary of user tasks and their status
                        </CardDescription>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={() => setIsAddTaskOpen(true)}
                            size="sm"
                            className="flex items-center rounded-xl bg-[#2D336B] hover:bg-[#2D336B]/90 dark:bg-[#A9B5DF] dark:text-gray-900 dark:hover:bg-[#A9B5DF]/90"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Task
                        </Button>
                      </motion.div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <motion.div
                            whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                            className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-2xl transition-all"
                        >
                          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{taskCounts.total || 0}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                            className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl transition-all"
                        >
                          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{taskCounts.pending || 0}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                            className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl transition-all"
                        >
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{taskCounts.in_progress || 0}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                            className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl transition-all"
                        >
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{taskCounts.completed || 0}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                        </motion.div>
                      </div>

                      <Separator className="my-4" />

                      <h3 className="text-md font-medium mb-3 text-[#2D336B] dark:text-[#A9B5DF]">
                        Tasks by Priority
                      </h3>
                      <div className="space-y-3">
                        <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-xl"
                        >
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                            <span className="dark:text-gray-200">High/Urgent</span>
                          </div>
                          <span className="font-semibold text-red-700 dark:text-red-400">
                          {(tasksByPriority.high?.length || 0) + (tasksByPriority.urgent?.length || 0)}
                        </span>
                        </motion.div>
                        <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl"
                        >
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                            <span className="dark:text-gray-200">Medium</span>
                          </div>
                          <span className="font-semibold text-yellow-700 dark:text-yellow-400">
          {tasksByPriority.medium?.length || 0}
        </span>
                        </motion.div>
                        <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-xl"
                        >
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                            <span className="dark:text-gray-200">Low</span>
                          </div>
                          <span className="font-semibold text-green-700 dark:text-green-400">
          {tasksByPriority.low?.length || 0}
        </span>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Upcoming Events Card */}
                <motion.div variants={itemVariants}>
                  <Card className="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold text-[#2D336B] dark:text-[#A9B5DF]">
                          Upcoming Events
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400">
                          Next scheduled events
                        </CardDescription>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={() => setIsAddEventOpen(true)}
                            size="sm"
                            className="flex items-center rounded-xl bg-[#2D336B] hover:bg-[#2D336B]/90 dark:bg-[#A9B5DF] dark:text-gray-900 dark:hover:bg-[#A9B5DF]/90"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Event
                        </Button>
                      </motion.div>
                    </CardHeader>
                    <CardContent>
                      {events && events.length > 0 ? (
                          <div className="space-y-4">
                            {events.slice(0, 3).map((event, index) => (
                                <motion.div
                                    key={`event-${event.id || event._id || index}`}
                                    whileHover={{ x: 5 }}
                                    className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                {event.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(event.date).toLocaleDateString()}
                                            </p>
                                  </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {event.status}
                                        </span>
                                      </div>
                                </motion.div>
                            ))}
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <CalendarIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">No upcoming events</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                              Add an event to get started
                            </p>
                          </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      {events.length > 3 && (
                          <Button
                              variant="ghost"
                              className="w-full text-[#2D336B] dark:text-[#A9B5DF]"
                              onClick={() => setActiveTab("calendar")}
                          >
                            View all events
                          </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>

                {/* Recent Tasks Card */}
                <motion.div variants={itemVariants} className="col-span-1 lg:col-span-3">
                  <Card className="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-semibold text-[#2D336B] dark:text-[#A9B5DF]">
                        Recent Tasks
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        Latest tasks assigned to this user
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {tasks && tasks.length > 0 ? (
                          <div className="space-y-4">
                            {tasks.slice(0, 5).map((task, index) => (
                                <motion.div
                                    key={`task-${task.id || task._id || index}`}
                                    whileHover={{ x: 5 }}
                                    className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium">{task.title}</div>
                                      {task.description && (
                                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {task.description}
                                          </div>
                                      )}
                                    </div>
                                    <div className="flex space-x-2">
                                      <Badge className={getPriorityColor(task.priority)}>
                                        <div className="flex items-center">
                                          {getPriorityIcon(task.priority)}
                                          {task.priority}
                                        </div>
                                      </Badge>
                                      <Badge className={getStatusColor(task.status)}>
                                        {task.status === 'in_progress' ? 'In Progress' :
                                            task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                                      </Badge>
                                    </div>
                                  </div>
                                  {task.dueDate && (
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        Due: {formatDate(task.dueDate)}
                                      </div>
                                  )}
                                </motion.div>
                            ))}
                          </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Check className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                              Add a task to get started
                            </p>
                          </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      {tasks.length > 5 && (
                          <Button
                              variant="ghost"
                              className="w-full text-[#2D336B] dark:text-[#A9B5DF]"
                              onClick={() => setActiveTab("tasks")}
                          >
                            View all tasks
                          </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="mt-0">
              <Card className="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-[#2D336B] dark:text-[#A9B5DF]">
                      All Tasks
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Manage all tasks for this user
                    </CardDescription>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={() => setIsAddTaskOpen(true)}
                        className="flex items-center rounded-xl bg-[#2D336B] hover:bg-[#2D336B]/90 dark:bg-[#A9B5DF] dark:text-gray-900 dark:hover:bg-[#A9B5DF]/90"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Task
                    </Button>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  {tasks && tasks.length > 0 ? (
                      <div className="space-y-4">
                        {tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                whileHover={{ x: 5 }}
                                className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl"
                            >
                              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                                <div className="flex-1">
                                  <div className="font-medium">{task.title}</div>
                                  {task.description && (
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {task.description}
                                      </div>
                                  )}
                                  {task.dueDate && (
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        Due: {formatDate(task.dueDate)}
                                      </div>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className={getPriorityColor(task.priority)}>
                                    <div className="flex items-center">
                                      {getPriorityIcon(task.priority)}
                                      {task.priority}
                                    </div>
                                  </Badge>
                                  <Badge className={getStatusColor(task.status)}>
                                    {task.status === 'in_progress' ? 'In Progress' :
                                        task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                            </motion.div>
                        ))}
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Check className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No tasks found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Add a task using the button above
                        </p>
                      </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="mt-0">
              <Card className="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-[#2D336B] dark:text-[#A9B5DF]">
                      Events Calendar
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      View and manage scheduled events
                    </CardDescription>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={() => setIsAddEventOpen(true)}
                        className="flex items-center rounded-xl bg-[#2D336B] hover:bg-[#2D336B]/90 dark:bg-[#A9B5DF] dark:text-gray-900 dark:hover:bg-[#A9B5DF]/90"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Event
                    </Button>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                    <MiniAdminCalendar events={events} />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-[#2D336B] dark:text-[#A9B5DF]">
                      Upcoming Events
                    </h3>

                    {events && events.length > 0 ? (
                        <div className="space-y-4">
                          {events.map((event) => (
                              <motion.div
                                  key={`event-${event.id}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ type: "spring", stiffness: 100 }}
                                  whileHover={{ x: 5 }}
                                  className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl"
                              >
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                                  <div className="flex-1">
                                    <div className="font-medium">{event.title}</div>
                                    {event.description && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                          {event.description}
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2 text-sm">
                                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                        {formatDateTime(event.startTime)}
                                      </div>
                                      {event.location && (
                                          <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                                            📍 {event.location}
                                          </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                          ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <CalendarIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No events found</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            Add an event using the button above
                          </p>
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Add Task Dialog */}
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#2D336B] dark:text-[#A9B5DF]">
                Add New Task
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddTask} className="space-y-4 mt-2">
              {taskFormError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                    <p className="text-sm">{taskFormError}</p>
                  </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="title"
                    placeholder="Enter task title"
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                    className="border-gray-200 dark:border-gray-800 rounded-xl"
                    required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <Textarea
                    id="description"
                    placeholder="Enter task description"
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                    className="border-gray-200 dark:border-gray-800 rounded-xl min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">
                    Priority <span className="text-red-500">*</span>
                  </Label>
                  <Select
                      value={taskFormData.priority}
                      onValueChange={(value) => setTaskFormData({...taskFormData, priority: value})}
                  >
                    <SelectTrigger className="border-gray-200 dark:border-gray-800 rounded-xl">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-gray-700 dark:text-gray-300">
                    Due Date
                  </Label>
                  <Input
                      id="dueDate"
                      type="date"
                      value={taskFormData.dueDate}
                      onChange={(e) => setTaskFormData({...taskFormData, dueDate: e.target.value})}
                      className="border-gray-200 dark:border-gray-800 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddTaskOpen(false)}
                    className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={taskFormLoading}
                    className="rounded-xl bg-[#2D336B] hover:bg-[#2D336B]/90 dark:bg-[#A9B5DF] dark:text-gray-900 dark:hover:bg-[#A9B5DF]/90"
                >
                  {taskFormLoading ? 'Adding...' : 'Add Task'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Event Dialog */}
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#2D336B] dark:text-[#A9B5DF]">
                Add New Event
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddEvent} className="space-y-4 mt-2">
              {eventFormError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                    <p className="text-sm">{eventFormError}</p>
                  </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="eventTitle" className="text-gray-700 dark:text-gray-300">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="eventTitle"
                    placeholder="Enter event title"
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                    className="border-gray-200 dark:border-gray-800 rounded-xl"
                    required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDescription" className="text-gray-700 dark:text-gray-300">
                  Description
                </Label>
                <Textarea
                    id="eventDescription"
                    placeholder="Enter event description"
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                    className="border-gray-200 dark:border-gray-800 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                  Location
                </Label>
                <Input
                    id="location"
                    placeholder="Enter event location"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({...eventFormData, location: e.target.value})}
                    className="border-gray-200 dark:border-gray-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDateTime" className="text-gray-700 dark:text-gray-300">
                    Start Date & Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                      id="startDateTime"
                      type="datetime-local"
                      value={eventFormData.startDateTime}
                      onChange={(e) => setEventFormData({...eventFormData, startDateTime: e.target.value})}
                      className="border-gray-200 dark:border-gray-800 rounded-xl"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDateTime" className="text-gray-700 dark:text-gray-300">
                    End Date & Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                      id="endDateTime"
                      type="datetime-local"
                      value={eventFormData.endDateTime}
                      onChange={(e) => setEventFormData({...eventFormData, endDateTime: e.target.value})}
                      className="border-gray-200 dark:border-gray-800 rounded-xl"
                      required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddEventOpen(false)}
                    className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={eventFormLoading}
                    className="rounded-xl bg-[#2D336B] hover:bg-[#2D336B]/90 dark:bg-[#A9B5DF] dark:text-gray-900 dark:hover:bg-[#A9B5DF]/90"
                >
                  {eventFormLoading ? 'Adding...' : 'Add Event'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  );
}