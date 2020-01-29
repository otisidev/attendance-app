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
	 *Updates a single student image
	 * @param {string} id student id
	 * @param {string} image student image path
	 */
	async UpdateStudentImage(id, image) {
		if (isValid(id) && image) {
			// query
			const q = { removed: false, _id: id };
			// Update statement
			const u = { $set: { image } };
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Updated student's image successfully!",
					doc: cb
				};
		}
		throw new Error("Student not found!");
	}
	async UpdateStudent(id, name, phone) {
		if (isValid(id) && name && phone) {
			// query
			const q = { removed: false, _id: id };
			// Update statement
			const u = { $set: { name, phone } };
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Updated student's record successfully!",
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

	/**
	 * Gets list of registered student course list
	 * @param {string} id student id
	 * @param {string} session active session id
	 */
	async GetStudentRegisteredCourseList(id, session) {
		// validation
		if (isValid(id) && isValid(session)) {
			const q = [
				{ $unwind: "$registeredCourses" },
				{
					$match: {
						_id: Types.ObjectId(id),
						"registeredCourses.session": Types.ObjectId(session)
					}
				},
				{
					$group: {
						_id: {
							session: "$registeredCourses.session",
							level: "$registeredCourses.level"
						},
						courses: {
							$push: {
								_id: "$_id",
								course: "$departmentalCourse",
								date: "$date"
							}
						},
						total: { $sum: 1 }
					}
				},
				{
					$project: {
						_id: 0,
						session: "$_id.session",
						level: "$_id.level",
						courses: 1,
						total: 1
					}
				}
			];

			// query execution
			const result = await Model.aggregate(q).exec();
			// populdate
			await Model.populate(result, [
				{ model: "Session", path: "session" },
				{ model: "DepartmentalCourse", path: "courses.course" }
			]);

			return {
				status: 200,
				message: "Completed!",
				docs: result
			};
		}
		throw new Error("Student not found!");
	}

	/**
	 * Updates student session course
	 * @param {string} id student id
	 * @param {Array<string>} courses list of departmental course ids
	 * @param {string} session session id
	 * @param {number} level student level as of when the course was registered
	 */
	async UpdateRegisteredCourse(id, courses, session, level) {
		if (isValid(session) && isValid(id) && courses.length && level) {
			const q = { removed: false, _id: id };
			const deptCourses = courses.map(item => ({
				session,
				departmentalCourse: item,
				level
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

	async RemoveStudent(id) {
		if (isValid(id)) {
			const q = { removed: false, _id: id };
			const update = { $set: { removed: true } };
			const cb = await Model.findOneAndUpdate(q, update).exec();
			if (cb)
				return {
					status: 200,
					message: "Student account removed successfully!",
					doc: { id, status: "Deleted" }
				};
		}
		throw new Error("Failed! Student account not found.");
	}
};
