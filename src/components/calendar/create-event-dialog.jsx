import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bookmark, Plus, CheckIcon } from "lucide-react"
import { useSession } from "next-auth/react";

const colorMapping = {
    "#7986CB": "border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30",
    "#33B679": "border-green-500 bg-green-100 dark:bg-green-900/30",
    "#8E24AA": "border-purple-500 bg-purple-100 dark:bg-purple-900/30",
    "#E67C73": "border-red-500 bg-red-100 dark:bg-red-900/30",
    "#F6BF26": "border-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
    "#F4511E": "border-orange-500 bg-orange-100 dark:bg-orange-900/30",
    "#039BE5": "border-blue-500 bg-blue-100 dark:bg-blue-900/30",
    "#616161": "border-gray-500 bg-gray-100 dark:bg-gray-900/30",
    "#3F51B5": "border-indigo-700 bg-indigo-200 dark:bg-indigo-800/30",
    "#0B8043": "border-green-700 bg-green-200 dark:bg-green-800/30",
    "#D50000": "border-red-700 bg-red-200 dark:bg-red-800/30"
};

const colorOptions = [
    "#7986CB",
    "#33B679",
    "#8E24AA",
    "#E67C73",
    "#F6BF26",
    "#F4511E",
    "#039BE5",
    "#616161",
    "#3F51B5",
    "#0B8043",
    "#D50000"
];

const CreateEventDialog = () => {
    const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
    const [open, setOpen] = useState(false);

    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [start, setStartDate] = useState("");
    const [end, setEndDate] = useState("");

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setSelectedColor(colorOptions[0]);
    };

    const formatEventTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Include color in extendedProperties for custom data
            const eventData = {
                summary: title,
                description,
                start: {
                    dateTime: new Date(start).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: new Date(end).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                extendedProperties: {
                    private: {
                        color: colorMapping[selectedColor] // Store the CSS class for the color
                    }
                }
            };

            const response = await fetch('/api/calendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) throw new Error('Failed to create event');

            const createdEvent = await response.json();

            // Format the event for display consistency
            const formattedEvent = {
                id: createdEvent.id || `temp-${Date.now()}`,
                title: title,
                start: {
                    dateTime: new Date(start).toISOString()
                },
                end: {
                    dateTime: new Date(end).toISOString()
                },
                color: colorMapping[selectedColor],
                description: description,
                time: formatEventTime(start)
            };

            // Close dialog and reset form on success
            setOpen(false);
            resetForm();

            // Trigger event to refresh calendar with new event data
            window.dispatchEvent(new CustomEvent('calendar-event-created', {
                detail: { event: formattedEvent }
            }));

        } catch (err) {
            setError('Failed to create event: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();

        try {
            const eventData = {
                summary: title,
                description,
                start: {
                    dateTime: new Date(start).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: new Date(end).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                extendedProperties: {
                    private: {
                        color: colorMapping[selectedColor]
                    }
                }
            };

            const response = await fetch('/api/calendar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: currentEvent.id,
                    eventData
                }),
            });

            if (!response.ok) throw new Error('Failed to update event');

            setIsUpdating(false);
            resetForm();
            fetchEvents(); // Refresh events list
        } catch (err) {
            setError('Failed to update event: ' + err.message);
            console.error(err);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await fetch('/api/calendar', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId }),
            });

            if (!response.ok) throw new Error('Failed to delete event');

            fetchEvents(); // Refresh events list
        } catch (err) {
            setError('Failed to delete event: ' + err.message);
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setOpen(true)}>
                    <Plus className="mr-2"/>Create
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-700">
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your event and click "Create".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {error && (
                        <div className="col-span-4 text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="Enter event title"
                            className="col-span-3"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Enter event description"
                            className="col-span-3"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startDate" className="text-right">
                            Start Date
                        </Label>
                        <Input
                            id="startDate"
                            type="datetime-local"
                            className="col-span-3"
                            value={start}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endDate" className="text-right">
                            End Date
                        </Label>
                        <Input
                            id="endDate"
                            type="datetime-local"
                            className="col-span-3"
                            value={end}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                    {/* Color Picker */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                            <Bookmark className="h-4 w-4" />
                        </Label>
                        <div className="col-span-3 flex flex-wrap gap-2">
                            {colorOptions.map((color) => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? "border-gray-800 dark:border-gray-200" : "border-transparent"}`}
                                    style={{backgroundColor: color}}
                                    onClick={() => setSelectedColor(color)}
                                    type="button"
                                    aria-label={`Select color ${color}`}
                                >
                                    {(selectedColor === color) && (
                                        <CheckIcon className="text-white w-4 h-4"/>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleCreateEvent}
                        disabled={loading || !title || !start || !end}
                    >
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateEventDialog;