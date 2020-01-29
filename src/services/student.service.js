const { StudentModel } = require("../models/student.model");
const { Types } = require("mongoose");

// local props
const Model = StudentModel;
const { isValid } = Types.ObjectId;

exports.StudentService = class StudentService {
	/**
	 * Creates a new student object
	 * @param {any} model object containing new student value
	 * @param {string} password new student password
	 */
	async NewStudent(model, password) {
		if (model && password && isValid(model.department)) {
			const cb = await new Model({
				...model,
				passphase: password
			}).save();
			await Model.populate(cb, {
				model: "Department",
				path: "department"
			});
			if (cb)
				return {
					status: 200,
					message: "Student account created successfully!",
					doc: cb
				};
		}
		throw new Error("Invalid student object!");
	}

	/**
	 * Updates a single student fingerprint
	 * @param {string} id student id
	 * @param {any} print new student fingerprint
	 */
	async UpdateFingerprint(id, print) {
		if (isValid(id) && print) {
			// query
			const q = { removed: false, _id: id };
			// Update statement
			const u = { $set: { fingerPrint: print } };
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Updated student's biometric data successfully!",
					doc: cb
				};
		}
		throw new Error("Student not found!");
	}

	/**
	 * Updates student current level
	 * @param {string} id student id
	 * @param {number} level student new level
	 */
	async UpdateLevel(id, level) {
		if (isValid(id) && level) {
			// query
			const q = { removed: false, _id: id };
			// Update statement
			const u = { $set: { level } };
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Updated student's level successfully!",
					doc: cb
				};
		}
		throw new Error("Student not found!");
	}

	/**
	 * Gets a single student record
	 * @param {string} id Student id
	 */
	async GetStudentByid(id) {
		if (isValid(id)) {
			const q = { removed: false, _id: id };
			const cb = await Model.findOne(q)
				.populate("department")
				.exec();
			if (cb)
				return {
					status: 200,
					message: "Student record found!",
					doc: cb
				};
		}
		throw new Error("Student not found!");
	}

	/**
	 * Gets a single student either by their email or phone number or reg no
	 * @param {string} id student's email or phone, reg no
	 */
	async GetStudentByNo(id) {
		if (id) {
			const q = {
				removed: false,
				$or: [{ regNo: id }, { email: id }, { phone: id }]
			};
			const cb = await Model.findOne(q)
				.populate("department")
				.exec();
			if (cb)
				return {
					status: 200,
					message: "Student record found!",
					doc: cb
				};
		}
		throw new Error("Student not found!");
	}

	async GetStudentsByDepartment(department, page = 1, limit = 25) {
		if (isValid(department)) {
			const q = { removed: false, department };
			const opt = { page, limit, sort: { name: 1 } };
			const cb = await Model.paginate(q, opt);
			return {
				...cb,
				status: 200,
				message: "Completed"
			};
		}
		throw new Error("No student found!");
	}

	async GetStudents(page, limit) {
		const q = { removed: false };
		const opt = {
			page,
			limit,
			sort: { name: 1 },
			populate: ["department"]
		};
		const cb = await Model.paginate(q, opt);
		return {
			...cb,
			status: 200,
			message: "Completed"
		};
	}

	/**
	 * Gets a list of student of the same class
	 * @param {Array<string>} departmentalCourses selected departmental courses
	 * @param {string} session active session id
	 */
	async GetStudentsOfSameClass(departmentalCourses, session) {
		if (isValid(session) && departmentalCourses.every(x => isValid(x))) {
			const q = {
				removed: false,
				"registeredCourses.session": session,
				"registeredCourses.departmentalCourse": {
					$in: departmentalCourses
				}
			};
			// const
			const cb = await Model.find(q)
				.select("-registeredCourses")
				.exec();

			return {
				status: 200,
				message: "Completed!",
				docs: cb
			};
		}
	}

	async GetStudentDepartmentalCourseList(id, session) {
		// validation
		if (isValid(id) && isValid(session)) {
			const q = {
				removed: false,
				_id: id,
				"registeredCourses.session": session
			};
			// query execution
			const cb = await Model.find(q)
				.populate("registeredCourses.departmentalCourse.lecturers")
				.select("registeredCourses")
				.exec();
			// pick only departmental course props
			const docs = cb.map(item => ({
				...item.registeredCourses
			}));
			return {
				status: 200,
				message: "Completed!",
				docs
			};
		}
		throw new Error("Student not found!");
	}

	/**
	 * Updates student session course
	 * @param {string} id student id
	 * @param {Array<string>} courses list of departmental course ids
	 * @param {string} session session id
	 */
	async UpdateRegisteredCourse(id, courses, session) {
		if (isValid(session) && isValid(id) && courses.length) {
			const q = { removed: false, _id: id };
			const deptCourses = courses.map(item => ({
				session,
				departmentalCourse: item
			}));
			// update statement
			const u = { $addToSet: { registeredCourses: deptCourses } };
			// execution
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					message: "Courses regitered successfully!",
					status: 200,
					doc: cb
				};
		}
		throw new Error("Invalid departmental course!");
	}
};
