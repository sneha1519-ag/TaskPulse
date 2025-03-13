"use client";
import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

const KanbanBoard = () => {
    const sections = ["Task", "Done", "Review"];
    const [tasks, setTasks] = useState({
        Task: [],
        Done: [],
        Review: []
    });

    const [showDialog, setShowDialog] = useState(false);
    const [taskData, setTaskData] = useState({ name: "", deadline: "", section: "Task" });
    const [editTask, setEditTask] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null); // Track open menu

    // Handle input change in the dialog
    const handleInputChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    // Open Add Task Dialog
    const openAddTaskDialog = (section) => {
        setTaskData({ name: "", deadline: "", section });
        setEditTask(null);
        setShowDialog(true);
    };

    // Open Edit Task Dialog
    const openEditTaskDialog = (task, section) => {
        setTaskData({ name: task.name, deadline: task.deadline, section });
        setEditTask(task);
        setShowDialog(true);
        setMenuOpen(null); // Close menu when editing
    };

    // Handle Save Task
    const handleSaveTask = () => {
        const updatedTasks = { ...tasks };
        if (editTask) {
            // Edit existing task
            updatedTasks[taskData.section] = updatedTasks[taskData.section].map((t) =>
                t === editTask ? { ...taskData } : t
            );
        } else {
            // Add new task
            updatedTasks["Task"].push({ name: taskData.name, deadline: taskData.deadline });
        }
        setTasks(updatedTasks);
        setShowDialog(false);
    };

    // Handle Delete Task
    const handleDeleteTask = (section, task) => {
        setTasks((prevTasks) => ({
            ...prevTasks,
            [section]: prevTasks[section].filter((t) => t !== task)
        }));
        setMenuOpen(null);
    };

    // Move task to "Done"
    const markTaskAsCompleted = (task) => {
        setTasks((prevTasks) => ({
            Task: prevTasks.Task.filter((t) => t !== task),
            Done: [...prevTasks.Done, task],
            Review: prevTasks.Review
        }));
        setMenuOpen(null);
    };

    return (
        <div className="flex gap-10 p-6 bg-zinc-200 dark:bg-zinc-800 min-h-screen relative">
            {sections.map((section, index) => (
                <div key={index} className="w-85 bg-white dark:bg-black rounded-xl shadow-lg p-4">
                    {/* Section Header */}
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">{section} <span>{tasks[section].length}</span></span>
                        {section === "Task" && (
                            <Plus className="w-5 h-5 text-zinc-400 cursor-pointer" onClick={() => openAddTaskDialog(section)} />
                        )}
                    </div>

                    {/* Task List */}
                    <div className="space-y-2">
                        {tasks[section].map((task, taskIndex) => (
                            <div key={taskIndex} className="flex justify-between items-center p-3 rounded-lg">
                                <div>
                                    <p>{task.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">Deadline: {task.deadline}</p>
                                </div>
                                <div className="relative">
                                    {section !== "Done" && (
                                        <div className="relative">
                                            <MoreHorizontal
                                                className="w-5 h-5 text-zinc-400 cursor-pointer"
                                                onClick={() => setMenuOpen(taskIndex === menuOpen ? null : taskIndex)}
                                            />
                                            {menuOpen === taskIndex && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-2">
                                                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                                                            onClick={() => openEditTaskDialog(task, section)}>
                                                        Rename
                                                    </button>
                                                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                                                            onClick={() => handleDeleteTask(section, task)}>
                                                        Delete
                                                    </button>
                                                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                                                            onClick={() => openEditTaskDialog(task, section)}>
                                                        Change Deadline
                                                    </button>
                                                    {section === "Task" && (
                                                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                                                                onClick={() => markTaskAsCompleted(task)}>
                                                            Mark as Completed
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {menuOpen === taskIndex && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-lg p-2">
                                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800" onClick={() => openEditTaskDialog(task, section)}>Rename</button>
                                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800" onClick={() => handleDeleteTask(section, task)}>Delete</button>
                                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800" onClick={() => openEditTaskDialog(task, section)}>Change Deadline</button>
                                            {section === "Task" && (
                                                <button className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800" onClick={() => markTaskAsCompleted(task)}>Mark as Completed</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Task Button (Only for "Task" section) */}
                    {section === "Task" && (
                        <div
                            className="h-10 rounded-lg flex items-center justify-center mt-2 cursor-pointer"
                            onClick={() => openAddTaskDialog(section)}
                        >
                            + Add task
                        </div>
                    )}
                </div>
            ))}

            {/* Task Dialog Box */}
            {showDialog && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-lg">
                    <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">{editTask ? "Edit Task" : "Add Task"}</h2>
                        <label className="block text-sm font-medium">Task Name</label>
                        <input
                            type="text"
                            name="name"
                            value={taskData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 mb-3 border rounded-lg"
                        />
                        <label className="block text-sm font-medium">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={taskData.deadline}
                            onChange={handleInputChange}
                            className="w-full p-2 mt-1 mb-3 border rounded-lg"
                        />
                        <div className="flex justify-end space-x-2">
                            <button className="px-4 py-2 bg-gray-300 dark:bg-gray-500 rounded-lg" onClick={() => setShowDialog(false)}>Cancel</button>
                            <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg" onClick={handleSaveTask}>
                                {editTask ? "Save Changes" : "Add Task"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KanbanBoard;
