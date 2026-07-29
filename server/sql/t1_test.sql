-- Test employee_hire_sp directly in SQL Developer

begin
    employee_hire_sp(
        p_fname         => 'James',
        p_lname         => 'Gym',
        p_email         => 'jz@email.com',
        p_phone         => '416.555.1334',
        p_hire_date     => sysdate,
        p_job_id        => 'SA_REP',
        p_salary        => 7000,
        p_manager_id    => 145,
        p_department_id => 30
    );
end;
/



-- to prove inserted employee

select employee_id,
       first_name,
       last_name,
       email,
       phone_number,
       hire_date,
       job_id,
       salary,
       manager_id,
       department_id
from hr_employees
where email='tin@gmail.com'
order by employee_id desc;



-- Prove newest employees

select *
from hr_employees
order by employee_id desc;