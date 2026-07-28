import Button from "./Button";
import { FaPen } from "react-icons/fa";

function JobCard({
  jobID,
  title,
  minimumSalary,
  maximumSalary,
  onClick,
  onEdit,
}) {

  return (
    <div className="job-card" onClick={onClick}>
      {onEdit && (
        <div className="job-card__action">
            <Button
              variant="edit-light"
              width="fit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <FaPen size={12} />
            </Button>
        </div>
      )}
      <div className="job-details">
                <div className="job-header">
                    <h3 className="job-id">
                        {jobID}
                    </h3>
                </div>
                <p className="job-description">
                    Title: {title}
                </p>
                <p className="job-description">
                    Salary: ${minimumSalary} - ${maximumSalary}
                </p>
            </div>
    </div>
  );
}

export default JobCard;
