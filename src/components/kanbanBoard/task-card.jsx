"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Edit, Calendar, CheckCircle, X, AlertTriangle, AlertCircle, CheckCircle2} from "lucide-react";

export function TaskCard({
                             task,
                             columnId,
                             onDragStart,
                             onDelete,
                             onRename,
                             onChangeDeadline,
                             onMarkCompleted,
                         }) {
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeadlineOpen, setIsDeadlineOpen] = useState(false);
    const [newTaskName, setNewTaskName] = useState(task.content);
    const [newDeadline, setNewDeadline] = useState(task.deadline);

    const handleRename = () => {
        if (newTaskName.trim() !== '') {
            onRename(task.id, columnId, newTaskName);
            setIsRenameOpen(false);
        }
    };

    const handleChangeDeadline = () => {
        onChangeDeadline(task.id, columnId, newDeadline);
        setIsDeadlineOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No deadline";

        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    // Priority color and icon mapping
    const getPriorityStyles = () => {
        if (!task.priority) return {
            bgColor: "bg-[rgba(229,231,235,0.1)]",
            textColor: "",
            icon: null
        };

        switch (task.priority) {
            case "High":
                return {
                    bgColor: "border-grey-400 bg-[#f0ebed] dark:bg-[#4b2338] dark:border-zinc-600",
                    textColor: "text-red-800 dark:text-red-600",
                    icon: <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
                };
            case "Medium":
                return {
                    bgColor: "border-grey-400 dark:border-zinc-600 bg-[rgba(254,234,13,0.2)] dark:bg-[rgba(253,218,13,0.2)]",
                    textColor: "text-yellow-700 dark:text-yellow-400",
                    icon: <AlertCircle className="h-4 w-4 mr-1 text-yellow-600" />
                };
            case "Low":
                return {
                    bgColor: "border-grey-400 dark:border-zinc-600 bg-[rgba(209,250,229,0.2)] dark:bg-[rgba(50,205,50,0.2)]",
                    textColor: "text-green-700 dark:text-green-400",
                    icon: <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                };
            default:
                return {
                    bgColor: "bg-[rgba(229,231,235,0.1)]",
                    textColor: "",
                    icon: null
                };
        }
    };

    const priorityStyles = getPriorityStyles();

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task.id, columnId)}
            className={`border border-gray-200 rounded-lg p-3 shadow-sm ${priorityStyles.bgColor}`}
        >
            <div className="flex justify-between items-start">
                <div className="flex flex-col w-full">
                    <p className="font-medium">{task.content}</p>
                    <div className="flex items-center justify-between w-full mt-2">
                        <p className="text-sm text-gray-500">Due: {formatDate(task.deadline)}</p>
                        {task.priority && (
                            <div className={`flex items-center text-xs px-2 py-1 rounded-full font-medium ${priorityStyles.textColor}`}>
                                {priorityStyles.icon}
                                {task.priority}
                            </div>
                        )}
                    </div>
                </div>
                {columnId === 'todo' ? (
                    <div className="flex items-center gap-2 ml-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsRenameOpen(true)}>
                            <Edit className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDeadlineOpen(true)}>
                            <Calendar className="h-4 w-4"/>
                        </Button>
                        {onMarkCompleted && (
                            <Button variant="ghost" size="icon" className="h-8 w-8"
                                    onClick={() => onMarkCompleted(task.id, columnId)}>
                                <CheckCircle className="h-4 w-4"/>
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8"
                                onClick={() => onDelete(task.id, columnId)}>
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-2" onClick={() => onDelete(task.id, columnId)}>
                        <X className="h-4 w-4"/>
                    </Button>
                )}
            </div>

            {/* Rename Dialog */}
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rename Task</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                        <Input
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            placeholder="Task name"
                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handleRename}>Save</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Change Deadline Dialog */}
            <Dialog open={isDeadlineOpen} onOpenChange={setIsDeadlineOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change Deadline</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                        <Input
                            type="date"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handleChangeDeadline}>Save</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}