// Import service class
const { DepartmentService } = require("../services/department.service");
const { SessionService } = require("../services/session.service");
const { MaximumCreditService } = require("../services/maximum-credit.service");
const { LogService } = require("../services/log.service");
const { UserService } = require("../services/user.service");
const { StudentService } = require("../services/student.service");
const { LecturerService } = require("../services/lecturer.service");
const { AttendanceService } = require("../services/attendance.service");
const { ExemptionService } = require("../services/exemption.service");
const { DepartmentalCourseService } = require("../services/departmental-course.service");
const FS = require("../services/fingerprint.service");
const { CoreService } = require("../../context/core.lib");

// service instance
const _dService = new DepartmentService();
const _sService = new SessionService();
const _mService = new MaximumCreditService();
const _lService = new LogService();
const _uService = new UserService();
const _dcService = new DepartmentalCourseService();
const _lecService = new LecturerService();
const _studService = new StudentService();
const _aService = new AttendanceService();
const coreService = new CoreService();
const _eService = new ExemptionService();
const _fService = new FS.FingerPrintService();

const { fileRead } = require("../../lib/file-reader");

// dataloader
const DataLoader = require("dataloader");

const GetToken = event => {
    if (event) {
        const auth = event.headers.authorization || "";
        if (auth) {
            const t = auth.split(" ")[1];
            if (t) return t;
        }
    }
    throw new Error("Unauthorized Access!");
};

const response = (status, body) => {
    return {
        statusCode: status,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.parse(body)
    };
};

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
        _lecService,
        _studService,
        _aService,
        _eService,
        _fService
    },
    helpers: {
        fileRead,
        GetToken,
        response
    },
    loaders: {
        departmentLoader: new DataLoader(async ids => {
            return await _dService.GetMany(ids);
        }),
        lecturerLoader: new DataLoader(async ids => {
            return await _lecService.GetMany(ids);
        }),
        dcLoader: new DataLoader(async ids => {
            return await _dcService.GetMany(ids);
        }),
        attendanceLoader: new DataLoader(async ids => {
            return await _aService.GetMany(ids);
        }),
        studentLoader: new DataLoader(async ids => {
            return await _studService.GetMany(ids);
        }),
        sessionLoader: new DataLoader(async ids => {
            return await _sService.GetMany(ids);
        })
    }
};
