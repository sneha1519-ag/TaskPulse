// File: taskPrioritization.js
"use client";

/**
 * Determines the priority of a task based on its description and deadline
 *
 * @param {string} taskDescription - The content/description of the task
 * @param {string} deadline - The deadline date of the task in YYYY-MM-DD format
 * @returns {string} - "High", "Medium", or "Low" priority
 */
export function autoPrioritizeTask(taskDescription, deadline) {
    // The function now returns a Promise to maintain compatibility with the existing code
    return new Promise((resolve) => {
        const priority = determinePriority(taskDescription, deadline);
        // Simulate a small delay to show the loading state
        setTimeout(() => {
            resolve(priority);
        }, 500);
    });
}

/**
 * Batch prioritizes multiple tasks
 *
 * @param {Array} tasks - Array of task objects, each containing id, content, and deadline
 * @returns {Promise<Array>} - Array of objects with id and priority
 */
export function batchPrioritizeTasks(tasks) {
    return new Promise((resolve) => {
        const results = tasks.map(task => ({
            id: task.id,
            priority: determinePriority(task.content, task.deadline)
        }));

        // Simulate a small delay to show the loading state
        setTimeout(() => {
            resolve(results);
        }, 800);
    });
}

/**
 * Determines task priority based on deadline and keywords
 *
 * @param {string} taskDescription - Task description text
 * @param {string} deadline - Deadline date string
 * @returns {string} - Priority level: "High", "Medium", or "Low"
 */
function determinePriority(taskDescription, deadline) {
    // Convert task description to lowercase for case-insensitive matching
    const description = taskDescription.toLowerCase();

    // First priority: Tasks with the nearest deadline
    if (deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

        if (daysUntilDeadline <= 2) {
            return "High";
        } else if (daysUntilDeadline <= 7) {
            return "Medium";
        }
        // Deadlines more than 7 days away will be handled by the next checks
    }

    // Second priority: Tasks without a deadline but containing keywords like 'urgent' or 'important'
    if (description.includes('urgent') || description.includes('important')) {
        return "High";
    }

    // Third priority: Tasks labeled with 'soon'
    if (description.includes('soon')) {
        return "Medium";
    }

    // Lowest priority: Tasks labeled with 'whenever'
    if (description.includes('whenever')) {
        return "Low";
    }

    // Default priority for tasks with deadlines more than 7 days away or without matching criteria
    return deadline ? "Low" : "Medium";
}