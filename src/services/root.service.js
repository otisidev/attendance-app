// Import service class
const { DepartmentService } = require("../services/department.service");
const { SessionService } = require("../services/session.service");
const { MaximumCreditService } = require("../services/maximum-credit.service");

// service instance
const _dService = new DepartmentService();
const _sService = new SessionService();
const _mService = new MaximumCreditService();

// public instance
module.exports = {
	services: { _dService, _sService, _mService },
	helpers: {}
};
