const { AuthenticationError } = require("apollo-server");

const resolvers = {
	Query: {
		GetDepartmentalCourseList: async (_, __, { dataSources, user }) => {
			if (user) {
				const { level, dept } = __;
				return await dataSources._dcService.GetDepartmentalCourses(
					dept,
					level
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetDepartmentalCourse: async (_, { id }, { dataSources, user }) => {
			if (user) {
				return await dataSources._dcService.GetDepartmentalCourse(id);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetStudentRegisterableCourses: async (_, __, { dataSources, user }) => {
			if (user) {
				// user is meant to be student
				const { _dcService, _studService } = dataSources;
				//  get a single student
				const student_res = await _studService.GetStudentByid(user.id);
				// get department
				const { department } = student_res.doc;
				const result = await _dcService.GetStudentAssignableCourses(
					department.id
				);
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		}
	},
	Mutation: {
		NewDepartmentalCourse: async (_, { model }, { dataSources, user }) => {
			if (user) {
				return await dataSources._dcService.Create(model);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UpdateDepartmentalCourse: async (_, __, { dataSources, user }) => {
			if (user) {
				const { id, model } = __;
				return await dataSources._dcService.UpdateModel(id, model);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		RemoveDepartmentalCourse: async (_, { id }, { dataSources, user }) => {
			if (user) {
				return await dataSources._dcService.RemoveModel(id);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		AssignToLecturer: async (_, __, { dataSources, user }) => {
			if (user) {
				const { ids, lecturer } = __;
				const result = await dataSources._dcService.AssignToLecturer(
					ids,
					lecturer
				);
				await dataSources._lecService.UpdateAssignedCourse(
					lecturer,
					ids
				);
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		}
	},
	DepartmentalCourse: {
		created_at: ({ created_at }) => new Date(created_at).toISOString(),
		credit_unit: ({ creditUnit }) => creditUnit,
		assgined_lecturers: ({ lecturers }) => {
			if (lecturers.some(i => typeof i !== "object")) return [];
			return lecturers;
		},
		department: ({ department }) => {
			if (typeof department !== "object") return null;
			return department;
		}
	}
};

exports.resolvers = resolvers;
