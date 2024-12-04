import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Connect to MongoDB Atlas (directly with your connection string)
mongoose.connect('mongodb+srv://mamosamotsie:MAMOSAMOTSIE@hr-management.tzqo2.mongodb.net/?retryWrites=true&w=majority&appName=HR-management', {})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define employee schema
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
  qualificationsHistory: [{
    qualificationName: { type: String, required: true },
    qualificationType: { type: String, required: true },
    points: { type: Number, required: true }
  }],
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
    default: 0,  // Initialize points to 0
  }
}, { timestamps: true });

const Employee = mongoose.model('Employee', EmployeeSchema);

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON data

// Get all employees or search by fullName
app.get('/api/employees', async (req, res) => {
  try {
    const { search } = req.query;  // Using search query parameter
    let employees;

    if (search) {
      // If search is provided, filter by fullName
      employees = await Employee.find({ fullName: { $regex: search, $options: 'i' } });
    } else {
      employees = await Employee.find();  // Get all employees if no search query
    }

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Add new employee (POST)
app.post('/api/employees', async (req, res) => {
  const { staffNumber, fullName, identityNumber, qualifications, position, salary } = req.body;

  const newEmployee = new Employee({
    staffNumber,
    fullName,
    identityNumber,
    qualifications,
    position,
    salary,
  });

  try {
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

// Update employee details (PUT)
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { staffNumber, fullName, identityNumber, qualifications, position, salary } = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, {
      staffNumber,
      fullName,
      identityNumber,
      qualifications,
      position,
      salary,
    }, { new: true }); // Return the updated employee

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee (DELETE)
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Add qualification to employee (PUT)
app.put('/api/employees/:id/add-qualification', async (req, res) => {
  const { id } = req.params;
  const { qualificationName, qualificationType } = req.body;

  // Determine points based on qualification type
  let points = 0;

  if (qualificationType === 'academic') {
    points = 5; // Academic qualifications get 5 points
  } 
  else if (qualificationType === 'professional') {
    points = 7; // Professional qualifications get 7 points
  }

  if (!qualificationType || !qualificationName) {
    return res.status(400).json({ error: 'Qualification type and name are required' });
  }

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Add the new qualification to the qualifications history
    employee.qualificationsHistory.push({
      qualificationName,
      qualificationType,
      points,
    });

    // Update the employee's total points
    employee.points += points;

    // Save the updated employee
    await employee.save();

    res.status(200).json(employee);
  } catch (error) {
    console.error('Error adding qualification:', error);
    res.status(500).json({ error: 'Error adding qualification' });
  }
});

// Define Vehicle Schema
const VehicleSchema = new mongoose.Schema({
  vin: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  mileage: { type: Number, required: true },
  driver: { type: String, required: true },
  status: { type: String, default: 'available' },
  lastUpdated: { type: Date, default: Date.now },
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

// Get all vehicles or search by VIN or model
app.get('/api/vehicles', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { vin: { $regex: search, $options: 'i' } },
          { model: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const vehicles = await Vehicle.find(query);
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Add a new vehicle
app.post('/api/vehicles', async (req, res) => {
  const { vin, model, mileage, driver, status } = req.body;

  if (!vin || !model || !mileage || !driver) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const newVehicle = new Vehicle({ vin, model, mileage, driver, status });
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// Update vehicle details
app.put('/api/vehicles/:vin', async (req, res) => {
  const { vin } = req.params;
  const { model, mileage, driver, status } = req.body;

  try {
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { vin },
      { model, mileage, driver, status, lastUpdated: new Date() },
      { new: true }
    );
    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// Delete a vehicle
app.delete('/api/vehicles/:vin', async (req, res) => {
  const { vin } = req.params;

  try {
    const deletedVehicle = await Vehicle.findOneAndDelete({ vin });
    if (!deletedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
