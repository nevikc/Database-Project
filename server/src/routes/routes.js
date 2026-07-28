const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

// Define routes for places
router.get("/employees", controller.getAllEmployees);
router.get("/jobs", controller.getAllJobs);
router.get("/departments", controller.getAllDepartments);
router.get("/managers", controller.getAllManagers);

router.post("/employees", controller.createEmployee);
router.post("/jobs", controller.createJob);

router.patch("/employees/:employeeID", controller.updateEmployee);
router.patch("/jobs/:jobID", controller.updateJob);

module.exports = router;