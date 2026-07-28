const service = require("../services/service");

async function getAllJobs(req, res){
  try{ 
    const jobs = await service.getAllJobs();
    return res.status(200).json({
      success: true,
      data: jobs
    });
  } catch(error){
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getAllEmployees(req, res){
  try{ 
    const employees = await service.getAllEmployees();
    return res.status(200).json({
      success: true,
      data: employees
    });
  } catch(error){
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getAllDepartments(req, res){
  try{ 
    const departments = await service.getAllDepartments();
    return res.status(200).json({
      success: true,
      data: departments
    });
  } catch(error){
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getAllManagers(req, res){
  try{ 
    const managers = await service.getAllManagers();
    return res.status(200).json({
      success: true,
      data: managers
    });
  } catch(error){
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function createJob(req, res){
  try{
    const jobData = {...req.body};
    const newJob = await service.createJob(jobData);

    return res.status(201).json({
      success: true,
      data: newJob
    });
  }catch(err){
    if (err.status === 400) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    if(err.name === "ValidationError"){
      return res.status(400).json({
        success: false,
        message: "Improper Data Format",
        error: err.message
      });
    }
    if(err.code === 11000){
      return res.status(409).json({
        success: false,
        message: "Duplicate Job",
        error: err.message
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function createEmployee(req, res){
  try{
    const employeeData = {...req.body};
    const newEmployee = await service.createEmployee(employeeData);

    return res.status(201).json({
      success: true,
      data: newEmployee
    });
  }catch(err){
     if (err.errorNum === 20001 || err.message.includes("ORA-20001")) {
      let oracleMessage = err.message;

      oracleMessage = oracleMessage
      .split("ORA-20001:")[1]  
      .split("\nORA-")[0]      
      .trim();

      return res.status(400).json({
        success: false,
        message: oracleMessage
      });
    }
    if (err.status === 400) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    if(err.name === "ValidationError"){
      return res.status(400).json({
        success: false,
        message: "Improper Data Format",
        error: err.message
      });
    }
    if(err.code === 11000){
      return res.status(409).json({
        success: false,
        message: "Duplicate Employee",
        error: err.message
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function updateJob(req, res){
  try{
    const id = req.params.jobID;
    const updateData = req.body;
    const updatedJob = await service.updateJob(id, updateData);
    if (!updatedJob){
      return res.status(404).json({
        success: false,
        error: "Job Not Found"
      });
    }
    return res.status(200).json({
      success: true,
      data: updatedJob
    });
  }catch(err){
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Improper Data Format",
        error: err.message
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
}

async function updateEmployee(req, res){
  try{
    const id = req.params.employeeID;
    const updateData = req.body;
    const updatedEmployee = await service.updateEmployee(id, updateData);
    if (!updatedEmployee){
      return res.status(404).json({
        success: false,
        error: "Employee Not Found"
      });
    }
    return res.status(200).json({
      success: true,
      data: updatedEmployee
    });
  }catch(err){
    if (err.errorNum === 20001 || err.message.includes("ORA-20001")) {
      let oracleMessage = err.message;

      oracleMessage = oracleMessage
      .split("ORA-20001:")[1]  
      .split("\nORA-")[0]      
      .trim();

      return res.status(400).json({
        success: false,
        message: oracleMessage
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Improper Data Format",
        error: err.message
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
}

module.exports = {
  getAllJobs,
  getAllEmployees,
  getAllDepartments,
  getAllManagers,
  createJob,
  createEmployee,
  updateJob,
  updateEmployee,
}