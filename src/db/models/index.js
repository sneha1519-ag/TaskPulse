const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    profileImage: {
        type: String
    }
}, { timestamps: true });

// Task Schema
const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    aiPriority: {
        type: Number,
        min: 1,
        max: 10
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    dueDate: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    attachments: [{
        type: String
    }],
}, { timestamps: true });

// Event Schema
const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrencePattern: {
        type: String
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    meetingLink: {
        type: String
    },
    reminderSet: {
        type: Boolean,
        default: false
    },
    reminderTime: {
        type: Date
    }
}, { timestamps: true });

// Invitation Schema
const invitationSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'expired'],
        default: 'pending'
    }
}, { timestamps: true });

// Analytics Schema
const analyticsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tasksCompleted: {
        type: Number,
        default: 0
    },
    tasksInProgress: {
        type: Number,
        default: 0
    },
    tasksPending: {
        type: Number,
        default: 0
    },
    meetingsAttended: {
        type: Number,
        default: 0
    },
    meetingsMissed: {
        type: Number,
        default: 0
    },
    averageTaskCompletionTime: {
        type: Number
    },
    productivityScore: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to hash passwords
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export models
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
const Event = mongoose.model('Event', eventSchema);
const Invitation = mongoose.model('Invitation', invitationSchema);
const Analytics = mongoose.model('Analytics', analyticsSchema);

export {
    User,
    Task,
    Event,
    Invitation,
    Analytics
};