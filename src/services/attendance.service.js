const { AttendanceModel } = require("../models/attendance.model");
const { Types } = require("mongoose");

// local props
const Model = AttendanceModel;
const { isValid } = Types.ObjectId;

exports.AttendanceService = class AttendanceService {
	/**
	 * Gets student attendance report
	 * @param {string} student student id
	 */
	async GetStudentAttendanceReport(student, session) {
		if (isValid(student) && isValid(session)) {
			// query
			const q = [
				{ $unwind: "$students" },
				{
					$match: {
						student: new Types.ObjectId(student),
						session: new Types.ObjectId(session),
						removed: false
					}
				},
				{
					$sort: { date: -1 }
				},
				{
					$group: {
						_id: "$departmentalCourse",
						attendance_summary: {
							$push: {
								_id: "$_id",
								date: "$date",
								present: "$present",
								exempted: "$exempted"
							}
						},
						count: { $sum: 1 }
					}
				},
				{
					$project: {
						_id: 0,
						attendance_summary: 1,
						total: "$count",
						course: "$_id"
					}
				}
			];
			// query execution
			const result = await Model.aggregate(q).exec();

			// return result
			return {
				status: 200,
				message: "Completed!",
				docs: result
			};
		}
		throw new Error("Student attendance not found!");
	}

	/**
	 * Gets lecturer attendance report
	 * @param {string} lecturerId lecturer id
	 * @param {string} sessionId Active session id
	 */
	async GetLecturerAttendanceReport(lecturerId, sessionId) {
		if (isValid(lecturerId) && isValid(sessionId)) {
			// query statement
			const q = {
				removed: false,
				session: sessionId,
				lecturer: lecturerId
			};
			// query execution
			const result = await Model.find(q)
				.sort({
					departmentalCourse: 1,
					date: -1
				})
				.exec();
			// return result
			return {
				status: 200,
				message: "Completed!",
				docs: result
			};
		}
		throw new Error("Lecturer's attendance not found!");
	}

	/**
	 * Gets departmental course attendance report
	 * @param {string} departmentalCourse Departmental course id
	 */
	async GetCourseAttendanceReport(departmentalCourse, session) {
		// Validation
		if (isValid(departmentalCourse) && isValid(session)) {
			// query statement
			const q = {
				removed: false,
				departmentalCourse,
				session
			};
			const result = await Model.find(q)
				.sort({
					date: -1
				})
				.exec();

			return {
				status: 200,
				message: "Completed!",
				docs: result
			};
		}
		throw new Error("Departmental course not found!");
	}

	/**
	 * Adds a new attendance record
	 * @param {string} student student id
	 * @param {any} attendance attendance object
	 * @param {string} session Active session id
	 */
	async NewAttendance(student, attendance, session) {
		if (
			isValid(student) &&
			isValid(session) &&
			attendance &&
			attendance.ss.every(x => isValid(x.s))
		) {
			const students = attendance.ss.map(c => ({
				student: c.s,
				present: c.p
			}));
			const cb = await new Model({
				date: attendance.d,
				departmentalCourse: attendance.dc,
				lecturer: attendance.l,
				studentAuthor: student,
				session,
				students
			}).save();

			if (cb)
				return {
					status: 200,
					message: `Recorded ${cb.students.length} new attendance successfully!`,
					doc: {
						total_uploaded: attendance.students.length,
						total_saved: cb.students.length
					}
				};
		}
		throw new Error("Invalid attendance object!");
	}

	/**
	 * Checks for attendance file validation
	 * @param {any} attendance attendance list from file
	 */
	async IsFileValid(attendance) {
		if (
			attendance &&
			"dc" in attendance &&
			"l" in attendance &&
			"d" in attendance &&
			"ss" in attendance
		)
			return true;

		return false;
	}

	async GetMany(ids) {
		const m = ids.sort();
		// query
		const q = { _id: { $in: m } };
		// execute query
		const cb = await Model.find(q)
			.sort({ _id: 1 })
			.exec();
		return cb;
	}
};
