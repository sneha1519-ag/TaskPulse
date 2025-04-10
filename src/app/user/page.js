'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Check, 
  X, 
  CheckCircle,
  Calendar 
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

export default function UserDashboard() {
  const router = useRouter();
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
      // Fetch tasks after user is set
      fetchUserTasks();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/user/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

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

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setLoadingTask(taskId);
      
      if (!user || (!user.email && !user._id)) {
        setError('User authentication error');
        return;
      }
      
      const userId = user._id || '';
      const userEmail = user.email || '';
      
      console.log(`Updating task ${taskId} to status ${newStatus}`);
      
      const response = await fetch('/api/user/tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': userEmail,
          'X-User-ID': userId
        },
        body: JSON.stringify({
          taskId,
          status: newStatus
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task status');
      }
      
      console.log(`Task ${taskId} updated successfully`);
      
      // Refresh tasks after update
      fetchUserTasks();
    } catch (error) {
      setError(error.message);
      console.error('Error updating task status:', error);
    } finally {
      setLoadingTask(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 mr-1 text-yellow-600" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />;
      default:
        return null;
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'text-red-700 bg-red-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'in_progress':
        return 'text-blue-700 bg-blue-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'cancelled':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome, {user?.firstName || user?.email}!
              </CardTitle>
              <CardDescription>
                View and manage your assigned tasks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <div className="text-xl font-bold text-gray-800 dark:text-white">{taskCounts.total}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="text-xl font-bold text-yellow-600">{taskCounts.pending}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Pending</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{taskCounts.in_progress}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{taskCounts.completed}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            {/* All Tasks Tab */}
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>View all assigned tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.length === 0 ? (
                      <p className="text-center py-4 text-gray-500 dark:text-gray-400">No tasks assigned yet</p>
                    ) : (
                      tasks.map((task) => (
                        <TaskCard 
                          key={task._id} 
                          task={task} 
                          onUpdateStatus={updateTaskStatus}
                          isLoading={loadingTask === task._id}
                          formatDate={formatDate}
                          getPriorityIcon={getPriorityIcon}
                          getPriorityColor={getPriorityColor}
                          getStatusColor={getStatusColor}
                        />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Pending Tasks Tab */}
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Tasks awaiting action</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasksByStatus.pending && tasksByStatus.pending.length === 0 ? (
                      <p className="text-center py-4 text-gray-500 dark:text-gray-400">No pending tasks</p>
                    ) : (
                      tasksByStatus.pending && tasksByStatus.pending.map((task) => (
                        <TaskCard 
                          key={task._id} 
                          task={task} 
                          onUpdateStatus={updateTaskStatus}
                          isLoading={loadingTask === task._id}
                          formatDate={formatDate}
                          getPriorityIcon={getPriorityIcon}
                          getPriorityColor={getPriorityColor}
                          getStatusColor={getStatusColor}
                        />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* In Progress Tasks Tab */}
            <TabsContent value="in-progress">
              <Card>
                <CardHeader>
                  <CardTitle>In Progress Tasks</CardTitle>
                  <CardDescription>Tasks you're currently working on</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasksByStatus.in_progress && tasksByStatus.in_progress.length === 0 ? (
                      <p className="text-center py-4 text-gray-500 dark:text-gray-400">No tasks in progress</p>
                    ) : (
                      tasksByStatus.in_progress && tasksByStatus.in_progress.map((task) => (
                        <TaskCard 
                          key={task._id} 
                          task={task} 
                          onUpdateStatus={updateTaskStatus}
                          isLoading={loadingTask === task._id}
                          formatDate={formatDate}
                          getPriorityIcon={getPriorityIcon}
                          getPriorityColor={getPriorityColor}
                          getStatusColor={getStatusColor}
                        />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Completed Tasks Tab */}
            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Tasks</CardTitle>
                  <CardDescription>Tasks you've finished</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasksByStatus.completed && tasksByStatus.completed.length === 0 ? (
                      <p className="text-center py-4 text-gray-500 dark:text-gray-400">No completed tasks</p>
                    ) : (
                      tasksByStatus.completed && tasksByStatus.completed.map((task) => (
                        <TaskCard 
                          key={task._id} 
                          task={task} 
                          onUpdateStatus={updateTaskStatus}
                          isLoading={loadingTask === task._id}
                          formatDate={formatDate}
                          getPriorityIcon={getPriorityIcon}
                          getPriorityColor={getPriorityColor}
                          getStatusColor={getStatusColor}
                        />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
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
  const canUpdateStatus = task.status !== 'completed' && task.status !== 'cancelled';
  
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-zinc-800 shadow-sm">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between">
          <h3 className="font-medium text-lg">{task.title}</h3>
          <Badge className={getPriorityColor(task.priority)}>
            {getPriorityIcon(task.priority)}
            {task.priority}
          </Badge>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm">{task.description}</p>
        
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 opacity-70" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center">
            <span>Assigned by: {task.assignedBy?.firstName} {task.assignedBy?.lastName}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t">
          <Badge className={getStatusColor(task.status)}>
            {task.status}
          </Badge>
          
          {canUpdateStatus && (
            <div className="flex items-center space-x-2">
              {task.status === 'pending' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onUpdateStatus(task._id, 'in_progress')}
                  disabled={isLoading}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Start Working
                </Button>
              )}
              
              {task.status === 'in_progress' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-green-600" 
                  onClick={() => onUpdateStatus(task._id, 'completed')}
                  disabled={isLoading}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-red-600" 
                onClick={() => onUpdateStatus(task._id, 'cancelled')}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          )}
          
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          )}
        </div>
      </div>
    </div>
  );
} 