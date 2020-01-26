// Import service class
const { DepartmentService } = require("../services/department.service");

// service instance
const _dService = new DepartmentService();

// public instance
module.exports = {
	services: { _dService },
	helpers: {}
};
