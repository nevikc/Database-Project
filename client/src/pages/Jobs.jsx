import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'; 
import JobCard from '../components/JobCard';
import Form from '../components/Form';

function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [editingJob, setEditingJob] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    
    const [formData, setFormData] = useState({
        JOB_ID: '',
        JOB_TITLE: '',
        MIN_SALARY: '', 
        MAX_SALARY: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setEditingJob({
            ...editingJob,
            [name]: value
        });
    };

    const handleEdit = (job) => {
        setEditingJob({
            JOB_ID: job.JOB_ID,
            JOB_TITLE: job.JOB_TITLE,
            MIN_SALARY: job.MIN_SALARY,
            MAX_SALARY: job.MAX_SALARY,
        });
        setShowEditModal(true);
    };

    const handleJobSelect = (e) => {
        const jobId = e.target.value;

        const job = jobs.find(
            job => job.JOB_ID === jobId
        );

        setSelectedJob(job || null);
    };

    const resetForm = ()=>{
        setEditingJob(null);
        setShowEditModal(false);
        setFormData({
            JOB_ID:"",
            JOB_TITLE:"",
            MIN_SALARY:"",
            MAX_SALARY:"",
        });
    };

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/jobs");
                const data = await response.json();
                setJobs(data.data);
            } catch(error) {
                console.error(error);
            }
        };

        loadJobs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (editingJob) {
                response = await fetch(
                    `http://localhost:8080/api/jobs/${editingJob.JOB_ID}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(editingJob)
                    }
                );
            }else{
                response = await fetch('http://localhost:8080/api/jobs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
            }

            if (response.ok) {
                const newJob = await response.json();
                 if(editingJob) {
                    setJobs(prev =>
                        prev.map(job =>
                            job.JOB_ID === newJob.data.JOB_ID
                            ? newJob.data
                            : job
                        )

                    );
                    alert(
                        "Job updated successfully!"
                    );
                } else {
                    setJobs(prev => [
                        ...prev,
                        newJob.data
                    ]);
                    alert("Job Created!");
                }
                resetForm();
            } else {
                alert('Failed to save. Ensure all fields are filled correctly.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error, make sure backend is running.');
        }
    };

    return (
        <div className="jobs-page">
            <div className="job-selector">
                <div className="form-group">
                    <label>Select a Job to View</label>
                    <select
                        value={selectedJob?.JOB_ID || ""}
                        onChange={handleJobSelect}
                    >
                        <option value="">
                            Select a Job
                        </option>

                        {jobs.map((job) => (
                            <option
                                key={job.JOB_ID}
                                value={job.JOB_ID}
                            >
                                {job.JOB_TITLE}
                            </option>
                        ))}

                    </select>

                    {selectedJob && (
                        <div className="job-description">
                            <p><strong>Job ID:</strong> {selectedJob.JOB_ID}</p>
                            <p><strong>Job Title:</strong> {selectedJob.JOB_TITLE}</p>
                            <p>
                                <strong>Salary Range:</strong>{" "}
                                ${selectedJob.MIN_SALARY} - ${selectedJob.MAX_SALARY}
                            </p>
                        </div>
                    )}
                     <h2>All Jobs</h2>
                        <div className="job-list-scroll">
                            {jobs.map((job) => (
                                <JobCard
                                    key={job.JOB_ID}
                                    jobID={job.JOB_ID}
                                    title={job.JOB_TITLE}
                                    minimumSalary={job.MIN_SALARY}
                                    maximumSalary={job.MAX_SALARY}
                                    onClick={() => setSelectedJob(job)}
                                    onEdit={() =>handleEdit(job)}
                                />
                            ))}
                        </div>
                </div>
            </div>
            <div className="create-job-form">
                <Form onSubmit={handleSubmit} className="add-form" footer = {<Button type="button" onClick={resetForm}> Clear</Button>}>
                    <h1>Create New Job</h1>
                    <div className="form-group">
                        <br/>
                        <label>Job ID</label>
                        <input 
                            name="JOB_ID" 
                            value={formData.JOB_ID} 
                            onChange={handleChange} 
                            placeholder='AS_MAN'
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Title</label>
                        <input 
                            name="JOB_TITLE" 
                            value={formData.JOB_TITLE} 
                            onChange={handleChange} 
                            placeholder='ASSISTANT MANAGER'
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Minimum Salary</label>
                        <input 
                            name="MIN_SALARY" 
                            type="number"        
                            value={formData.MIN_SALARY} 
                            onChange={handleChange} 
                            placeholder='3500'
                            min="1"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Maximum Salary</label>
                        <input 
                            name="MAX_SALARY" 
                            type="number" 
                            value={formData.MAX_SALARY} 
                            onChange={handleChange} 
                            placeholder='5500'
                            min="1"
                            required 
                        />
                    </div>
                </Form>
            </div>
            {showEditModal && (
                <div className="modal-overlay">

                    <div className="modal">

                        <h1>Edit Job</h1>

                        <Form 
                            onSubmit={handleSubmit}
                            className="edit-form"
                            submitLabel="Save Changes"
                            footer = {<Button type="button" onClick={resetForm}> Cancel</Button>}
                        >
                            <div className="form-group">
                                <label>Job ID</label>
                                <input
                                    name="id"
                                    value={editingJob.JOB_ID}
                                    disabled
                                />
                            </div>

                            <div className="form-group">
                                <label>Job Title</label>
                                <input
                                    name="JOB_TITLE"
                                    value={editingJob.JOB_TITLE}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Minimum Salary</label>
                                <input
                                    name="MIN_SALARY"
                                    type="number"
                                    min = "1"
                                    value={editingJob.MIN_SALARY}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Maximum Salary</label>
                                <input
                                    type="number"
                                    min = "1"
                                    name="MAX_SALARY"
                                    value={editingJob.MAX_SALARY}
                                    onChange={handleEditChange}
                                    required
                                />
                            </div>

                        </Form>

                    </div>

                </div>
            )}
        </div>
    );
}

export default Jobs;
