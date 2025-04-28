'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Check,
  X,
  CheckCircle,
  Calendar,
  Star,
  BarChart,
  ListChecks,
  Hourglass
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import UserNavbar from '@/components/userComponents/UserNavbar';
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/useToast";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardHover = {
  rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

export default function UserDashboard() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [tasksByStatus, setTasksByStatus] = useState({
    pending: [],
    in_progress: [],
    completed: [],
    cancelled: []
  });
  const [tasksByPriority, setTasksByPriority] = useState({
    low: [],
    medium: [],
    high: [],
    urgent: []
  });
  const [taskCounts, setTaskCounts] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  });
  const [error, setError] = useState(null);
  const [loadingTask, setLoadingTask] = useState(null);

  useEffect(() => {
    // Check if user is logged in by retrieving from sessionStorage
    const userData = sessionStorage.getItem('user');

    if (!userData) {
      router.push('/user/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/user/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Separate effect to fetch tasks only when user data is available
  useEffect(() => {
    if (user && (user.email || user._id)) {
      fetchUserTasks();
    }
  }, [user]);

  const fetchUserTasks = async () => {
    try {
      setLoading(true);

      if (!user || (!user.email && !user._id)) {
        console.error('No user data available for task fetch');
        setError('User authentication error');
        return;
      }

      // Include the user email or ID in the request URL
      const userId = user._id || '';
      const userEmail = user.email || '';

      console.log('Fetching tasks for user:', userEmail, userId);

      // Create URL with query parameters
      const url = `/api/user/tasks?email=${encodeURIComponent(userEmail)}&userId=${encodeURIComponent(userId)}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          // Include user ID in custom header as well (belt and suspenders)
          'X-User-Email': userEmail,
          'X-User-ID': userId
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tasks');
      }

      const data = await response.json();
      console.log('Received task data:', data);

      setTasks(data.tasks || []);
      setTasksByStatus(data.tasksByStatus || {
        pending: [],
        in_progress: [],
        completed: [],
        cancelled: []
      });
      setTasksByPriority(data.tasksByPriority || {
        low: [],
        medium: [],
        high: [],
        urgent: []
      });
      setTaskCounts(data.taskCounts || {
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0
      });
    } catch (error) {
      setError(error.message);
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus, priority) => {
    try {
      setLoadingTask(taskId);
      setError(null);

      console.log('Updating task status:', taskId, newStatus, priority);

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task status');
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);

      // Update local user state with new points
      if (responseData.userPoints !== undefined) {
        console.log('Current user points:', user.points);
        console.log('New points from API:', responseData.userPoints);

        setUser(prev => ({
          ...prev,
          points: responseData.userPoints
        }));

        // Save updated user data to session storage
        const updatedUser = {
          ...user,
          points: responseData.userPoints
        };
        console.log('Saving to session storage:', updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));

        // Show toast notification if task was completed
        if (newStatus === 'completed') {
          let pointsEarned = 0;
          switch(priority) {
            case 'low':
              pointsEarned = 5;
              break;
            case 'medium':
              pointsEarned = 7;
              break;
            case 'high':
            case 'urgent':
              pointsEarned = 10;
              break;
            default:
              pointsEarned = 5;
          }

          console.log('Points earned:', pointsEarned);
          showSuccess(
            "Points earned!",
            `You earned ${pointsEarned} points for completing a ${priority} priority task.`
          );
        }
      }

      // Refresh tasks after update
      await fetchUserTasks();
    } catch (error) {
      setError(error.message);
      console.error('Error updating task status:', error);
      showError("Error", error.message);
    } finally {
      setLoadingTask(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'low':
        return <AlertTriangle className="h-3 w-3" />;
      case 'medium':
        return <AlertCircle className="h-3 w-3" />;
      case 'high':
        return <AlertTriangle className="h-3 w-3 fill-current" />;
      case 'urgent':
        return <AlertTriangle className="h-3 w-3 fill-current" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'low':
        return 'text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-950/30';
      case 'medium':
        return 'text-yellow-500 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30';
      case 'high':
        return 'text-orange-500 border-orange-500 bg-orange-50 dark:bg-orange-950/30';
      case 'urgent':
        return 'text-red-500 border-red-500 bg-red-50 dark:bg-red-950/30';
      default:
        return 'text-gray-500 border-gray-500 bg-gray-50 dark:bg-gray-950/30';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'text-yellow-500 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30';
      case 'in_progress':
        return 'text-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-950/30';
      case 'completed':
        return 'text-green-500 border-green-500 bg-green-50 dark:bg-green-950/30';
      case 'cancelled':
        return 'text-gray-500 border-gray-500 bg-gray-50 dark:bg-gray-950/30';
      default:
        return 'text-gray-500 border-gray-500 bg-gray-50 dark:bg-gray-950/30';
    }
  };

  const renderSkeletonCards = () => {
    return Array(6).fill(0).map((_, i) => (
        <motion.div
            key={i}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={i}
        >
          <Card className="h-full overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-4" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        </motion.div>
    ));
  };

  if (loading) {
    return (
        <>
          <Toaster />
          <div className="flex h-screen items-center justify-center">
            <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
              <motion.div
                  className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-lg">Loading your dashboard...</p>
            </motion.div>
          </div>
        </>
    );
  }

  if (error) {
    return (
        <>
          <Toaster />
          <UserNavbar user={user} />
          <motion.div
              className="container mx-auto p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <div className="bg-destructive/10 text-destructive p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-semibold mb-2">Error</h2>
              <p className="mb-4">{error}</p>
              <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonHover}
              >
                <Button
                    variant="outline"
                    className="border-destructive/30 hover:bg-destructive/5"
                    onClick={fetchUserTasks}
                >
                  <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                  >
                    Try Again
                    <span className="i-lucide-refresh-cw" />
                  </motion.span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
    );
  }

  return (
      <>
        <Toaster />
        <UserNavbar user={user} />
        <motion.div
            className="container mx-auto px-4 py-8 md:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
          <motion.div
              className="mb-10"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
          >
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent dark:from-[#A9B5DF] dark:to-[#A9B5DF]/70">
              Welcome, {user?.firstName || 'User'}
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's your task overview and progress
            </p>
          </motion.div>

          <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
          >
            <motion.div variants={fadeInUp}>
              <StatusCard
                  title="Total Tasks"
                  count={taskCounts.total}
                  icon={<ListChecks className="h-5 w-5" />}
                  color="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-[#A9B5DF]/10 dark:to-[#A9B5DF]/5"
                  iconColor="text-primary dark:text-[#A9B5DF]"
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <StatusCard
                  title="Pending"
                  count={taskCounts.pending}
                  icon={<Clock className="h-5 w-5" />}
                  color="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 dark:from-yellow-400/10 dark:to-yellow-400/5"
                  iconColor="text-yellow-500 dark:text-yellow-400"
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <StatusCard
                  title="In Progress"
                  count={taskCounts.in_progress}
                  icon={<Hourglass className="h-5 w-5" />}
                  color="bg-gradient-to-br from-blue-500/10 to-blue-500/5 dark:from-blue-400/10 dark:to-blue-400/5"
                  iconColor="text-blue-500 dark:text-blue-400"
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <StatusCard
                  title="Completed"
                  count={taskCounts.completed}
                  icon={<CheckCircle className="h-5 w-5" />}
                  color="bg-gradient-to-br from-green-500/10 to-green-500/5 dark:from-green-400/10 dark:to-green-400/5"
                  iconColor="text-green-500 dark:text-green-400"
              />
            </motion.div>
          </motion.div>

          <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-10"
          >
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 p-1 bg-muted/40 w-full md:w-auto rounded-2xl">
                <TabsTrigger
                    value="all"
                    className="rounded-xl text-sm md:text-base px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-sm transition-all duration-200"
                >
                  All Tasks
                </TabsTrigger>
                <TabsTrigger
                    value="pending"
                    className="rounded-xl text-sm md:text-base px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                    value="in-progress"
                    className="rounded-xl text-sm md:text-base px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-sm transition-all duration-200"
                >
                  In Progress
                </TabsTrigger>
                <TabsTrigger
                    value="completed"
                    className="rounded-xl text-sm md:text-base px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" key="all" className="mt-0">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                  {loading ? (
                      renderSkeletonCards()
                  ) : tasks.length === 0 ? (
                      <motion.div
                          className="col-span-full text-center p-10 bg-muted/30 rounded-2xl"
                          variants={fadeInUp}
                      >
                        <p className="text-muted-foreground text-lg">You don't have any tasks assigned yet.</p>
                      </motion.div>
                  ) : (
                      tasks.map((task, index) => (
                          <motion.div
                              key={task._id}
                              variants={fadeInUp}
                              custom={index}
                          >
                            <TaskCard
                                task={task}
                                onUpdateStatus={updateTaskStatus}
                                isLoading={loadingTask === task._id}
                                formatDate={formatDate}
                                getPriorityIcon={getPriorityIcon}
                                getPriorityColor={getPriorityColor}
                                getStatusColor={getStatusColor}
                            />
                          </motion.div>
                      ))
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="pending" key="pending" className="mt-0">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                  {loading ? (
                      renderSkeletonCards()
                  ) : tasksByStatus.pending.length === 0 ? (
                      <motion.div
                          className="col-span-full text-center p-10 bg-muted/30 rounded-2xl"
                          variants={fadeInUp}
                      >
                        <p className="text-muted-foreground text-lg">You don't have any pending tasks.</p>
                      </motion.div>
                  ) : (
                      tasksByStatus.pending.map((task, index) => (
                          <motion.div
                              key={task._id}
                              variants={fadeInUp}
                              custom={index}
                          >
                            <TaskCard
                                task={task}
                                onUpdateStatus={updateTaskStatus}
                                isLoading={loadingTask === task._id}
                                formatDate={formatDate}
                                getPriorityIcon={getPriorityIcon}
                                getPriorityColor={getPriorityColor}
                                getStatusColor={getStatusColor}
                            />
                          </motion.div>
                      ))
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="in-progress" key="in-progress" className="mt-0">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                  {loading ? (
                      renderSkeletonCards()
                  ) : tasksByStatus.in_progress.length === 0 ? (
                      <motion.div
                          className="col-span-full text-center p-10 bg-muted/30 rounded-2xl"
                          variants={fadeInUp}
                      >
                        <p className="text-muted-foreground text-lg">You don't have any tasks in progress.</p>
                      </motion.div>
                  ) : (
                      tasksByStatus.in_progress.map((task, index) => (
                          <motion.div
                              key={task._id}
                              variants={fadeInUp}
                              custom={index}
                          >
                            <TaskCard
                                task={task}
                                onUpdateStatus={updateTaskStatus}
                                isLoading={loadingTask === task._id}
                                formatDate={formatDate}
                                getPriorityIcon={getPriorityIcon}
                                getPriorityColor={getPriorityColor}
                                getStatusColor={getStatusColor}
                            />
                          </motion.div>
                      ))
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="completed" key="completed" className="mt-0">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                  {loading ? (
                      renderSkeletonCards()
                  ) : tasksByStatus.completed.length === 0 ? (
                      <motion.div
                          className="col-span-full text-center p-10 bg-muted/30 rounded-2xl"
                          variants={fadeInUp}
                      >
                        <p className="text-muted-foreground text-lg">You haven't completed any tasks yet.</p>
                      </motion.div>
                  ) : (
                      tasksByStatus.completed.map((task, index) => (
                          <motion.div
                              key={task._id}
                              variants={fadeInUp}
                              custom={index}
                          >
                            <TaskCard
                                task={task}
                                onUpdateStatus={updateTaskStatus}
                                isLoading={loadingTask === task._id}
                                formatDate={formatDate}
                                getPriorityIcon={getPriorityIcon}
                                getPriorityColor={getPriorityColor}
                                getStatusColor={getStatusColor}
                            />
                          </motion.div>
                      ))
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </>
  );
}

// Status Card Component
function StatusCard({ title, count, icon, color, iconColor }) {
  return (
      <motion.div
          whileHover="hover"
          variants={cardHover}
          initial="rest"
          className="h-full"
      >
        <Card className={`h-full overflow-hidden ${color} backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-sm`}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            <div className={`p-2 rounded-full ${iconColor} bg-white/80 dark:bg-black/80`}>
              {icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{count}</div>
          </CardContent>
        </Card>
      </motion.div>
  );
}

// Task Card Component
function TaskCard({
                    task,
                    onUpdateStatus,
                    isLoading,
                    formatDate,
                    getPriorityIcon,
                    getPriorityColor,
                    getStatusColor
                  }) {

  const handleUpdateStatus = (newStatus) => {
    console.log(`Updating task ${task._id} to ${newStatus}, priority: ${task.priority}`);
    onUpdateStatus(task._id, newStatus, task.priority);
  };

  const renderStatus = (status) => {
    const statusColor = getStatusColor(status);
    let icon;

    switch(status) {
      case 'pending':
        icon = <Clock className="h-3 w-3" />;
        break;
      case 'in_progress':
        icon = <AlertCircle className="h-3 w-3" />;
        break;
      case 'completed':
        icon = <CheckCircle className="h-3 w-3" />;
        break;
      case 'cancelled':
        icon = <X className="h-3 w-3" />;
        break;
      default:
        icon = <Clock className="h-3 w-3" />;
    }

    return (
        <Badge variant="outline" className={`${statusColor} flex gap-1 items-center rounded-full px-3`}>
          {icon}
          <span className="capitalize">{status.replace('_', ' ')}</span>
        </Badge>
    );
  };

  const renderPoints = () => {
    return (
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-yellow-700 dark:text-yellow-400">{task.points} points</span>
          </div>
        </div>
    );
  };

  const renderStatusActionButtons = () => {
    if (isLoading) {
      return (
          <div className="w-full flex justify-center py-2">
            <motion.div
                className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
      );
    }

    switch(task.status) {
      case 'pending':
        return (
            <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonHover}
                className="flex gap-2"
            >
              <Button
                size="sm"
                onClick={() => handleUpdateStatus('in_progress')}
                className="w-40 rounded-xl bg-[#2D336B] hover:bg-[#1E293B] text-white dark:bg-[#A9B5DF] dark:text-black dark:hover:bg-[#72A0C1] shadow-sm hover:shadow transition-all duration-200"
              >
                <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                >
                  Accept Task
                </motion.span>
              </Button>
            </motion.div>
        );
      case 'in_progress':
        return (
            <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonHover}
            >
              <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl text-green-600 border-green-500/20 hover:border-green-500/30 hover:bg-green-50 dark:text-green-400 dark:border-green-400/20 dark:hover:border-green-400/30 dark:hover:bg-green-950/30 shadow-sm hover:shadow transition-all duration-200"
                  onClick={() => handleUpdateStatus('completed')}
              >
                <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Complete Task
                </motion.span>
              </Button>
            </motion.div>
        );
      case 'completed':
        return null;
      default:
        return null;
    }
  };

  return (
      <motion.div
          whileHover="hover"
          variants={cardHover}
          initial="rest"
          className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3 flex flex-row justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-lg font-medium leading-tight">{task.title}</CardTitle>
              <div className="flex flex-wrap gap-2 pt-2">
                {renderStatus(task.status)}
                <Badge
                    variant="outline"
                    className={`${getPriorityColor(task.priority)} flex gap-1 items-center rounded-full px-3`}
                >
                  {getPriorityIcon(task.priority)}
                  <span className="capitalize">{task.priority}</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3 flex-grow">
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {task.description || 'No description provided'}
            </p>

            {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 bg-muted/40 dark:bg-muted/20 rounded-full px-3 py-1 w-fit">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>
            )}

            {task.status !== 'completed' && (
                <div className="bg-yellow-50/50 dark:bg-yellow-950/10 rounded-full px-3 py-1 w-fit">
                  {renderPoints()}
                </div>
            )}

            {task.assignedBy && (
                <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/30 text-xs text-muted-foreground">
                  <p>Assigned by: {task.assignedBy.firstName} {task.assignedBy.lastName}</p>
                </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            {renderStatusActionButtons()}
          </CardFooter>
        </Card>
      </motion.div>
  );
}