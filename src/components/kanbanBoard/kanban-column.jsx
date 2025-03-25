"use client";

import React, { useState } from 'react';
import { TaskCard } from './task-card';
import { Button } from "@/components/ui/button";
import { Plus, Stars, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { autoPrioritizeTask, batchPrioritizeTasks } from "@/components/kanbanBoard/taskPrioritization.js";

export function KanbanColumn({
                                 title,
                                 tasks,
                                 columnId,
                                 onDragStart,
                                 onDrop,
                                 onDelete,
                                 onRename,
                                 onChangeDeadline,
                                 onMarkCompleted,
                                 onAddTask,
                                 onUpdateTask,
                             }) {
    const [isPrioritizing, setIsPrioritizing] = useState(false);
    const [prioritizingTasks, setPrioritizingTasks] = useState([]);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const { theme } = useTheme();

    // Function to prioritize a single task
    const prioritizeTask = async (task) => {
        setPrioritizingTasks(prev => [...prev, task.id]);
        try {
            const taskDescription = task.content;
            const deadline = task.deadline;
            const priority = await autoPrioritizeTask(taskDescription, deadline);

            if (onUpdateTask) {
                onUpdateTask(task.id, columnId, { priority });
                console.log(`Prioritized task ${task.id} to ${priority}`);
            }
        } catch (error) {
            console.error("Failed to prioritize task:", error);
        } finally {
            setPrioritizingTasks(prev => prev.filter(id => id !== task.id));
        }
    };

    // Function to prioritize all tasks in the column - fixed to properly batch update
    const handlePrioritizeAll = async () => {
        if (tasks.length === 0 || !onUpdateTask) return;

        // Set overall prioritizing state to show loading on button
        setIsPrioritizing(true);

        try {
            // Create task data for batch processing
            const taskData = tasks.map(task => ({
                id: task.id,
                content: task.content,
                deadline: task.deadline || ''
            }));

            console.log("Processing tasks for prioritization:", taskData);

            // Get priorities for all tasks
            const results = await batchPrioritizeTasks(taskData);
            console.log("Prioritization results:", results);

            // Update each task one by one to ensure all get updated
            for (const result of results) {
                onUpdateTask(result.id, columnId, { priority: result.priority });
                console.log(`Prioritized task ${result.id} to ${result.priority}`);

                // Slight delay between updates to prevent state conflicts
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            console.log(`Successfully prioritized ${results.length} tasks`);
        } catch (error) {
            console.error("Failed to prioritize tasks:", error);
        } finally {
            setIsPrioritizing(false);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={(e) => onDrop(e, columnId)}
            className="border border-gray-300 dark:border-zinc-600 rounded-lg p-4 flex-1"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">{title}</h2>
                <div className="flex space-x-1">
                    {/* Only show Add button and Prioritize All button for the todo column */}
                    {columnId === 'todo' && (
                        <>
                            {onAddTask && (
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddTask}>
                                    <Plus className="h-4 w-4"/>
                                </Button>
                            )}
                            {onUpdateTask && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={handlePrioritizeAll}
                                    disabled={isPrioritizing || tasks.length === 0}
                                    title="Auto-prioritize all tasks"
                                >
                                    {isPrioritizing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Stars className="h-4 w-4" />
                                    )}
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {tasks.map((task) => (
                    <div key={task.id} className="relative group">
                        <TaskCard
                            task={task}
                            columnId={columnId}
                            onDragStart={onDragStart}
                            onDelete={onDelete}
                            onRename={onRename}
                            onChangeDeadline={onChangeDeadline}
                            onMarkCompleted={onMarkCompleted && columnId === 'todo' ? onMarkCompleted : null}
                        />
                        {prioritizingTasks.includes(task.id) && (
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center rounded-lg">
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                            </div>
                        )}
                        {/* Only show individual task prioritize button for todo column */}
                        {columnId === 'todo' && onUpdateTask && !task.priority && !prioritizingTasks.includes(task.id) && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => prioritizeTask(task)}
                            >
                                <Stars className="h-3 w-3 mr-1" /> Prioritize
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}