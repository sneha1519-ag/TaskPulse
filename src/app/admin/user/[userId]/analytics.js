'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const UserAnalytics = ({ userId, userData }) => {
  const [taskPriorityData, setTaskPriorityData] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [userPerformance, setUserPerformance] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [taskTrends, setTaskTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme colors as per requirements
  const COLORS = {
    // Light theme
    primary: '#2D336B',      // Deep blue
    secondary: '#A9B5DF',    // Light indigo
    background: '#FFFFFF',   // White
    // Status colors
    low: '#4ade80',          // Green-400 for low priority
    medium: '#fb923c',       // Orange-400 for medium priority
    high: '#f87171',         // Red-400 for high priority
    urgent: '#a78bfa',       // Violet-400 for urgent priority
    completed: '#4ade80',    // Green-400 for completed status
    in_progress: '#60a5fa',  // Blue-400 for in-progress status
    pending: '#fb923c',      // Orange-400 for pending status
    cancelled: '#f87171',    // Red-400 for cancelled status
    // Dark theme colors will be handled via CSS dark mode classes
  };

  // Priority colors that align with the theme
  const PRIORITY_COLORS = {
    low: '#A9B5DF',
    medium: '#7986CB',
    high: '#5465AB',
    urgent: '#2D336B'
  };

  // Status colors that align with the theme
  const STATUS_COLORS = {
    completed: '#4ade80',
    in_progress: '#60a5fa',
    pending: '#fb923c',
    cancelled: '#f87171'
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user analytics data
        const response = await fetch(`/api/users/${userId}/analytics`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user analytics data');
        }
        
        const data = await response.json();
        
        // Process task priority data from the API
        if (data.tasksByPriority) {
          const priorities = Object.entries(data.tasksByPriority).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: value.length || 0,
            color: PRIORITY_COLORS[key.toLowerCase()] || '#2D336B'
          }));
          setTaskPriorityData(priorities);
        }
        
        // Process task status data from the API
        if (data.tasksByStatus) {
          const statuses = Object.entries(data.tasksByStatus).map(([key, value]) => ({
            name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            value: value.length || 0,
            color: STATUS_COLORS[key.toLowerCase()] || '#2D336B'
          }));
          setTaskStatusData(statuses);
        }
        
        // Process user performance metrics
        if (data.performanceMetrics) {
          const performance = [
            { subject: 'Completion Rate', A: data.performanceMetrics.completionRate || 0, fullMark: 100 },
            { subject: 'On-Time Rate', A: data.performanceMetrics.onTimeRate || 0, fullMark: 100 },
            { subject: 'Task Quality', A: data.performanceMetrics.taskQuality || 0, fullMark: 100 },
            { subject: 'Productivity', A: data.performanceMetrics.productivity || 0, fullMark: 100 },
            { subject: 'Engagement', A: data.performanceMetrics.engagement || 0, fullMark: 100 },
          ];
          setUserPerformance(performance);
        }
        
        // Process events by month data
        if (data.eventsByMonth) {
          setUserEvents(data.eventsByMonth);
        }
        
        // Process task trends data
        if (data.taskTrends) {
          setTaskTrends(data.taskTrends);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError(err.message);
      setLoading(false);
        
        // If there's an error, use fallback data for display
        provideFallbackData();
      }
    };
    
    const provideFallbackData = () => {
      // If API fails, calculate analytics from the user data we already have
      // This ensures we always show something rather than empty charts
      
      // Create minimal task priority data based on user.tasks if available
      if (userData && userData.tasks) {
        const priorityCounts = { low: 0, medium: 0, high: 0, urgent: 0 };
        userData.tasks.forEach(task => {
          if (task.priority) {
            priorityCounts[task.priority.toLowerCase()] = (priorityCounts[task.priority.toLowerCase()] || 0) + 1;
          }
        });
        
        const priorityData = Object.entries(priorityCounts).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value,
          color: PRIORITY_COLORS[key.toLowerCase()] || '#2D336B'
        }));
        
        setTaskPriorityData(priorityData);
      } else {
        // Absolute fallback if no data at all
        setTaskPriorityData([
          { name: 'Low', value: 0, color: PRIORITY_COLORS.low },
          { name: 'Medium', value: 0, color: PRIORITY_COLORS.medium },
          { name: 'High', value: 0, color: PRIORITY_COLORS.high },
          { name: 'Urgent', value: 0, color: PRIORITY_COLORS.urgent }
        ]);
      }
      
      // Similar fallback logic for other datasets
      setTaskStatusData([
        { name: 'Completed', value: 0, color: STATUS_COLORS.completed },
        { name: 'In Progress', value: 0, color: STATUS_COLORS.in_progress },
        { name: 'Pending', value: 0, color: STATUS_COLORS.pending }
      ]);
      
      setUserPerformance([
        { subject: 'Completion Rate', A: 0, fullMark: 100 },
        { subject: 'On-Time Rate', A: 0, fullMark: 100 },
        { subject: 'Task Quality', A: 0, fullMark: 100 },
        { subject: 'Productivity', A: 0, fullMark: 100 },
        { subject: 'Engagement', A: 0, fullMark: 100 },
      ]);
      
      // Create 6 months of empty event data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      setUserEvents(months.map(month => ({ name: month, events: 0 })));
      
      // Set empty task trends
      setTaskTrends(months.map(month => ({ 
        name: month, 
        completed: 0, 
        created: 0
      })));
    };

    if (userId) {
      fetchAnalyticsData();
    }
  }, [userId, userData]);

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

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-800 p-3 border border-gray-200 dark:border-zinc-700 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.fill }} className="text-sm">
              {`${entry.name || entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <div className="w-full max-w-none mt-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
          <p>Failed to load analytics data: {error}</p>
          <p className="text-sm mt-1">Showing limited analytics information.</p>
        </div>
        {/* Render basic charts with fallback data */}
      </div>
    );
  }

  // Skeleton loader for charts
  const ChartSkeleton = () => (
    <div className="w-full space-y-3">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="h-[300px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
        <p className="text-gray-500 dark:text-gray-400">Loading chart data...</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-none">
      <motion.h2 
        className="text-2xl font-bold mb-6 text-[#2D336B] dark:text-[#A9B5DF]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Task Analytics Dashboard
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Tasks */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="text-gray-500 dark:text-gray-400">Total Tasks</div>
                <div className="p-2 rounded-full bg-[#2D336B]/10 dark:bg-[#A9B5DF]/10 text-[#2D336B] dark:text-[#A9B5DF]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold">{loading ? 
                  <Skeleton className="h-10 w-16" /> : 
                  taskPriorityData.reduce((sum, item) => sum + item.value, 0)
                }</h3>
                <span className="text-sm font-medium text-green-500">+12%</span>
              </div>
            </div>
          </motion.div>

          {/* Completed Tasks */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="text-gray-500 dark:text-gray-400">Completed</div>
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold">{loading ? 
                  <Skeleton className="h-10 w-16" /> : 
                  taskStatusData.find(status => status.name === 'Completed')?.value || 0
                }</h3>
                <span className="text-sm font-medium text-green-500">+8%</span>
              </div>
            </div>
          </motion.div>

          {/* Pending Tasks */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="text-gray-500 dark:text-gray-400">Pending</div>
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold">{loading ? 
                  <Skeleton className="h-10 w-16" /> : 
                  taskStatusData.find(status => status.name === 'Pending')?.value || 0
                }</h3>
                <span className="text-sm font-medium text-red-500">-3%</span>
              </div>
            </div>
          </motion.div>

          {/* High Priority Tasks */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="text-gray-500 dark:text-gray-400">High Priority</div>
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-3xl font-bold">{loading ? 
                  <Skeleton className="h-10 w-16" /> : 
                  (taskPriorityData.find(priority => priority.name === 'High')?.value || 0) +
                  (taskPriorityData.find(priority => priority.name === 'Urgent')?.value || 0)
                }</h3>
                <span className="text-sm font-medium text-red-500">+5%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-1">
            <TabsTrigger 
              value="overview" 
              className="rounded-md data-[state=active]:bg-[#2D336B] data-[state=active]:text-white dark:data-[state=active]:bg-[#A9B5DF] dark:data-[state=active]:text-black"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="status" 
              className="rounded-md data-[state=active]:bg-[#2D336B] data-[state=active]:text-white dark:data-[state=active]:bg-[#A9B5DF] dark:data-[state=active]:text-black"
            >
              Status
            </TabsTrigger>
            <TabsTrigger 
              value="priority" 
              className="rounded-md data-[state=active]:bg-[#2D336B] data-[state=active]:text-white dark:data-[state=active]:bg-[#A9B5DF] dark:data-[state=active]:text-black"
            >
              Priority
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border shadow-sm bg-white dark:bg-black rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#2D336B] dark:text-[#A9B5DF]">Task Trends</CardTitle>
                <CardDescription>Task creation and completion over time</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? <ChartSkeleton /> : (
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={taskTrends}
                        margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="created" 
                          name="Created" 
                          stroke="#2D336B" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="completed" 
                          name="Completed" 
                          stroke="#4ade80" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Status Tab */}
          <TabsContent value="status" className="space-y-6">
            <Card className="border shadow-sm bg-white dark:bg-black rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#2D336B] dark:text-[#A9B5DF]">Task Status Distribution</CardTitle>
                <CardDescription>Breakdown of tasks by their current status</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? <ChartSkeleton /> : (
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={taskStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => {
                            if (percent < 0.1) return null; // Don't show labels for very small slices
                            return `${name}\n${(percent * 100).toFixed(0)}%`;
                          }}
                        >
                          {taskStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          wrapperStyle={{ 
                            paddingLeft: '20px',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color }}>
                              {value}: {entry.payload.value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Priority Tab */}
          <TabsContent value="priority" className="space-y-6">
            <Card className="border shadow-sm bg-white dark:bg-black rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#2D336B] dark:text-[#A9B5DF]">Task Priority Distribution</CardTitle>
                <CardDescription>Breakdown of tasks by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? <ChartSkeleton /> : (
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={taskPriorityData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorPriority" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2D336B" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2D336B" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#2D336B" 
                          fillOpacity={1} 
                          fill="url(#colorPriority)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default UserAnalytics; 