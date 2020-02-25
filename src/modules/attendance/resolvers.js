const { AuthenticationError, ApolloError } = require("apollo-server");

const resolvers = {
	Query: {
		GetStudentAttendanceReport: async (_, __, { dataSources, user }) => {
			if (user) {
				const { _aService, _sService, _studService } = dataSources;
				// get active session
				const session_res = await _sService.GetActiveSession();
				//  get student
				const student_res = await _studService.GetStudentByid(user.id);
				// get atttendance report here
				const result = await _aService.GetStudentAttendanceReport(
					student_res.doc.id,
					session_res.doc.id
				);
				// return result
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetLecturerAttendanceReport: async (_, __, { dataSources, user }) => {
			if (user) {
				const { _aService, _sService, _lecService } = dataSources;
				// get active session
				const session_res = await _sService.GetActiveSession();
				// get lecturer
				const lec_res = await _lecService.GetLecturer(__.lecturer);
				const result = await _aService.GetLecturerAttendanceReport(
					lec_res.doc.id,
					session_res.doc.id
				);
				//  return result
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetCourseAttendanceReport: async (_, { id }, { dataSources, user }) => {
			if (user) {
				const { _aService, _sService } = dataSources;
				// Get active session
				const session_res = await _sService.GetActiveSession();
				// Get course information
				const result = await _aService.GetCourseAttendanceReport(
					id,
					session_res.doc.id
				);
				// return result
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		}
	},
	Mutation: {
		UploadAttendance: async (_, { file }, { dataSources, user }) => {
			// console.log("users:", user);
			if (user) {
				const { _aService, _sService, helpers } = dataSources;
				// read file from request
				const { createReadStream } = await file;
				// read file content
				// const data = await helpers.fileRead(createReadStream());
				// // validate file content
				// // console.log( data);
				// if (data) {
				// 	const json_data = JSON.parse(data);
				// 	// check if the file content some props
				// 	if (await _aService.IsFileValid(json_data)) {
				// 		// get active session
				// 		const session_res = await _sService.GetActiveSession();
				// 		// save and report back
				// 		const result = await _aService.NewAttendance(
				// 			user.id,
				// 			json_data,
				// 			session_res.doc.id
				// 		);
				// 		return result;
				// 	}
				// }
				return new ApolloError(
					"File not well formatted! File content must be an arraay that contains date, students, lecturer, and departmentalCourse props.",
					"404"
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		}
	},
	Attendance: {
		departmentalCourse: async (
			{ departmentalCourse },
			_,
			{ dataSources }
		) => {
			return await dataSources.loaders.dcLoader.load(
				departmentalCourse.toString()
			);
		},
		session: async ({ session }, _, { dataSources }) => {
			return await dataSources.loaders.sessionLoader.load(
				session.toString()
			);
		},
		lecturer: async ({ lecturer }, _, { dataSources }) => {
			return await dataSources.loaders.lecturerLoader.load(
				lecturer.toString()
			);
		}
	},
	AttendanceStudent: {
		student: async ({ student }, _, { dataSources }) => {
			return await dataSources.loaders.studentLoader.load(
				student.toString()
			);
		}
	}
};

exports.resolvers = resolvers;
