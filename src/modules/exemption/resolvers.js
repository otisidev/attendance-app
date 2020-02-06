const { AuthenticationError } = require("apollo-server");

const resolvers = {
	Mutation: {
		ExemptAttendance: async (_, __, { dataSources, user }) => {
			if (user) {
				// get new exemption input
				const { model } = __;
				const { _eService } = dataSources;
				return await _eService.NewExemption(model);
			}
			return new AuthenticationError("Unauthorized Access!");
		}
	},
	Query: {
		GetExemptedAttendance: async (_, { student }, { dataSources }) => {
			return await dataSources._eService.GetStudentExemptions(student);
		}
	},
	Exemption: {
		student: async ({ student }, _, { dataSources }) => {
			return await dataSources.loaders.studentLoader.load(
				student.toString()
			);
		},
		attendance: async ({ attendance }, _, { dataSources }) => {
			return await dataSources.loaders.attendanceLoader.load(
				attendance.toString()
			);
		},
		created_at: ({ created_at }) => new Date(created_at).toISOString()
	}
};

exports.resolvers = resolvers;
