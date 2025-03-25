"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddTaskDialog({ isOpen, onOpenChange, onAddTask }) {
    const [taskName, setTaskName] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleAddTask = () => {
        if (taskName.trim() === '') return;
        onAddTask(taskName, deadline || '');
        resetForm();
    };

    const resetForm = () => {
        setTaskName('');
        setDeadline('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) resetForm();
            onOpenChange(open);
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="task-name">Task Name</Label>
                                <Input
                                    id="task-name"
                                    placeholder="Enter task description"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                                    className="w-full bg-transparent text-black dark:text-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleAddTask}>Add Task</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}