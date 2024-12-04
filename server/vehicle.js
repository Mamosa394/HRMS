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

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON data

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
