import React, { useState } from 'react';
import { Calendar, PieChart, BarChart3, LineChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, LineChart as RLineChart, Line, CartesianGrid, Legend } from 'recharts';

// Sample data
const initialTodos = [
    { id: 1, text: 'Complete dashboard project', completed: false, priority: 'high', dueDate: '2025-03-23', category: 'Work' },
    { id: 2, text: 'Review documentation', completed: true, priority: 'medium', dueDate: '2025-03-21', category: 'Work' },
    { id: 3, text: 'Update dependencies', completed: false, priority: 'low', dueDate: '2025-03-22', category: 'Development' },
    { id: 4, text: 'Fix responsive issues', completed: false, priority: 'high', dueDate: '2025-03-24', category: 'Development' },
    { id: 5, text: 'Grocery shopping', completed: true, priority: 'medium', dueDate: '2025-03-21', category: 'Personal' },
    { id: 6, text: 'Workout session', completed: false, priority: 'medium', dueDate: '2025-03-22', category: 'Personal' },
    { id: 7, text: 'Team feedback session', completed: false, priority: 'high', dueDate: '2025-03-25', category: 'Work' },
];

const initialMeetings = [
    { id: 1, title: 'Weekly Team Standup', startTime: '09:00', endTime: '09:30', date: '2025-03-22', participants: ['Alex', 'Taylor', 'Jordan'], category: 'Team' },
    { id: 2, title: 'Project Review', startTime: '13:00', endTime: '14:00', date: '2025-03-21', participants: ['Sam', 'Casey'], category: 'Project' },
    { id: 3, title: 'Client Presentation', startTime: '15:00', endTime: '16:00', date: '2025-03-25', participants: ['Morgan', 'Riley', 'Jamie'], category: 'Client' },
    { id: 4, title: 'Sprint Planning', startTime: '10:00', endTime: '11:30', date: '2025-03-23', participants: ['Alex', 'Taylor', 'Jordan', 'Sam'], category: 'Team' },
    { id: 5, title: 'One-on-One with Manager', startTime: '14:00', endTime: '14:30', date: '2025-03-24', participants: ['You', 'Manager'], category: 'Personal' },
];

// Daily activity data (past 7 days)
const activityData = [
    { name: '3/15', completed: 3, added: 5 },
    { name: '3/16', completed: 4, added: 2 },
    { name: '3/17', completed: 2, added: 3 },
    { name: '3/18', completed: 5, added: 1 },
    { name: '3/19', completed: 3, added: 4 },
    { name: '3/20', completed: 2, added: 3 },
    { name: '3/21', completed: 4, added: 2 },
];

