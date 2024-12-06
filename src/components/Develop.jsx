import React, { useState, useEffect } from 'react';
import '../styles/develop.css';

const EmployeeManagement = () => {
  const [formData, setFormData] = useState({
    staffNumber: '',
    fullName: '',
    identityNumber: '',
    position: '',
    salary: ''
  });

  const [qualificationData, setQualificationData] = useState({
    qualificationName: '',
    qualificationType: '',
    points: ''
  });

  const [employees, setEmployees] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch employees when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setErrorMessage('Error fetching employee data.');
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQualificationChange = (e) => {
    setQualificationData({
      ...qualificationData,
      [e.target.name]: e.target.value
    });
  };

  // Handle new employee submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmployee = { ...formData, qualificationsHistory: [], points: 0 }; // Set initial points to 0

    try {
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });

      if (response.ok) {
        const employee = await response.json();
        setEmployees([...employees, employee]);
        setFormData({
          staffNumber: '',
          fullName: '',
          identityNumber: '',
          position: '',
          salary: ''
        });
        alert('Employee added successfully!');
      } else {
        alert('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  // Handle adding qualifications for a specific employee
  const handleAddQualification = async (e, employeeId) => {
    e.preventDefault();
    const { qualificationName, qualificationType } = qualificationData;

    // Determine points to add based on the qualification type
    let pointsToAdd = 0;
      if (qualificationType === 'academic') {
      pointsToAdd = 5; // +5 for academic qualifications
    } else if (qualificationType === 'professional') {
      pointsToAdd = 7; // +7 for professional qualifications
    }

    // Update employee points
    const employeeToUpdate = employees.find((emp) => emp._id === employeeId);
    const updatedEmployeePoints = employeeToUpdate.points + pointsToAdd;

    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${employeeId}/add-qualification`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qualificationName,
            qualificationType,
            points: pointsToAdd,
            updatedPoints: updatedEmployeePoints,  // Update total points
          })
        }
      );

      if (response.ok) {
        const updatedEmployee = await response.json();
        // Update the specific employee in the state by matching employeeId
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp._id === employeeId ? updatedEmployee : emp
          )
        );
        setQualificationData({
          qualificationName: '',
          qualificationType: '',
          points: ''
        });
        alert('Qualification added successfully!');
      } else {
        alert('Failed to add qualification');
      }
    } catch (error) {
      console.error('Error adding qualification:', error);
      alert('Error adding qualification');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Employee Management</h2>

      {/* Error Message */}
      {errorMessage && <div style={{ color: 'red', marginBottom: '20px' }}>{errorMessage}</div>}

      {/* Add New Employee Form */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Add New Employee</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Staff Number:</label>
            <input
              type="text"
              name="staffNumber"
              value={formData.staffNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Identity Number:</label>
            <input
              type="text"
              name="identityNumber"
              value={formData.identityNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Position:</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Salary:</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button type="submit">Add Employee</button>
          </div>
        </form>
      </div>

      {/* Employee List */}
      <h3>Employee List</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Points</th>
            <th>Qualifications</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.fullName}</td>
              <td>{employee.position}</td>
              <td>{employee.salary}</td>
              <td>{employee.points}</td>
              <td>
                {employee.qualificationsHistory && employee.qualificationsHistory.length > 0
                  ? employee.qualificationsHistory.map((qualification, index) => (
                      <div key={index}>
                        {qualification.qualificationName} ({qualification.qualificationType}) - {qualification.points} points
                      </div>
                    ))
                  : 'No qualifications yet'}
              </td>
              <td>
                {/* Qualification form for this specific employee */}
                <form onSubmit={(e) => handleAddQualification(e, employee._id)}>
                  <div>
                    <label>Qualification:</label>
                    <input
                      type="text"
                      name="qualificationName"
                      value={qualificationData.qualificationName}
                      onChange={handleQualificationChange}
                      required
                    />
                  </div>
                  <div>
                    <label>Qualification Type:</label>
                    <select
                      name="qualificationType"
                      value={qualificationData.qualificationType}
                      onChange={handleQualificationChange}
                    >
                      <option value="academic">Academic</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>
                  <div>
                    <button type="submit">Add Qualification</button>
                  </div>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
