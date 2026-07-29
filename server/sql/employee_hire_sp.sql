-- sequence to generates new employee IDs for HR_EMPLOYEES.

create sequence hr_employee_seq
start with 301 increment by 1
nocache nocycle;

select sequence_name
from user_sequences
where sequence_name='hr_employee_seq';

-- employee hiring procedure
create or replace procedure employee_hire_sp(
p_fname         in hr_employees.first_name%type,
p_lname         in hr_employees.last_name%type,
p_email         in hr_employees.email%type,
p_phone         in hr_employees.phone_number%type,
p_hire_date     in hr_employees.hire_date%type,
p_job_id        in hr_employees.job_id%type,
p_salary        in hr_employees.salary%type,
p_manager_id    in hr_employees.manager_id%type,
p_department_id in hr_employees.department_id%type
) is
begin
insert into hr_employees(
employee_id, first_name, last_name, email,phone_number, hire_date,
job_id,salary,manager_id,department_id
) values (
hr_employee_seq.nextval,p_fname,p_lname,
upper(p_email),p_phone,nvl(p_hire_date, sysdate),
upper(p_job_id),p_salary,p_manager_id,p_department_id
);
commit;
end employee_hire_sp;
/

