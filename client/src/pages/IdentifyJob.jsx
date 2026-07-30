import React, { useState } from "react";
import Button from "../components/Button";
import Form from "../components/Form";

function IdentifyJob() {
    const [jobID, setJobID] = useState("");
    const [job, setJob] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedJobID = jobID.trim().toUpperCase();
        if (!trimmedJobID) {
            setJob(null);
            setError("Enter a JOB_ID.");
            return;
        }

        setLoading(true);
        setError("");
        setJob(null);

        try {
            const response = await fetch(
                `http://localhost:8080/api/jobs/identify/${encodeURIComponent(trimmedJobID)}`
            );
            const data = await response.json();

            if (response.ok) {
                setJob(data.data);
            } else {
                setError(data.message || "Job not found.");
            }
        } catch (err) {
            console.error("Identify job error:", err);
            setError("Network error, make sure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setJobID("");
        setJob(null);
        setError("");
    };

    return (
        <div className="identify-job-page">
            <Form
                onSubmit={handleSubmit}
                submitLabel={loading ? "Searching..." : "Identify"}
                className="add-form identify-job-form"
                footer={<Button type="button" onClick={resetForm}>Clear</Button>}
            >
                <h1>Identify Job Description</h1>
                <div className="form-group">
                    <label>JOB_ID</label>
                    <input
                        name="JOB_ID"
                        value={jobID}
                        onChange={(e) => setJobID(e.target.value.toUpperCase())}
                        placeholder="SA_REP"
                        disabled={loading}
                        required
                    />
                </div>

                {job && (
                    <div className="identify-job-result">
                        <p><strong>JOB_ID:</strong> {job.JOB_ID}</p>
                        <p><strong>JOB Description:</strong> {job.JOB_TITLE}</p>
                    </div>
                )}

                {error && (
                    <p className="form-error">{error}</p>
                )}
            </Form>
        </div>
    );
}

export default IdentifyJob;
