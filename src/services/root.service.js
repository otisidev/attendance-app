// Import service class
const { DepartmentService } = require("../services/department.service");
const { SessionService } = require("../services/session.service");

// service instance
const _dService = new DepartmentService();
const _sService = new SessionService();

// public instance
module.exports = {
	services: { _dService, _sService },
	helpers: {}
};
