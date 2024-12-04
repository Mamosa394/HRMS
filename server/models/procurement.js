import React, { useState } from "react";

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

  // Handle form changes for adding a new vehicle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new vehicle
  const addVehicle = () => {
    if (!newVehicle.vin || !newVehicle.model || !newVehicle.mileage || !newVehicle.driver) {
      alert("Please fill all fields before adding a vehicle.");
      return;
    }

    setVehicles((prev) => [
      ...prev,
      { ...newVehicle, lastUpdated: new Date().toISOString() },
    ]);

    setNewVehicle({
      vin: "",
      model: "",
      mileage: "",
      driver: "",
      status: "available", // Reset form
    });
  };

  // Update vehicle mileage, driver, and status
  const updateVehicle = (vin, updatedData) => {
    setVehicles((prev) =>
      prev.map((vehicle) =>
        vehicle.vin === vin ? { ...vehicle, ...updatedData, lastUpdated: new Date().toISOString() } : vehicle
      )
    );
  };

  // Delete a vehicle
  const deleteVehicle = (vin) => {
    setVehicles((prev) => prev.filter((vehicle) => vehicle.vin !== vin));
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
      <h1>Vehicle Procurement System</h1>

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
                  <button
                    onClick={() => {
                      const newMileage = prompt("Enter new mileage:", vehicle.mileage);
                      const newDriver = prompt("Enter new driver name:", vehicle.driver);
                      const newStatus = prompt(
                        "Enter new status (available, in use, on a service, sold on auction):",
                        vehicle.status
                      );
                      if (newMileage && newDriver && newStatus) {
                        updateVehicle(vehicle.vin, {
                          mileage: newMileage,
                          driver: newDriver,
                          status: newStatus,
                        });
                      }
                    }}
                    style={{ marginRight: "10px" }}
                  >
                    Update
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this vehicle?")) {
                        deleteVehicle(vehicle.vin);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No vehicles found.</p>
      )}
    </div>
  );
};

export default Procurement;
