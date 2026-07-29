import React, {useEffect, useState } from 'react';
import Form from '../components/Form';
import EmployeeCard from '../components/EmployeeCard';
import Button from "../components/Button";

function EmployeeHiringForm() {
    const [employees, setEmployees] = useState([]);

    const today = new Date().toISOString().split("T")[0];
    const [formData, setFormData] = useState({
        FIRST_NAME: "",
        LAST_NAME: "",
        EMAIL: "",
        PHONE_NUMBER: "",
        HIRE_DATE: today,
        SALARY: "",
        JOB_ID: "",
        MANAGER_ID: "",
        DEPARTMENT_ID: ""
    });

    const [departments, setDepartments] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);
    const [managers, setManagers] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const loadDropdowns = async () => {
            try {
                const [departmentResponse, jobResponse, managerResponse, employeeResponse] =
                    await Promise.all([
                        fetch("http://localhost:8080/api/departments"),
                        fetch("http://localhost:8080/api/jobs"),
                        fetch("http://localhost:8080/api/managers"),
                        fetch("http://localhost:8080/api/employees")
                    ]);

                const departmentData = await departmentResponse.json();
                const jobData = await jobResponse.json();
                const managerData = await managerResponse.json();
                const employeeData = await employeeResponse.json();

                setDepartments(departmentData.data.map(dept => ({
                                DEPARTMENT_ID: dept.DEPARTMENT_ID,
                                DEPARTMENT_NAME: dept.DEPARTMENT_NAME})));
                setJobTitles(jobData.data.map(job => ({
                                JOB_ID: job.JOB_ID,
                                JOB_TITLE: job.JOB_TITLE
                            })));
                setManagers(managerData.data.map(manager => ({
                    EMPLOYEE_ID: manager.EMPLOYEE_ID,
                    FIRST_NAME: manager.FIRST_NAME,
                    LAST_NAME: manager.LAST_NAME,
                    DEPARTMENT_NAME: manager.DEPARTMENT_NAME,
                    JOB_TITLE: manager.JOB_TITLE
                })));
                setEmployees(employeeData.data);

            } catch (error) {
                console.error("Dropdown loading error:", error);
            }
        };

        loadDropdowns();
    }, []);

    const formatPhone = (value) => {
        const digits = value.replace(/\D/g, "").slice(0, 10);

        if (digits.length <= 3) {
            return digits;
        } else if (digits.length <= 6) {
            return `${digits.slice(0, 3)}.${digits.slice(3)}`;
        } else {
            return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "PHONE_NUMBER" ? formatPhone(value) : value
        });
    };
    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setEditingEmployee({
            ...editingEmployee,
            [name]: name === "PHONE_NUMBER" ? formatPhone(value): value
        });
    };

    const handleEdit = (employee) => {
        setEditingEmployee({
            EMPLOYEE_ID: employee.EMPLOYEE_ID,
            FIRST_NAME: employee.FIRST_NAME,
            LAST_NAME: employee.LAST_NAME,
            EMAIL: employee.EMAIL,
            PHONE_NUMBER: employee.PHONE_NUMBER,
            HIRE_DATE: employee.HIRE_DATE ? new Date(employee.HIRE_DATE).toISOString().split("T")[0]: "",
            SALARY: employee.SALARY,
            JOB_ID: employee.jobTitle?.id || "",
            MANAGER_ID: employee.MANAGER_ID || "",
            DEPARTMENT_ID: employee.department?.id || ""

        });
        setShowEditModal(true);
    };

    const resetForm = ()=>{
        setEditingEmployee(null);
        setShowEditModal(false);

        setFormData({
            FIRST_NAME:"",
            LAST_NAME:"",
            EMAIL:"",
            PHONE_NUMBER:"",
            HIRE_DATE:today,
            SALARY:"",
            JOB_ID:"",
            MANAGER_ID:"",
            DEPARTMENT_ID:""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingEmployee ? `http://localhost:8080/api/employees/${editingEmployee.EMPLOYEE_ID}` : "http://localhost:8080/api/employees";

            const method = editingEmployee ? "PATCH": "POST";

            const data = editingEmployee ? editingEmployee : formData;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (response.ok) {

                const savedEmployee = responseData;

                 if(editingEmployee) {
                    setEmployees(prev =>
                        prev.map(emp =>
                            emp.EMPLOYEE_ID === savedEmployee.data.EMPLOYEE_ID
                            ? savedEmployee.data
                            : emp
                        )

                    );
                    alert(
                        "Employee updated successfully!"
                    );
                } else {
                    setEmployees(prev => [
                        savedEmployee.data,
                        ...prev,
                    ]);
                    alert("Employee hired successfully!");
                }
                resetForm();
            } else {
                console.error("Backend error:", responseData);
                alert(responseData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error, make sure backend is running.');
        }
    };

    return (
        <div className="employee-page">
            <div className="employee-list">
                <h2>Employees</h2>
                <div className="employee-scroll">
                    {employees.length === 0 ? (
                        <p>No employees found.</p>
                    ) : (
                        employees.map(employee => (
                            <EmployeeCard
                                key={employee.EMPLOYEE_ID}
                                employeeName={
                                    `${employee.FIRST_NAME} ${employee.LAST_NAME}`
                                }
                                email={
                                    employee.EMAIL
                                }
                                phone={
                                    employee.PHONE_NUMBER
                                }
                                salary={
                                    employee.SALARY
                                }
                                jobTitle={
                                    employee.jobTitle?.title
                                    || employee.JOB_TITLE
                                    || employee.JOB_ID
                                    || "Not Assigned"
                                }
                                manager={
                                    employee.manager
                                    ? `${employee.manager.firstName} ${employee.manager.lastName}`
                                    : employee.MANAGER_ID
                                        ? `Manager ID: ${employee.MANAGER_ID}`
                                        : "No Manager"
                                }
                                department={
                                    employee.department?.name
                                    || employee.DEPARTMENT_NAME
                                    || (employee.DEPARTMENT_ID ? `Department ID: ${employee.DEPARTMENT_ID}` : "No Department")
                                }
                                onEdit={() =>
                                    handleEdit(employee)
                                }
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="employee-form">
                <Form 
                    onSubmit={handleSubmit} 
                    submitLabel='Hire' 
                    className="add-form" 
                    footer = {<Button type="button" onClick={resetForm}> Clear</Button>}
                    >

                    <h1>Employee Hiring Form</h1>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                name="FIRST_NAME"
                                value={formData.FIRST_NAME}
                                onChange={handleChange}
                                placeholder='John'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                name="LAST_NAME"
                                value={formData.LAST_NAME}
                                onChange={handleChange}
                                placeholder='Smith'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                name="EMAIL"
                                value={formData.EMAIL}
                                onChange={handleChange}
                                placeholder='jsmith'
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="PHONE_NUMBER"
                                value={formData.PHONE_NUMBER}
                                onChange={handleChange}
                                placeholder='515.123.4569'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Hire Date</label>
                            <input
                                type="date"
                                name="HIRE_DATE"
                                value={formData.HIRE_DATE}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Salary</label>
                            <input
                                type="number"
                                name="SALARY"
                                min="1"
                                value={formData.SALARY}
                                placeholder='4000'
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Job Title</label>
                        <select
                            name="JOB_ID"
                            value={formData.JOB_ID}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select Job Title
                            </option>

                            {jobTitles.map((job) => (
                                <option
                                    key={job.JOB_ID}
                                    value={job.JOB_ID}
                                >
                                    {job.JOB_TITLE}
                                </option>
                            ))}

                        </select>
                    </div>

                    <div className="form-group">
                        <label>Manager</label>
                        <select
                            name="MANAGER_ID"
                            value={formData.MANAGER_ID}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select Manager
                            </option>

                            {managers.map((manager) => (
                                <option
                                    key={manager.EMPLOYEE_ID}
                                    value={manager.EMPLOYEE_ID}
                                >
                                    {manager.FIRST_NAME} {manager.LAST_NAME}, {manager.DEPARTMENT_NAME || "No Department"}, {manager.JOB_TITLE || "No Role"}
                                </option>
                            ))}

                        </select>
                    </div>

                    <div className="form-group">
                        <label>Department</label>
                        <select
                            name="DEPARTMENT_ID"
                            value={formData.DEPARTMENT_ID}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select Department
                            </option>

                            {departments.map((dept) => (
                                <option 
                                    key={dept.DEPARTMENT_ID}
                                    value={dept.DEPARTMENT_ID}
                                >
                                    {dept.DEPARTMENT_NAME}
                                </option>
                            ))}
                        </select>
                    </div>
                </Form>
            </div>
            {showEditModal && (
                <div className="modal-overlay">

                    <div className="modal">

                        <h1>Edit Employee</h1>

                        <Form 
                            onSubmit={handleSubmit}
                            className="edit-form"
                            submitLabel="Save Changes"
                            footer = {<Button type="button" onClick={resetForm}> Cancel</Button>}
                        >
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    name="FIRST_NAME"
                                    value={editingEmployee.FIRST_NAME}
                                    disabled
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    name="LAST_NAME"
                                    value={editingEmployee.LAST_NAME}
                                    disabled
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    name="EMAIL"
                                    value={editingEmployee.EMAIL}
                                    onChange={handleEditChange}
                                />
                            </div>


                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    name="PHONE_NUMBER"
                                    value={editingEmployee.PHONE_NUMBER}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Hire Date</label>
                                <input
                                    type="date"
                                    name="HIRE_DATE"
                                    value={editingEmployee.HIRE_DATE}
                                    disabled
                                />
                            </div>


                            <div className="form-group">
                                <label>Salary</label>
                                <input
                                    type="number"
                                    name="SALARY"
                                    value={editingEmployee.SALARY}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Job Title</label>
                                <select
                                    name="JOB_ID"
                                    value={editingEmployee.JOB_ID}
                                    disabled
                                >
                                    {jobTitles.map(job => (
                                        <option key={job.JOB_ID} value={job.JOB_ID}>
                                            {job.JOB_TITLE}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Manager</label>
                                <select
                                    name="MANAGER_ID"
                                    value={editingEmployee.MANAGER_ID}
                                    disabled
                                >
                                    <option value="">
                                        No Manager
                                    </option>
                                    {managers.map(manager => (
                                        <option 
                                            key={manager.EMPLOYEE_ID}
                                            value={manager.EMPLOYEE_ID}
                                        >
                                            {manager.FIRST_NAME} {manager.LAST_NAME}, {manager.DEPARTMENT_NAME || "No Department"}, {manager.JOB_TITLE || "No Role"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Department</label>
                                <select
                                    name="DEPARTMENT_ID"
                                    value={editingEmployee.DEPARTMENT_ID}
                                    disabled
                                >
                                    {departments.map(dept => (
                                        <option 
                                            key={dept.DEPARTMENT_ID}
                                            value={dept.DEPARTMENT_ID}
                                        >
                                            {dept.DEPARTMENT_NAME}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </Form>

                    </div>

                </div>
            )}
        </div>
    );
}


export default EmployeeHiringForm;
