const { AuthenticationError } = require("apollo-server");

const resolvers = {
	Query: {
		GetLecturers: async (_, __, { dataSources, user }) => {
			if (user) {
				return await dataSources._lecService.GetLecturers();
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetLecturer: async (_, { id }, { dataSources, user }) => {
			if (user) {
				return await dataSources._lecService.GetLecturer(id);
			}
			return new AuthenticationError("Unauthorized Access!");
		}
	},
	Mutation: {
		CreateLecturer: async (_, { model }, { dataSources, user }) => {
			if (user) {
				return await dataSources._lecService.NewLecturer(
					model,
					user.id
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UpdateLecturer: async (_, __, { dataSources, user }) => {
			if (user) {
				const { id, name, phone } = __;
				return await dataSources._lecService.UpdateLecturer(
					id,
					name,
					phone
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UpdateLecturerBiometric: async (_, __, { dataSources, user }) => {
			if (user) {
				const { id, fingerprint: finger } = __;
				return await dataSources._lecService.UpdateFingerprint(
					id,
					finger
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		DeleteLecturer: async (_, { id }, { dataSources, user }) => {
			if (user) {
				return await dataSources._lecService.RemoveLecturer(id);
			}
			return new AuthenticationError("Unauthorized Access!");
		}
	},
	Lecturer: {
		created_at: ({ created_at }) => new Date(created_at).toISOString(),
		assigned_courses: ({ assigned_courses }) => {
			if (
				assigned_courses.length &&
				assigned_courses.some(c => typeof c !== "object")
			)
				return [];
			return assigned_courses;
		}
	}
};

exports.resolvers = resolvers;
