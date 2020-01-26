// const { AuthenticationError } = require("apollo-server");

const resolvers = {
	Query: {
		getLogs: async (_, __, { dataSources }) => {
			const { user, page, limit } = __;
			return await dataSources._lService.GetLogs(page, limit, user);
		}
	}
};

exports.resolvers = resolvers;
