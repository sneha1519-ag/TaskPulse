import { google } from 'googleapis';

export async function getGoogleCalendarService(accessToken) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
        access_token: accessToken
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function listEvents(accessToken, timeMin, timeMax) {
    const calendar = await getGoogleCalendarService(accessToken);

    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: 'startTime',
        });

        return response.data.items;
    } catch (error) {
        console.error('Error listing events:', error);
        throw error;
    }
}

export async function createEvent(accessToken, event) {
    const calendar = await getGoogleCalendarService(accessToken);

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        return response.data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
}

export async function updateEvent(accessToken, eventId, event) {
    const calendar = await getGoogleCalendarService(accessToken);

    try {
        const response = await calendar.events.update({
            calendarId: 'primary',
            eventId,
            requestBody: event,
        });

        return response.data;
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
}

export async function deleteEvent(accessToken, eventId) {
    const calendar = await getGoogleCalendarService(accessToken);

    try {
        await calendar.events.delete({
            calendarId: 'primary',
            eventId,
        });

        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
}