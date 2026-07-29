import React, { useEffect, useState } from 'react';
import Button from '../components/Button'; 
import Form from '../components/Form';

function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [editingJobID, setEditingJobID] = useState(null);
    const [gridDraft, setGridDraft] = useState(null);
    const [savingJobID, setSavingJobID] = useState(null);
    
    const [formData, setFormData] = useState({
        JOB_ID: '',
        JOB_TITLE: '',
        MIN_SALARY: '',
        MAX_SALARY: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleJobSelect = (e) => {
        const jobId = e.target.value;

        const job = jobs.find(
            job => job.JOB_ID === jobId
        );

        setSelectedJob(job || null);
    };

    const resetForm = ()=>{
        setFormData({
            JOB_ID:"",
            JOB_TITLE:"",
            MIN_SALARY:"",
            MAX_SALARY:""
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

    const startGridEdit = (job) => {
        setEditingJobID(job.JOB_ID);
        setGridDraft({
            JOB_ID: job.JOB_ID,
            JOB_TITLE: job.JOB_TITLE,
            MIN_SALARY: job.MIN_SALARY,
            MAX_SALARY: job.MAX_SALARY,
        });
    };

    const handleGridChange = (e) => {
        const { name, value } = e.target;
        setGridDraft({
            ...gridDraft,
            [name]: value
        });
    };

    const cancelGridEdit = () => {
        setEditingJobID(null);
        setGridDraft(null);
    };

    const saveGridEdit = async () => {
        if (!gridDraft) {
            return;
        }

        if (!gridDraft.JOB_TITLE || !gridDraft.MIN_SALARY || !gridDraft.MAX_SALARY) {
            alert("Job title, minimum salary, and maximum salary are required.");
            return;
        }

        try {
            setSavingJobID(gridDraft.JOB_ID);
            const response = await fetch(
                `http://localhost:8080/api/jobs/${gridDraft.JOB_ID}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(gridDraft)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setJobs(prev =>
                    prev.map(job =>
                        job.JOB_ID === data.data.JOB_ID
                        ? data.data
                        : job
                    )
                );

                if (selectedJob?.JOB_ID === data.data.JOB_ID) {
                    setSelectedJob(data.data);
                }

                cancelGridEdit();
                alert("Job updated successfully!");
            } else {
                alert(data.message || "Failed to update job.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error, make sure backend is running.');
        } finally {
            setSavingJobID(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const newJob = await response.json();
                setJobs(prev => [
                    ...prev,
                    newJob.data
                ]);
                alert("A new job has been created");
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
                    <div className="job-grid-wrap">
                        <table className="job-grid">
                            <thead>
                                <tr>
                                    <th>JOB_ID</th>
                                    <th>JOB_TITLE</th>
                                    <th>MIN_SALARY</th>
                                    <th>MAX_SALARY</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => {
                                    const isEditing = editingJobID === job.JOB_ID;
                                    const rowData = isEditing ? gridDraft : job;
                                    const isSaving = savingJobID === job.JOB_ID;

                                    return (
                                        <tr key={job.JOB_ID}>
                                            <td>{job.JOB_ID}</td>
                                            <td>
                                                {isEditing ? (
                                                    <input
                                                        name="JOB_TITLE"
                                                        value={rowData.JOB_TITLE}
                                                        onChange={handleGridChange}
                                                        disabled={isSaving}
                                                        required
                                                    />
                                                ) : (
                                                    job.JOB_TITLE
                                                )}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <input
                                                        name="MIN_SALARY"
                                                        type="number"
                                                        min="1"
                                                        value={rowData.MIN_SALARY}
                                                        onChange={handleGridChange}
                                                        disabled={isSaving}
                                                        required
                                                    />
                                                ) : (
                                                    job.MIN_SALARY
                                                )}
                                            </td>
                                            <td>
                                                {isEditing ? (
                                                    <input
                                                        name="MAX_SALARY"
                                                        type="number"
                                                        min="1"
                                                        value={rowData.MAX_SALARY}
                                                        onChange={handleGridChange}
                                                        disabled={isSaving}
                                                        required
                                                    />
                                                ) : (
                                                    job.MAX_SALARY
                                                )}
                                            </td>
                                            <td>
                                                <div className="job-grid-actions">
                                                    {isEditing ? (
                                                        <>
                                                            <Button
                                                                type="button"
                                                                variant="primary"
                                                                width="fit"
                                                                disabled={isSaving}
                                                                onClick={saveGridEdit}
                                                            >
                                                                {isSaving ? "Saving" : "Save"}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="danger-light"
                                                                width="fit"
                                                                disabled={isSaving}
                                                                onClick={cancelGridEdit}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            variant="edit-light"
                                                            width="fit"
                                                            onClick={() => startGridEdit(job)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="create-job-form">
                <Form
                    onSubmit={handleSubmit}
                    className="add-form"
                    submitLabel="CREATE JOB"
                    footer={<Button type="button" onClick={resetForm}>Clear</Button>}
                >
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
        </div>
    );
}

export default Jobs;
