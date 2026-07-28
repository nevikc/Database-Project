const { connectDB } = require("../init/connectDB");
const oracledb = require("oracledb");

async function getAllJobs() {
  let connection;
  try {
        connection = await connectDB();

        const result = await connection.execute(
            /*insert procedure/function name here from sql*/
            `
            SELECT *
            FROM hr_jobs
            `,
             [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        return result.rows;

    } finally {
        if (connection) {
            await connection.close();
        }
    }

}

async function getAllEmployees() {
  let connection;
  try {
        connection = await connectDB();

        const result = await connection.execute(
            /*insert procedure/function name here from sql*/
            `
            SELECT
                  e.EMPLOYEE_ID,
                  e.FIRST_NAME,
                  e.LAST_NAME,
                  e.EMAIL,
                  e.PHONE_NUMBER,
                  e.SALARY,
                  e.HIRE_DATE,

                  m.EMPLOYEE_ID AS MANAGER_ID,
                  m.FIRST_NAME AS MANAGER_FIRST_NAME,
                  m.LAST_NAME AS MANAGER_LAST_NAME,
                  
                  d.DEPARTMENT_ID,
                  d.DEPARTMENT_NAME,

                  j.JOB_ID,
                  j.JOB_TITLE

              FROM HR_EMPLOYEES e

              LEFT JOIN HR_EMPLOYEES m
                  ON e.MANAGER_ID = m.EMPLOYEE_ID

              LEFT JOIN HR_DEPARTMENTS d
                  ON e.DEPARTMENT_ID = d.DEPARTMENT_ID

              LEFT JOIN HR_JOBS j
                  ON e.JOB_ID = j.JOB_ID`,
             [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        const employees = result.rows.map(employee => ({
            EMPLOYEE_ID: employee.EMPLOYEE_ID,
            FIRST_NAME: employee.FIRST_NAME,
            LAST_NAME: employee.LAST_NAME,
            EMAIL: employee.EMAIL,
            PHONE_NUMBER: employee.PHONE_NUMBER,
            SALARY: employee.SALARY,
            HIRE_DATE: employee.HIRE_DATE,

            MANAGER_ID: employee.MANAGER_ID,

            manager: employee.MANAGER_ID
                ? {
                    firstName: employee.MANAGER_FIRST_NAME,
                    lastName: employee.MANAGER_LAST_NAME
                }
                : null,

            department: employee.DEPARTMENT_ID
                ? {
                    id: employee.DEPARTMENT_ID,
                    name: employee.DEPARTMENT_NAME
                }
                : null,

            jobTitle: employee.JOB_ID
                ? {
                    id: employee.JOB_ID,
                    title: employee.JOB_TITLE
                }
                : null
        }));

        return employees;

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function getAllDepartments() {
  let connection;
  try {
        connection = await connectDB();

        const result = await connection.execute(
            /*insert procedure/function name here from sql*/
            `
            SELECT *
            FROM hr_departments
            `,
             [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        return result.rows;

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function getAllManagers() {
  let connection;
  try {
        connection = await connectDB();

        const result = await connection.execute(
            /*insert procedure/function name here from sql*/
            `
            SELECT DISTINCT
                m.EMPLOYEE_ID,
                m.FIRST_NAME,
                m.LAST_NAME
            FROM HR_EMPLOYEES e
            JOIN HR_EMPLOYEES m
            ON e.MANAGER_ID = m.EMPLOYEE_ID
            `,
             [],
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        );

        return result.rows;

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function createJob(jobData){
    let connection;
    try {
        connection = await connectDB();

        /*insert procedure/function name here from sql*/
        await connection.execute(
            `
            INSERT INTO HR_JOBS (
                JOB_ID,
                JOB_TITLE,
                MIN_SALARY,
                MAX_SALARY
            )
            VALUES (
                :job_id,
                :job_title,
                :min_salary,
                :max_salary
            )
            `,
            {
                JOB_ID: jobData.JOB_ID,
                JOB_TITLE: jobData.JOB_TITLE,
                MIN_SALARY: jobData.MIN_SALARY,
                MAX_SALARY: jobData.MAX_SALARY
            },

             {
                  autoCommit: true
              }
        );

        return jobData;

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function createEmployee(employeeData){
  let connection;

    try {
        connection = await connectDB();
        
        /*insert procedure/function name here from sql*/
        await connection.execute(
            `
            INSERT INTO HR_EMPLOYEES (
                EMPLOYEE_ID,
                FIRST_NAME,
                LAST_NAME,
                EMAIL,
                PHONE_NUMBER,
                HIRE_DATE,
                JOB_ID,
                SALARY,
                COMMISSION_PCT,
                MANAGER_ID,
                DEPARTMENT_ID
            )
            VALUES (
                :employee_id,
                :first_name,
                :last_name,
                :email,
                :phone_number,
                :hire_date,
                :job_title,
                :salary,
                :commission_pct,
                :manager_id,
                :department_id
            )
            `,
            {
                employee_id: 900,
                first_name: employeeData.FIRST_NAME,
                last_name: employeeData.LAST_NAME,
                email: employeeData.EMAIL,
                phone_number: employeeData.PHONE_NUMBER,
                hire_date: new Date(employeeData.HIRE_DATE),
                job_title: employeeData.JOB_ID,
                salary: employeeData.SALARY,
                commission_pct : 0.2,
                manager_id: employeeData.MANAGER_ID,
                department_id: employeeData.DEPARTMENT_ID
            },
            {
                autoCommit: true
            }
        );
        const employees = await getAllEmployees();

        return employees.find(
            employee => employee.EMPLOYEE_ID === 900
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }

}

async function updateJob(id, updateData){
  const connection = await connectDB();
    try {
        /*insert procedure/function name here from sql*/
        await connection.execute(
            `
            UPDATE HR_JOBS
            SET
                JOB_TITLE = :job_title,
                MIN_SALARY = :min_salary,
                MAX_SALARY = :max_salary
            WHERE JOB_ID = :job_id
            `,
            {
                job_id: id,
                job_title: updateData.JOB_TITLE,
                min_salary: updateData.MIN_SALARY,
                max_salary: updateData.MAX_SALARY
            },
            {
                autoCommit: true
            }
        );

        return {
            JOB_ID: id,
            ...updateData
        };

    } finally {
        await connection.close();
    }
}

async function updateEmployee(id, updateData){
  const connection = await connectDB();
    try {
      /*insert procedure/function name here from sql*/
        await connection.execute(
            `
            
            UPDATE HR_EMPLOYEES
            SET 
                EMAIL = :email,
                PHONE_NUMBER = :phone_number,
                SALARY = :salary
            WHERE EMPLOYEE_ID = :employee_id
            `,
            {
                employee_id: id,
                email: updateData.EMAIL,
                phone_number: updateData.PHONE_NUMBER,
                salary: updateData.SALARY
            },
            {
                autoCommit: true
            }
        );

        const employees = await getAllEmployees();
        return employees.find(
            employee => employee.EMPLOYEE_ID == id
        );

    } finally {
        await connection.close();
    }
}

module.exports = {
  getAllJobs,
  getAllEmployees,
  getAllDepartments,
  getAllManagers,
  createJob,
  createEmployee,
  updateEmployee,
  updateJob,
};
