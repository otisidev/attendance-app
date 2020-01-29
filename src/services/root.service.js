// Import service class
const { DepartmentService } = require("../services/department.service");
const { SessionService } = require("../services/session.service");
const { MaximumCreditService } = require("../services/maximum-credit.service");
const { LogService } = require("../services/log.service");
const { UserService } = require("../services/user.service");
const { LecturerService } = require("../services/lecturer.service");
const {
	DepartmentalCourseService
} = require("../services/departmental-course.service");
const { CoreService } = require("../../context/core.lib");

// service instance
const _dService = new DepartmentService();
const _sService = new SessionService();
const _mService = new MaximumCreditService();
const _lService = new LogService();
const _uService = new UserService();
const _dcService = new DepartmentalCourseService();
const _lecService = new LecturerService();
const coreService = new CoreService();

// public instance
module.exports = {
	services: {
		_dService,
		_sService,
		_mService,
		_lService,
		coreService,
		_uService,
		_dcService,
		_lecService
	},
	helpers: {}
};
