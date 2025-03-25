"use client";

import React, { useState } from 'react';
import { KanbanColumn } from './kanban-column';
import { AddTaskDialog } from './add-task-dialog';
import { useTheme } from "next-themes";

export function KanbanBoard() {
    const [tasks, setTasks] = useState({
        todo: [
            { id: "t1", content: "Create design mockups", deadline: "2025-03-20" },
            { id: "t2", content: "URGENT: Fix login page bug", deadline: "2025-03-21" },
            { id: "t3", content: "Review pull requests", deadline: "" }
        ],
        done: [{ id: "d1", content: "Setup project repository", deadline: "2025-03-10" }],
        review: [{ id: "r1", content: "Homepage implementation", deadline: "2025-03-15" }]
    });

    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    const addTask = (taskName, deadline) => {
        if (taskName.trim() === '') return;

        const newTaskObj = {
            id: `t${Date.now()}`,
            content: taskName,
            deadline: deadline || '' // Use the provided date or empty string
        };

        setTasks({
            ...tasks,
            todo: [...tasks.todo, newTaskObj]
        });

        setIsAddTaskOpen(false);
    };

    const deleteTask = (id, column) => {
        setTasks({
            ...tasks,
            [column]: tasks[column].filter(task => task.id !== id)
        });
    };

    const renameTask = (id, column, newName) => {
        setTasks({
            ...tasks,
            [column]: tasks[column].map(task =>
                task.id === id ? { ...task, content: newName } : task
            )
        });
    };

    const changeDeadline = (id, column, newDeadline) => {
        setTasks({
            ...tasks,
            [column]: tasks[column].map(task =>
                task.id === id ? { ...task, deadline: newDeadline } : task
            )
        });
    };

    const markAsCompleted = (id, column) => {
        const taskToMove = tasks[column].find(task => task.id === id);

        setTasks({
            ...tasks,
            [column]: tasks[column].filter(task => task.id !== id),
            done: [...tasks.done, taskToMove]
        });
    };

    // Enhanced function to update task properties - FIXED to ensure state updates correctly
    const updateTask = (id, column, updatedProps) => {
        console.log(`Updating task ${id} in ${column} with:`, updatedProps);

        setTasks(prevTasks => {
            // Create a new array for the specific column
            const updatedColumn = prevTasks[column].map(task =>
                task.id === id ? { ...task, ...updatedProps } : task
            );

            // Return the updated tasks state
            return {
                ...prevTasks,
                [column]: updatedColumn
            };
        });
    };

    const handleDragStart = (e, id, sourceColumn) => {
        e.dataTransfer.setData('taskId', id);
        e.dataTransfer.setData('sourceColumn', sourceColumn);
    };

    const handleDrop = (e, targetColumn) => {
        const taskId = e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn');

        if (sourceColumn === targetColumn) return;

        const taskToMove = tasks[sourceColumn].find(task => task.id === taskId);

        setTasks({
            ...tasks,
            [sourceColumn]: tasks[sourceColumn].filter(task => task.id !== taskId),
            [targetColumn]: [...tasks[targetColumn], taskToMove]
        });
    };

    const handleOpenAddTask = () => {
        setIsAddTaskOpen(true);
    };

    const { theme } = useTheme();

    return (
        <div className="mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanColumn
                    title="Tasks"
                    tasks={tasks.todo}
                    columnId="todo"
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDelete={deleteTask}
                    onRename={renameTask}
                    onChangeDeadline={changeDeadline}
                    onMarkCompleted={markAsCompleted}
                    onAddTask={handleOpenAddTask}
                    onUpdateTask={updateTask}
                />

                <KanbanColumn
                    title="In Review"
                    tasks={tasks.review}
                    columnId="review"
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDelete={deleteTask}
                    onRename={renameTask}
                    onChangeDeadline={changeDeadline}
                    onUpdateTask={updateTask}
                />

                <KanbanColumn
                    title="Done"
                    tasks={tasks.done}
                    columnId="done"
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDelete={deleteTask}
                    onRename={renameTask}
                    onChangeDeadline={changeDeadline}
                    onUpdateTask={updateTask}
                />
            </div>

            <AddTaskDialog
                isOpen={isAddTaskOpen}
                onOpenChange={setIsAddTaskOpen}
                onAddTask={addTask}
            />
        </div>
    );
}