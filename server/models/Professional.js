const mongoose = require('mongoose');

// Qualification schema for each qualification added to an employee's profile
const qualificationSchema = new mongoose.Schema({
    qualificationName: {
        type: String,
        required: true,
    },
    qualificationType: {
        type: String,
        enum: ['academic', 'professional'],  // Only 'academic' or 'professional' are allowed
        required: true,
    },
    points: {
        type: Number,
        required: true,
        default: 0,
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

// Employee schema to store employee details
const employeeSchema = new mongoose.Schema({
    staffNumber: {
        type: String,
        required: true,
        unique: true,  // Ensure staff number is unique
    },
    fullName: {
        type: String,
        required: true,
    },
    identityNumber: {
        type: String,
        required: true,
        unique: true,  // Ensure identity number is unique
    },
    position: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    points: {
        type: Number,
        default: 0, // Start with 0 points
    },
    qualificationsHistory: [qualificationSchema], // Array of qualifications
});

// Calculate total points based on qualifications
employeeSchema.methods.calculatePoints = function() {
    let totalPoints = 0;
    this.qualificationsHistory.forEach(qualification => {
        totalPoints += qualification.points;
    });
    this.points = totalPoints;
    return this.points;
};

// Create the model for employees
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
