import Button from "./Button";
import { FaPen, FaTrash } from "react-icons/fa";

function EmployeeCard({
  employeeName,
  email,
  phone,
  salary,
  jobTitle,
  manager,
  department,
  onClick,
  onEdit,
  onDelete,
}) {

  return (
    <div className="employee-card" onClick={onClick}>
      {(onEdit || onDelete) && (
        <div className="employee-card__action">
          {onEdit && (
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
          )}

          {onDelete && (
            <Button
              variant="edit-light"
              width="fit"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <FaTrash size={12} />
            </Button>
          )}
        </div>
      )}
      <div className="employee-details">
                <div className="employee-header">
                    <h3 className="employee-name">
                        {employeeName}
                    </h3>
                </div>
                <p className="employee-description">
                    Email: {email}
                </p>
                <p className="employee-description">
                    Phone: {phone}
                </p>
                <p className="employee-description">
                    Salary: ${salary}
                </p>
                <p className="employee-description">
                    Job Title: {jobTitle}
                </p>
                <p className="employee-description">
                    Manager: {manager}
                </p>
                <p className="employee-description">
                    Department: {department}
                </p>
            </div>
    </div>
  );
}

export default EmployeeCard;
