const { AuthenticationError, ApolloError } = require("apollo-server");

const resolvers = {
	Query: {
		GetStudentsByDepartment: async (_, __, { dataSources, user }) => {
			if (user) {
				const { department: d, level } = __;
				const { _studService } = dataSources;
				return await _studService.GetStudentsByDepartment(d, level);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetDepartmentalStudentForEnrollment: async (
			_,
			__,
			{ dataSources, user }
		) => {
			if (user) {
				const { department: d, level } = __;
				const { _studService } = dataSources;
				return await _studService.GetStudentsByDepartmentForEnroll(
					d,
					level
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetStudents: async (_, __, { dataSources, user }) => {
			if (user) {
				const { page, limit } = __;
				return await dataSources._studService.GetStudents(page, limit);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetStudentById: async (_, { id }, { dataSources, user }) => {
			if (user) {
				return await dataSources._studService.GetStudentByid(id);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetStudentByNo: async (_, { id }, { dataSources, user }) => {
			if (user) {
				return await dataSources._studService.GetStudentByNo(id);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetCoursemate: async (_, __, { dataSources, user }) => {
			if (user) {
				const { _studService, _sService } = dataSources;
				// get student
				const student_res = await _studService.GetStudentByid(user.id);
				// get current session
				const session_res = await _sService.GetActiveSession();
				// return list of departmental course id
				const departalCourseId = student_res.doc.registeredCourses.map(
					i => i.departmentalCourse
				);
				const result = await _studService.GetStudentsOfSameClass(
					departalCourseId,
					session_res.doc.id
				);
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetRegisteredCourses: async (_, __, { dataSources, user }) => {
			if (user) {
				//
				const { _sService, _studService } = dataSources;

				// session
				const session_res = await _sService.GetActiveSession();
				const result = await _studService.GetStudentRegisteredCourseList(
					user.id,
					session_res.doc.id
				);
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		}
	},
	Mutation: {
		CreateStudent: async (_, { model }, { dataSources }) => {
			const { _studService, coreService } = dataSources;
			// encrypt password
			const passphase = await coreService.EncryptPassword(model.password);
			// create student account
			const result = await _studService.NewStudent(model, passphase);
			// create token
			const { id, name, reg_no, email, phone, level } = result.doc;
			const token = coreService.GenerateToken({
				id,
				name,
				reg_no,
				email,
				phone,
				level
			});
			// TODO: send email notification

			// return result
			return {
				...result,
				token
			};
		},
		UpdateStudent: async (_, __, { dataSources, user }) => {
			if (user) {
				const { name, phone } = __;
				return await dataSources._studService.UpdateStudent(
					user.id,
					name,
					phone
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UpdateStudentBiometric: async (_, __, { dataSources, user }) => {
			// validation
			if (user) {
				const { student, template } = __;
				const { _fService, _studService } = dataSources;
				const result = await _studService.UpdateFingerprint(
					student,
					template
				);
				// Update finger print model
				await _fService.LogNew({
					...__,
					author: user.id,
					target_id: student,
					target: "Student"
				});
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UpdateSingleStudentBiometric: async (_, __, { dataSources, user }) => {
			// validation
			if (user) {
				const { id, template } = __;
				const { _studService } = dataSources;
				const result = await _studService.UpdateFingerprint(
					id,
					template
				);
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		DeleteStudent: async (_, { id }, { dataSources, user }) => {
			if (user) {
				return await dataSources._studService.RemoveStudent(id);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		StudentLogin: async (_, { no, password }, { dataSources }) => {
			const { _studService, coreService } = dataSources;
			// get student by email/phone/reg no
			const student_res = await _studService.GetStudentByNo(no);
			// match the password
			const match = await coreService.ComparePasswords(
				password,
				student_res.doc.passphase
			);
			// password validation
			if (!match) return new ApolloError("Incorrect credentials!");
			// create token
			const { id, name, reg_no, email, phone, level } = student_res.doc;
			const token = coreService.GenerateToken({
				id,
				name,
				reg_no,
				email,
				phone,
				level
			});
			// return
			return {
				...student_res,
				message: "Authenticated successfully!",
				token
			};
		},
		UpdateStudentLevel: async (_, { level }, { dataSources, user }) => {
			if (user) {
				return await dataSources._studService.UpdateLevel(
					user.id,
					level
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UpdateStudentImage: async (
			_,
			{ image_path },
			{ dataSources, user }
		) => {
			if (user) {
				return await dataSources._studService.UpdateStudentImage(
					user.id,
					image_path
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		StudentCourseRegistration: async (_, __, { dataSources, user }) => {
			if (user) {
				const { departmentalCourse: courses } = __;
				const { _studService, _sService } = dataSources;
				// get student
				const student_res = await _studService.GetStudentByid(user.id);
				// get active session
				const session_res = await _sService.GetActiveSession();
				const { level } = student_res.doc;
				// Course registration
				const result = await _studService.UpdateRegisteredCourse(
					user.id,
					courses,
					session_res.doc.id,
					level
				);
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UploadStudentBiometricData: async (
			_,
			{ file },
			{ dataSources, user }
		) => {
			if (user) {
				const { _studService, helpers } = dataSources;
				// read file from request
				const { createReadStream } = await file;
				// read file content
				const data = await helpers.fileRead(createReadStream());
				if (data) {
					const json_data = JSON.parse(data);
					if (await _studService.IsFileValid(json_data)) {
						await _studService.UpdateManyFinger(json_data);
						return {
							status: 200,
							message: "Operation completed successfully"
						};
					}
				}
				return new ApolloError(
					"File not properly formatted! It must be a list containing id and fingerprint props",
					"404"
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		}
	},
	Student: {
		created_at: ({ created_at }) => new Date(created_at).toISOString(),
		fingerprint: ({ fingerPrint }) => fingerPrint,
		assigned_courses: async ({ assigned_courses }, _, { dataSources }) => {
			return await dataSources.loaders.dcLoader.loadMany(
				assigned_courses.map(x => x.toString())
			);
		},
		department: async ({ department }, _, { dataSources }) => {
			return await dataSources.loaders.departmentLoader.load(
				department.toString()
			);
		}
	},
	StudentRegisteredCourseModel: {
		session: async ({ session }, _, { dataSources }) => {
			return await dataSources.loaders.sessionLoader.load(
				session.toString()
			);
		}
	},
	StudentCourseModel: {
		course: async ({ course }, _, { dataSources }) => {
			return await dataSources.loaders.dcLoader.load(course.toString());
		},
		date: ({ date }) => new Date(date).toISOString()
	}
};

exports.resolvers = resolvers;
