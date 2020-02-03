const { AuthenticationError, ApolloError } = require("apollo-server");

const resolvers = {
	Query: {
		GetUser: async (_, __, { dataSources, user }) => {
			if (user) {
				const { id } = __;
				return await dataSources._uService.GetUser(id);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetUserByEmail: async (_, { email }, { dataSources, user }) => {
			if (user) {
				return await dataSources._uService.GetUserByEmail(email);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		GetUsers: async (_, __, { dataSources, user }) => {
			if (user) {
				const { page, limit } = __;
				return await dataSources._uService.GetUsers(page, limit);
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		HasAdmin: async (_, __, { dataSources }) => {
			const status = await dataSources._uService.IsFirstUserAccount();
			return !status;
		}
	},
	Mutation: {
		NewUserAccount: async (_, { model }, { dataSources, user }) => {
			if (user) {
				const { _uService, coreService } = dataSources;
				// encrypt password
				const password = await coreService.EncryptPassword(
					model.password
				);
				// create user account
				const result = await _uService.NewUser(
					model,
					password,
					user.id
				);
				// generate token
				const token = coreService.GenerateToken({
					id: result.doc.id,
					name: result.doc.name,
					passphase: result.doc.passphase,
					email: result.doc.email
				});
				// return result
				return {
					...result,
					token
				};
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UpdateUserPassword: async (_, __, { dataSources, user }) => {
			if (user) {
				const { _uService, coreService } = dataSources;
				const { old_password, new_password } = __.model;
				// encryt old password
				const match = await coreService.ComparePasswords(
					old_password,
					user.passphase
				);
				if (match) {
					const hashed = await coreService.EncryptPassword(
						new_password
					);
					const result = await _uService.UpdatePassword(
						user.id,
						hashed
					);
					//Do some other time here

					return result;
				}
				return new ApolloError("Password do not match!", "500");
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		RemoveUser: async (_, { id }, { dataSources, user }) => {
			if (user) {
				const { _uService } = dataSources;
				const result = await _uService.RemoveUser(id);
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		UpdateUserAccount: async (_, { id, name }, { dataSources, user }) => {
			if (user) {
				const { _uService } = dataSources;
				const result = await _uService.UpdateUser(id, name);
				return result;
			}
			return new AuthenticationError("Unauthorized Access!");
		},
		Login: async (_, __, { dataSources }) => {
			const { _uService, coreService } = dataSources;
			const { email, password } = __;
			// get user by email
			const user_res = await _uService.GetUserByEmail(email);
			// get compare password
			const match = await coreService.ComparePasswords(
				password,
				user_res.doc.passphase
			);

			// generate token
			if (match) {
				const { name, email: _email, passphase, id } = user_res.doc;
				const token = coreService.GenerateToken({
					id,
					name,
					email: _email,
					passphase
				});

				return {
					...user_res,
					token,
					message: "Authenticated successfully!"
				};
			}
			return new ApolloError("Incorrect email or password!", "404");
		},
		UsersetUp: async (_, { model }, { dataSources }) => {
			const { _uService, coreService } = dataSources;
			//  check for first user
			const first = await _uService.IsFirstUserAccount();
			if (first) {
				// encrypt password
				const pass = await coreService.EncryptPassword(model.password);
				// save
				const result = await _uService.NewUser(model, pass, null);
				// generate password
				const { id, name, email, passphase } = result.doc;
				const token = coreService.GenerateToken({
					id,
					email,
					passphase,
					name
				});

				return {
					...result,
					token
				};
			}
			return new ApolloError(
				"You're not allowed to access this route!",
				"404"
			);
		}
	},
	User: {
		created_at: ({ created_at }) => new Date(created_at).toISOString()
	}
};

exports.resolvers = resolvers;
