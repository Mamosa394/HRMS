import React, { useState, useEffect } from 'react';
import '../styles/develop.css';

// Custom Modal Component for Update
const UpdateVehicleModal = ({ vehicle, onClose, onUpdate }) => {
  const [mileage, setMileage] = useState(vehicle.mileage);
  const [driver, setDriver] = useState(vehicle.driver);
  const [status, setStatus] = useState(vehicle.status);

  const handleSubmit = () => {
    if (!mileage || !driver || !status) {
      alert("Please fill all fields before updating.");
      return;
    }
    onUpdate(vehicle.vin, { mileage, driver, status });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2>Update Vehicle</h2>
      <input
        type="number"
        value={mileage}
        onChange={(e) => setMileage(e.target.value)}
        placeholder="Mileage"
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />
      <input
        type="text"
        value={driver}
        onChange={(e) => setDriver(e.target.value)}
        placeholder="Driver Name"
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginBottom: '10px', padding: '5px', width: '100%' }}>
        <option value="available">Available</option>
        <option value="in use">In Use</option>
        <option value="on a service">On a Service</option>
        <option value="sold on auction">Sold on Auction</option>
      </select>
      <div>
        <button onClick={handleSubmit} style={{ marginRight: '10px' }}>Update</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const Procurement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newVehicle, setNewVehicle] = useState({
    vin: "",
    model: "",
    mileage: "",
    driver: "",
    status: "available", // Default status
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [vehicleToUpdate, setVehicleToUpdate] = useState(null);

  // Fetch vehicles from the backend
  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles');  // Ensure this is the correct backend URL
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Handle form changes for adding a new vehicle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new vehicle to the backend
  const addVehicle = async () => {
    if (!newVehicle.vin || !newVehicle.model || !newVehicle.mileage || !newVehicle.driver) {
      alert("Please fill all fields before adding a vehicle.");
      return;
    }

    // Check for duplicate VIN
    const isDuplicate = vehicles.some(vehicle => vehicle.vin === newVehicle.vin);
    if (isDuplicate) {
      alert("Vehicle with this VIN already exists.");
      return;
    }

    // Validate mileage as a number
    if (isNaN(newVehicle.mileage)) {
      alert("Mileage must be a number.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVehicle),
      });

      if (response.ok) {
        // Successfully added the vehicle, fetch the updated list
        setNewVehicle({ vin: "", model: "", mileage: "", driver: "", status: "available" }); // Reset form
        fetchVehicles(); // Refresh vehicle list
      } else {
        alert("Error adding vehicle.");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  // Update vehicle details in the backend
  const updateVehicle = async (vin, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/vehicles/${vin}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        // Successfully updated, fetch updated list
        fetchVehicles();
        setIsUpdateModalOpen(false);  // Close modal
      } else {
        alert("Error updating vehicle.");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  // Delete a vehicle from the backend
  const deleteVehicle = async (vin) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/vehicles/${vin}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchVehicles(); // Fetch updated list of vehicles
        } else {
          alert("Error deleting vehicle.");
        }
      } catch (error) {
        console.error("Error deleting vehicle:", error);
      }
    }
  };

  // Search for vehicles by VIN or model
  const searchVehicles = () => {
    return vehicles.filter(
      (vehicle) =>
        vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // List of vehicles filtered by search term
  const filteredVehicles = searchVehicles();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vehicle Tracking Form</h1>

      {/* Add New Vehicle Form */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Add New Vehicle</h2>
        <input
          type="text"
          name="vin"
          placeholder="VIN"
          value={newVehicle.vin}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={newVehicle.model}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          name="mileage"
          placeholder="Mileage"
          value={newVehicle.mileage}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          name="driver"
          placeholder="Driver Name"
          value={newVehicle.driver}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        />
        <select
          name="status"
          value={newVehicle.status}
          onChange={handleInputChange}
          style={{ marginRight: "10px" }}
        >
          <option value="available">Available</option>
          <option value="in use">In Use</option>
          <option value="on a service">On a Service</option>
          <option value="sold on auction">Sold on Auction</option>
        </select>
        <button onClick={addVehicle}>Add Vehicle</button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Search Vehicles</h2>
        <input
          type="text"
          placeholder="Search by VIN or Model"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px" }}
        />
      </div>

      {/* Vehicle List */}
      <h2>Vehicle List</h2>
      {filteredVehicles.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>VIN</th>
              <th>Model</th>
              <th>Mileage</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.vin}>
                <td>{vehicle.vin}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.mileage}</td>
                <td>{vehicle.driver}</td>
                <td>{vehicle.status}</td>
                <td>{new Date(vehicle.lastUpdated).toLocaleString()}</td>
                <td>
                  {/* Update Button */}
                  <button onClick={() => { setVehicleToUpdate(vehicle); setIsUpdateModalOpen(true); }} style={{ marginRight: "10px", backgroundColor: "green" }}>Update</button>
                  {/* Delete Button */}
                  <button onClick={() => deleteVehicle(vehicle.vin)} style={{backgroundColor: "red"}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No vehicles found.</p>
      )}

      {/* Update Vehicle Modal */}
      {isUpdateModalOpen && vehicleToUpdate && (
        <UpdateVehicleModal
          vehicle={vehicleToUpdate}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdate={updateVehicle}
        />
      )}
    </div>
  );
};

export default Procurement;