// Helper functions
const generateDateRange = (daysAhead = 14) => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < daysAhead; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayOfMonth: date.getDate()
        });
    }

    return dates;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
    const [todos, setTodos] = useState(initialTodos);
    const [meetings, setMeetings] = useState(initialMeetings);
    const [newTodoText, setNewTodoText] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [activeTab, setActiveTab] = useState('overview');
    const dateRange = generateDateRange();

    // Todo handlers
    const addTodo = () => {
        if (newTodoText.trim()) {
            const newTodo = {
                id: Date.now(),
                text: newTodoText,
                completed: false,
                priority: 'medium',
                dueDate: selectedDate,
                category: 'Work' // Default category
            };
            setTodos([...todos, newTodo]);
            setNewTodoText('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    // Filter items for selected date
    const todosForSelectedDate = todos.filter(todo => todo.dueDate === selectedDate);
    const meetingsForSelectedDate = meetings.filter(meeting => meeting.date === selectedDate);

    // Calculate stats
    const completedTodos = todos.filter(todo => todo.completed).length;
    const totalTodos = todos.length;
    const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
    const upcomingMeetings = meetings.filter(meeting => new Date(meeting.date) >= new Date()).length;

    // Prepare data for charts
    const preparePriorityData = () => {
        const priorityCounts = { high: 0, medium: 0, low: 0 };
        todos.forEach(todo => {
            priorityCounts[todo.priority]++;
        });

        return Object.keys(priorityCounts).map(key => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: priorityCounts[key]
        }));
    };

    const prepareCategoryData = () => {
        const categoryCounts = {};
        todos.forEach(todo => {
            categoryCounts[todo.category] = (categoryCounts[todo.category] || 0) + 1;
        });

        return Object.keys(categoryCounts).map(key => ({
            name: key,
            todos: categoryCounts[key]
        }));
    };

    const prepareMeetingCategoryData = () => {
        const categoryCounts = {};
        meetings.forEach(meeting => {
            categoryCounts[meeting.category] = (categoryCounts[meeting.category] || 0) + 1;
        });

        return Object.keys(categoryCounts).map(key => ({
            name: key,
            meetings: categoryCounts[key]
        }));
    };

    const priorityData = preparePriorityData();
    const categoryData = prepareCategoryData();
    const meetingCategoryData = prepareMeetingCategoryData();

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-500">Manage your todos, calendar, and meetings</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Stats Overview (visible on all tabs) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionRate}%</div>
                        <p className="text-xs text-gray-500">{completedTodos} of {totalTodos} tasks completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Todos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todos.filter(todo => !todo.completed).length}</div>
                        <p className="text-xs text-gray-500">Tasks remaining</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingMeetings}</div>
                        <p className="text-xs text-gray-500">Scheduled meetings</p>
                    </CardContent>
                </Card>
            </div>

            {/* Calendar Strip (visible on all tabs except analytics) */}
            {activeTab !== 'analytics' && (
                <div className="mb-6 overflow-x-auto">
                    <div className="flex space-x-2 pb-2">
                        {dateRange.map((dateItem) => (
                            <Button
                                key={dateItem.date}
                                variant={dateItem.date === selectedDate ? "default" : "outline"}
                                className="flex flex-col items-center min-w-16"
                                onClick={() => setSelectedDate(dateItem.date)}
                            >
                                <span className="text-xs">{dateItem.day}</span>
                                <span className="text-lg font-bold">{dateItem.dayOfMonth}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    <span>Selected Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </CardTitle>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Todo List</CardTitle>
                                <CardDescription>Manage your tasks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex mb-4">
                                    <Input
                                        placeholder="Add a new todo..."
                                        value={newTodoText}
                                        onChange={(e) => setNewTodoText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                                        className="flex-1 mr-2"
                                    />
                                    <Button onClick={addTodo}>Add</Button>
                                </div>

                                <div className="space-y-2">
                                    {todosForSelectedDate.length > 0 ? (
                                        todosForSelectedDate.map((todo) => (
                                            <div key={todo.id} className="flex items-center justify-between p-2 border rounded">
                                                <div className="flex items-center">
                                                    <Checkbox
                                                        checked={todo.completed}
                                                        onCheckedChange={() => toggleTodo(todo.id)}
                                                        className="mr-2"
                                                    />
                                                    <span className={todo.completed ? "line-through text-gray-500" : ""}>
                            {todo.text}
                          </span>
                                                    <div className={`ml-2 w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`} />
                                                    <Badge variant="outline" className="ml-2">{todo.category}</Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteTodo(todo.id)}
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No todos for this date</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Meetings</CardTitle>
                                <CardDescription>Your scheduled meetings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {meetingsForSelectedDate.length > 0 ? (
                                        meetingsForSelectedDate.map((meeting) => (
                                            <div key={meeting.id} className="p-4 border rounded">
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-bold">{meeting.title}</h3>
                                                    <span className="text-sm">{meeting.startTime} - {meeting.endTime}</span>
                                                </div>
                                                <Badge className="mb-2">{meeting.category}</Badge>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {meeting.participants.map((participant, idx) => (
                                                        <Badge key={idx} variant="secondary">{participant}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No meetings scheduled for this date</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Analytics Tab Content */}
            {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Todo Analytics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <PieChart className="mr-2 h-5 w-5" />
                                <span>Todo Priority Distribution</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <RPieChart>
                                    <Pie
                                        data={priorityData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RPieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart3 className="mr-2 h-5 w-5" />
                                <span>Todos by Category</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="todos" fill="#0088FE" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Meeting Analytics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart3 className="mr-2 h-5 w-5" />
                                <span>Meetings by Category</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={meetingCategoryData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="meetings" fill="#00C49F" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Activity Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <LineChart className="mr-2 h-5 w-5" />
                                <span>Task Activity (Last 7 Days)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <RLineChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="completed" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="added" stroke="#82ca9d" />
                                </RLineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Calendar Tab Content */}
            {activeTab === 'calendar' && (
                <div>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5" />
                                <span>Selected Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold">Daily Schedule</h2>

                                {meetingsForSelectedDate.length > 0 ? (
                                    meetingsForSelectedDate
                                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                        .map((meeting) => (
                                            <div key={meeting.id} className="flex p-2 border-l-4 border-blue-500">
                                                <div className="w-24 text-sm font-medium">
                                                    {meeting.startTime} - {meeting.endTime}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold">{meeting.title}</h3>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {meeting.participants.map((participant, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs">{participant}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <p className="text-gray-500 py-4">No meetings scheduled for this date</p>
                                )}

                                <h2 className="text-xl font-bold mt-6">Tasks Due Today</h2>
                                {todosForSelectedDate.length > 0 ? (
                                    <div className="space-y-2">
                                        {todosForSelectedDate.map((todo) => (
                                            <div key={todo.id} className="flex items-center p-2 border-l-4 border-green-500">
                                                <Checkbox
                                                    checked={todo.completed}
                                                    onCheckedChange={() => toggleTodo(todo.id)}
                                                    className="mr-2"
                                                />
                                                <span className={todo.completed ? "line-through text-gray-500" : ""}>
                          {todo.text}
                        </span>
                                                <Badge variant="outline" className="ml-2">{todo.category}</Badge>
                                                <div className={`ml-2 w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 py-4">No tasks due on this date</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Dashboard;