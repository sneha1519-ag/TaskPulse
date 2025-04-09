'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  Clock, 
  CalendarIcon, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Plus 
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
import MiniAdminCalendar from "@/components/calendar/mini-admin-calendar";

export default function UserDetail({ params }) {
  const { userId } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [tasksByPriority, setTasksByPriority] = useState({});
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add separate loading states for forms
  const [taskFormLoading, setTaskFormLoading] = useState(false);
  const [eventFormLoading, setEventFormLoading] = useState(false);
  
  // Add separate error states for forms
  const [taskFormError, setTaskFormError] = useState(null);
  const [eventFormError, setEventFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Task dialog state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  
  // Event dialog state
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDateTime: '',
    endDateTime: ''
  });
  
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
  
  // Fetch user details, tasks and events
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchUserDetails();
    }
  }, [userId, status, session]);
  
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
      
      console.log('Raw events from API:', data.events);
      
      // Format events for the calendar component
      const formattedEvents = data.events.map(event => {
        console.log('Processing event:', event);
        
        // Make sure dates are in ISO format
        let startTime = event.startTime;
        let endTime = event.endTime;
        
        // Try to parse and reformat dates if needed
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
          // Ensure startTime and endTime are in proper ISO format for the calendar
          startTime: startTime,
          endTime: endTime
        };
      });
      
      console.log('Formatted events for calendar:', formattedEvents);
      
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
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskFormData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add task');
      }
      
      // Reset form and close dialog
      setTaskFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      setIsAddTaskOpen(false);
      setSuccessMessage('Task added successfully');
      
      // Refresh user details
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
      
      // Make sure we have valid dates
      if (!eventFormData.startDateTime || !eventFormData.endDateTime) {
        throw new Error('Start and end date/time are required');
      }
      
      // Create start and end datetime in ISO format
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
      
      // Reset form and close dialog
      setEventFormData({
        title: '',
        description: '',
        location: '',
        startDateTime: '',
        endDateTime: ''
      });
      setIsAddEventOpen(false);
      setSuccessMessage('Event added successfully');
      
      // Refresh user details
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
  
  if (loading && !user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
        <Button onClick={() => router.push('/admin')}>Back to Admin Dashboard</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Button onClick={() => router.push('/admin')}>Back to Admin Dashboard</Button>
      </div>
      
      {/* Display page-level error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Display success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setSuccessMessage(null)}
          >
            <span className="sr-only">Close</span>
            <span className="text-xl">&times;</span>
          </button>
        </div>
      )}
      
      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 mr-4">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Task Overview</h2>
            <Button onClick={() => setIsAddTaskOpen(true)} size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-gray-800">{taskCounts.total || 0}</div>
              <div className="text-sm text-gray-500">Total Tasks</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">{taskCounts.pending || 0}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{taskCounts.in_progress || 0}</div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-green-600">{taskCounts.completed || 0}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
          
          <h3 className="text-md font-medium mb-2">Tasks by Priority</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-red-50 rounded">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
                <span>High/Urgent</span>
              </div>
              <span className="font-semibold">
                {(tasksByPriority.high?.length || 0) + (tasksByPriority.urgent?.length || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-yellow-600" />
                <span>Medium</span>
              </div>
              <span className="font-semibold">{tasksByPriority.medium?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                <span>Low</span>
              </div>
              <span className="font-semibold">{tasksByPriority.low?.length || 0}</span>
            </div>
          </div>
        </div>
        
        {/* Calendar Events */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Calendar Events</h2>
            <Button onClick={() => setIsAddEventOpen(true)} size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
          </div>
          
          <MiniAdminCalendar userId={userId} events={events} />
        </div>
      </div>
      
      {/* Tasks List */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task._id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-gray-500">{task.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)}
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(task.dueDate)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={(open) => {
        if (!taskFormLoading) {
          setIsAddTaskOpen(open);
          if (!open) setTaskFormError(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task for {user?.firstName} {user?.lastName}</DialogTitle>
          </DialogHeader>
          
          {/* Display task form error */}
          {taskFormError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{taskFormError}</span>
            </div>
          )}
          
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={taskFormData.title}
                onChange={(e) => setTaskFormData({...taskFormData, title: e.target.value})}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={taskFormData.description}
                onChange={(e) => setTaskFormData({...taskFormData, description: e.target.value})}
                placeholder="Enter task description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={taskFormData.priority}
                onValueChange={(value) => setTaskFormData({...taskFormData, priority: value})}
              >
                <SelectTrigger>
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
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={taskFormData.dueDate}
                onChange={(e) => setTaskFormData({...taskFormData, dueDate: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => !taskFormLoading && setIsAddTaskOpen(false)}
                disabled={taskFormLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={taskFormLoading}>
                {taskFormLoading ? 'Adding...' : 'Add Task'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={(open) => {
        if (!eventFormLoading) {
          setIsAddEventOpen(open);
          if (!open) setEventFormError(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event for {user?.firstName} {user?.lastName}</DialogTitle>
          </DialogHeader>
          
          {/* Display event form error */}
          {eventFormError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{eventFormError}</span>
            </div>
          )}
          
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                value={eventFormData.title}
                onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                placeholder="Enter event title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="eventDescription">Description</Label>
              <Textarea
                id="eventDescription"
                value={eventFormData.description}
                onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                placeholder="Enter event description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={eventFormData.location}
                onChange={(e) => setEventFormData({...eventFormData, location: e.target.value})}
                placeholder="Enter location"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDateTime">Start Date & Time</Label>
              <Input
                id="startDateTime"
                type="datetime-local"
                value={eventFormData.startDateTime}
                onChange={(e) => setEventFormData({...eventFormData, startDateTime: e.target.value})}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDateTime">End Date & Time</Label>
              <Input
                id="endDateTime"
                type="datetime-local"
                value={eventFormData.endDateTime}
                onChange={(e) => setEventFormData({...eventFormData, endDateTime: e.target.value})}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => !eventFormLoading && setIsAddEventOpen(false)}
                disabled={eventFormLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={eventFormLoading}>
                {eventFormLoading ? 'Adding...' : 'Add Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 