import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const UpdateDeleteEvent = ({
                               event,
                               isOpen,
                               onOpenChange
                           }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedEvent, setEditedEvent] = useState(null);

    useEffect(() => {
        if (event) {
            setEditedEvent({...event});
            setIsEditing(false);
        }
    }, [event]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            // Prepare event data for Google Calendar API
            const eventData = {
                summary: editedEvent.title,
                description: editedEvent.description,
                start: {
                    dateTime: new Date(editedEvent.start.dateTime).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: new Date(editedEvent.end.dateTime).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            };

            // API call to update event
            const response = await fetch('/api/calendar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id,
                    eventData
                })
            });

            if (!response.ok) throw new Error('Failed to update event');

            // Trigger event to refresh calendar
            window.dispatchEvent(new CustomEvent('calendar-event-updated', {
                detail: { event: editedEvent }
            }));

            // Close editing and dialog
            setIsEditing(false);
            onOpenChange(false);
        } catch (error) {
            console.error('Error updating event:', error);
            // Optionally show error to user
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            // API call to delete event
            const response = await fetch('/api/calendar', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: event.id })
            });

            if (!response.ok) throw new Error('Failed to delete event');

            // Trigger event to refresh calendar
            window.dispatchEvent(new CustomEvent('calendar-event-deleted', {
                detail: { eventId: event.id }
            }));

            // Close dialog
            onOpenChange(false);
        } catch (error) {
            console.error('Error deleting event:', error);
            // Optionally show error to user
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedEvent({...event});
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return {
            date: date.toISOString().split('T')[0],
            time: date.toTimeString().slice(0,5)
        };
    };

    const formattedDateTime = formatDateTime(event?.start?.dateTime);

    if (!event) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] border-zinc-500">
                <DialogHeader>
                    <div className="flex justify-between items-center">
                        <DialogTitle>{isEditing ? 'Edit Event' : 'Event Details'}</DialogTitle>
                        <div className="flex space-x-2">
                            {!isEditing ? (
                                <>
                                    <Button variant="outline" size="icon" onClick={handleEdit} className="mt-4">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={handleDelete} className="mt-4">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : null}
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title</Label>
                        {isEditing ? (
                            <Input
                                id="title"
                                className="col-span-3"
                                value={editedEvent.title || ''}
                                onChange={(e) => setEditedEvent({
                                    ...editedEvent,
                                    title: e.target.value
                                })}
                            />
                        ) : (
                            <span className="col-span-3">{event.title}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Date</Label>
                        {isEditing ? (
                            <Input
                                id="date"
                                type="date"
                                className="col-span-3"
                                value={formattedDateTime.date}
                                onChange={(e) => setEditedEvent({
                                    ...editedEvent,
                                    start: {
                                        ...editedEvent.start,
                                        dateTime: new Date(e.target.value).toISOString()
                                    }
                                })}
                            />
                        ) : (
                            <span className="col-span-3">{formattedDateTime.date}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startTime" className="text-right">Start Time</Label>
                        {isEditing ? (
                            <Input
                                id="startTime"
                                type="time"
                                className="col-span-3"
                                value={formattedDateTime.time}
                                onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(':');
                                    const newDateTime = new Date(editedEvent.start.dateTime);
                                    newDateTime.setHours(hours, minutes);
                                    setEditedEvent({
                                        ...editedEvent,
                                        start: {
                                            ...editedEvent.start,
                                            dateTime: newDateTime.toISOString()
                                        }
                                    });
                                }}
                            />
                        ) : (
                            <span className="col-span-3">{formattedDateTime.time}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        {isEditing ? (
                            <Textarea
                                id="description"
                                className="col-span-3"
                                value={editedEvent.description || ''}
                                onChange={(e) => setEditedEvent({
                                    ...editedEvent,
                                    description: e.target.value
                                })}
                            />
                        ) : (
                            <span className="col-span-3">{event.description || 'No description'}</span>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UpdateDeleteEvent;