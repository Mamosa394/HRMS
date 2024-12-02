// models/Employee.js
import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    staffNumber: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    identityNumber: {
        type: String,
        required: true,
    },
    qualifications: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
