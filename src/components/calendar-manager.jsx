"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function CalendarManager() {
    const { data: session, status } = useSession();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        summary: '',
        description: '',
        location: '',
        startDateTime: '',
        endDateTime: '',
    });

    useEffect(() => {
        if (session && session.accessToken) {
            fetchEvents();
        }
    }, [session]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/calendar?timeMin=' + new Date().toISOString());
            const data = await response.json();
            setEvents(data.events || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch events');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const resetForm = () => {
        setFormData({
            summary: '',
            description: '',
            location: '',
            startDateTime: '',
            endDateTime: '',
        });
        setCurrentEvent(null);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        try {
            const eventData = {
                summary: formData.summary,
                description: formData.description,
                location: formData.location,
                start: {
                    dateTime: new Date(formData.startDateTime).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: new Date(formData.endDateTime).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }
            };

            const response = await fetch('/api/calendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) throw new Error('Failed to create event');

            setIsCreating(false);
            resetForm();
            fetchEvents(); // Refresh events list
        } catch (err) {
            setError('Failed to create event: ' + err.message);
            console.error(err);
        }
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();

        try {
            const eventData = {
                summary: formData.summary,
                description: formData.description,
                location: formData.location,
                start: {
                    dateTime: new Date(formData.startDateTime).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                end: {
                    dateTime: new Date(formData.endDateTime).toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
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

    const openUpdateForm = (event) => {
        setCurrentEvent(event);
        setFormData({
            summary: event.summary || '',
            description: event.description || '',
            location: event.location || '',
            startDateTime: formatDateTimeForInput(event.start.dateTime || event.start.date),
            endDateTime: formatDateTimeForInput(event.end.dateTime || event.end.date)
        });
        setIsUpdating(true);
        setIsCreating(false);
    };

    const openCreateForm = () => {
        resetForm();
        setIsCreating(true);
        setIsUpdating(false);

        // Set default start and end times (current time + 1 hour)
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

        setFormData({
            ...formData,
            startDateTime: formatDateTimeForInput(now.toISOString()),
            endDateTime: formatDateTimeForInput(oneHourLater.toISOString())
        });
    };

    // Helper function to format ISO date string for datetime-local input
    const formatDateTimeForInput = (isoString) => {
        const date = new Date(isoString);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    };

    // Format date for display
    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleString();
    };

    if (status === 'loading') return <div>Loading session...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Your Calendar Events</h1>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            <div className="flex justify-between mb-4">
                <button onClick={openCreateForm} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">Create New Event</button>
                <button onClick={fetchEvents} className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600">Refresh Events</button>
            </div>

            {/* Create Event Form */}
            {(isCreating || isUpdating) && (
                <div className="p-4 rounded-md shadow-md mb-4">
                    <h2 className="text-xl font-semibold mb-2">{isCreating ? "Create New Event" : "Update Event"}</h2>
                    <form onSubmit={isCreating ? handleCreateEvent : handleUpdateEvent} className="space-y-3">
                        <div>
                            <label className="block font-medium">Event Title:</label>
                            <input type="text" name="summary" value={formData.summary} onChange={handleInputChange} required className="w-full border rounded p-2" />
                        </div>

                        <div>
                            <label className="block font-medium">Location:</label>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full border rounded p-2" />
                        </div>

                        <div>
                            <label className="block font-medium">Description:</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full border rounded p-2"></textarea>
                        </div>

                        <div>
                            <label className="block font-medium">Start Date & Time:</label>
                            <input type="datetime-local" name="startDateTime" value={formData.startDateTime} onChange={handleInputChange} required className="w-full border rounded p-2" />
                        </div>

                        <div>
                            <label className="block font-medium">End Date & Time:</label>
                            <input type="datetime-local" name="endDateTime" value={formData.endDateTime} onChange={handleInputChange} required className="w-full border rounded p-2" />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">{isCreating ? "Create" : "Update"} Event</button>
                            <button type="button" onClick={() => (isCreating ? setIsCreating(false) : setIsUpdating(false))} className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Events List */}
            {loading ? (
                <div className="text-center text-gray-600">Loading events...</div>
            ) : (
                <div className="space-y-4">
                    {events.length === 0 ? (
                        <p className="text-center text-gray-500">No upcoming events found.</p>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="p-4 rounded-md shadow-md">
                                <h3 className="text-lg font-semibold">{event.summary || "Untitled Event"}</h3>

                                <div className="text-sm text-gray-400">
                                    <p><strong>When:</strong> {formatDate(event.start.dateTime || event.start.date)} to {formatDate(event.end.dateTime || event.end.date)}</p>
                                    {event.location && <p><strong>Where:</strong> {event.location}</p>}
                                    {event.description && <p><strong>Description:</strong> {event.description}</p>}
                                </div>

                                <div className="flex justify-end space-x-2 mt-2">
                                    <button onClick={() => openUpdateForm(event)} className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600">Edit</button>
                                    <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}