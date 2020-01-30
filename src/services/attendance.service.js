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
			await Model.populate(result, {
				model: "DepartmentalCourse",
				path: "course"
			});
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
				.populate([
					"departmentalCourse",
					"session",
					"lecturer",
					"students.student"
				])
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
				.populate([
					"departmentalCourse",
					"session",
					"lecturer",
					"students.student"
				])
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
	 * @param {Array<any>} attendanceList attendance list
	 * @param {string} session Active session id
	 */
	async NewAttendance(student, attendanceList, session) {
		if (isValid(student) && isValid(session) && attendanceList.length) {
			// build attendance valid object
			const attendances = attendanceList.map(i => ({
				session,
				studentAuthor: student,
				...i
			}));

			const result = await Model.insertMany(attendances, {
				rawResult: true
			});
			if (result && result.insertedCount)
				return {
					status: 200,
					message: `Recorded new ${result.insertedCount} attendance successfully!`,
					doc: {
						total_uploaded: attendances.length,
						total_saved: result.insertedCount
					}
				};
		}
		throw new Error("Invalid attendance object!");
	}

	/**
	 * Checks for attendance file validation
	 * @param {Array<any>} attendance_list attendance list from file
	 */
	async IsFileValid(attendance_list) {
		if (attendance_list.length) {
			if (
				attendance_list.every(
					item =>
						"departmentalCourse" in item &&
						"lecturer" in item &&
						"date" in item &&
						"students" in item &&
						typeof item.students === "object"
				)
			)
				return true;
		}
		return false;
	}
};
