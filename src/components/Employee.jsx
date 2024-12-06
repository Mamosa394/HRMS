import React, { useState, useEffect } from 'react';
import '../styles/professional.css';

const EmployeeManagement = () => {
    // State to store employee form data
    const [formData, setFormData] = useState({
        staffNumber: '',
        fullName: '',
        identityNumber: '',
        qualifications: '',
        position: '',
        salary: '',
    });

    // State to store the list of employees
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [editFormData, setEditFormData] = useState({
        staffNumber: '',
        fullName: '',
        identityNumber: '',
        qualifications: '',
        position: '',
        salary: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch all employees on page load
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/employees');
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission for adding new employee
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newEmployee = { ...formData };

        try {
            const response = await fetch('http://localhost:5000/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployee),
            });
            if (response.ok) {
                alert('Employee added successfully!');
                const data = await response.json();
                setEmployees([...employees, data]); // Add new employee to the list
                setFormData({
                    staffNumber: '',
                    fullName: '',
                    identityNumber: '',
                    qualifications: '',
                    position: '',
                    salary: '',
                }); // Reset the form
            } else {
                alert('Failed to add employee');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Error adding employee');
        }
    };

    // Handle search functionality (case-sensitive)
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Check if there's any result for the search query
        const filtered = employees.filter((employee) =>
            employee.fullName.includes(query) // Case-sensitive search
        );

        if (filtered.length === 0) {
            setErrorMessage('No employees found with that name');
        } else {
            setErrorMessage('');
        }
    };

    const filteredEmployees = employees.filter((employee) =>
        employee.fullName.includes(searchQuery) // Case-sensitive search
    );

    // Handle the editing state
    const handleEdit = (employee) => {
        setEditingEmployee(employee._id);
        setEditFormData({
            staffNumber: employee.staffNumber,
            fullName: employee.fullName,
            identityNumber: employee.identityNumber,
            qualifications: employee.qualifications,
            position: employee.position,
            salary: employee.salary,
        });
    };

    // Handle updating employee details
    const handleUpdate = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });
            if (response.ok) {
                const updatedEmployee = await response.json();
                setEmployees(employees.map(emp => emp._id === id ? updatedEmployee : emp));
                setEditingEmployee(null);
                alert('Employee updated successfully!');
            } else {
                alert('Failed to update employee');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Error updating employee');
        }
    };

    // Handle deleting an employee
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setEmployees(employees.filter(emp => emp._id !== id));
                alert('Employee deleted successfully!');
            } else {
                alert('Failed to delete employee');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Error deleting employee');
        }
    };

    return (
        <div className="container">
            <h1>Staff Information</h1>

            {/* Search */}
            <input
                type="text"
                placeholder="Search employees by name..."
                value={searchQuery}
                onChange={handleSearch}
                style={{ border: "1px solid orange", padding: "5px", marginBottom: "10px" }}
            />

            {/* Display error message if no employees found */}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

            <h2>Add New Employee</h2>
            <form id="employeeForm" onSubmit={handleSubmit}>
                <label htmlFor="staffNumber">Staff Number</label>
                <input
                    type="text"
                    id="staffNumber"
                    name="staffNumber"
                    value={formData.staffNumber}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label htmlFor="fullName">Full Name</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label htmlFor="identityNumber">Identity Number</label>
                <input
                    type="text"
                    id="identityNumber"
                    name="identityNumber"
                    value={formData.identityNumber}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label htmlFor="qualifications">Qualifications</label>
                <input
                    type="text"
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label htmlFor="position">Position</label>
                <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                /><br /><br />

                <label htmlFor="salary">Salary</label>
                <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                /><br /><br />

                <button type="submit">Add Employee</button>
            </form>

            <h2>Employee List</h2>
            <ul id="employeeList">
                {filteredEmployees.map((employee) => (
                    <li key={employee._id}>
                        {employee._id === editingEmployee ? (
                            <>
                                <input
                                    type="text"
                                    value={editFormData.staffNumber}
                                    onChange={(e) => setEditFormData({ ...editFormData, staffNumber: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editFormData.fullName}
                                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editFormData.identityNumber}
                                    onChange={(e) => setEditFormData({ ...editFormData, identityNumber: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editFormData.qualifications}
                                    onChange={(e) => setEditFormData({ ...editFormData, qualifications: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editFormData.position}
                                    onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                                />
                                <input
                                    type="number"
                                    value={editFormData.salary}
                                    onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                                />
                                <button
                                    onClick={() => handleUpdate(employee._id)}
                                    style={{ backgroundColor: "green", color: "white" }}
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                {employee.fullName} - {employee.position} - M {employee.salary}
                                <button
                                    onClick={() => handleEdit(employee)}
                                    style={{ backgroundColor: "green", color: "white", marginLeft: "5px" }}
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(employee._id)}
                                    style={{ backgroundColor: "red", color: "white", marginLeft: "5px" }}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeManagement;
