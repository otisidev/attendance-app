const { AuthenticationError } = require("apollo-server");

const resolvers = {
	Query: {
		GetLecturers: async (_, __, { dataSources, user }) => {
			if (user) {
				return await dataSources._lecService.GetLecturers();
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetLecturersForEnrollment: async (_, __, { dataSources, user }) => {
			if (user) {
				return await dataSources._lecService.GetLecturersForEnrollment();
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetLecturer: async (_, { id }, { dataSources, user }) => {
			if (user) {
				return await dataSources._lecService.GetLecturer(id);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetLecturerByNo: async (_, { no }, { dataSources, user }) => {
			if (user) {
				return await dataSources._lecService.GetLecturerByNo(no);
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
				const { id, name, phone, reg } = __;
				return await dataSources._lecService.UpdateLecturer(
					id,
					name,
					phone,
					reg
				);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UpdateLecturerBiometric: async (_, __, { dataSources, user }) => {
			if (user) {
				const { model } = __;
				const { _lecService, _fService } = dataSources;
				const result = await _lecService.UpdateFingerprint(
					model.student,
					model.template
				);
				// await
				await _fService.LogNew(model);
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UpdateSingleLecturerBiometric: async (_, __, { dataSources, user }) => {
			if (user) {
				const { id, template } = __;
				const { _lecService } = dataSources;
				const result = await _lecService.UpdateFingerprint(
					id,
					template
				);
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		DeleteLecturer: async (_, { id }, { dataSources, user }) => {
			if (user) {
				return await dataSources._lecService.RemoveLecturer(id);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UploadLecturerBiometricData: async (
			_,
			{ file },
			{ dataSources, user }
		) => {
			if (user) {
				const { _lecService, _studService, helpers } = dataSources;
				// read file from request
				const { createReadStream } = await file;
				// read file content
				const data = await helpers.fileRead(createReadStream());
				if (data) {
					const json_data = JSON.parse(data);
					if (await _studService.IsFileValid(json_data)) {
						await _lecService.UpdateManyFinger(json_data);
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
	Lecturer: {
		created_at: ({ created_at }) => new Date(created_at).toISOString(),
		assigned_courses: async ({ assigned_courses }, _, { dataSources }) => {
			return await dataSources.loaders.dcLoader.loadMany(
				assigned_courses.map(c => c.toString())
			);
		}
	}
};

exports.resolvers = resolvers;
