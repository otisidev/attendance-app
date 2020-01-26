// const { AuthenticationError } = require("apollo-server");

const resolvers = {
	Query: {
		getSessions: async (_, __, { dataSources }) => {
			return await dataSources._sService.GetSessions();
		},
		getSession: async (_, { id }, { dataSources }) => {
			return await dataSources._sService.GetSession(id);
		},
		getActiveSession: async (_, __, { dataSources }) => {
			return await dataSources._sService.GetActiveSession();
		}
	},
	Mutation: {
		createSession: async (_, { model }, { dataSources }) => {
			return await dataSources._sService.NewSession(model);
		},
		updateSession: async (_, { id, model }, { dataSources }) => {
			return await dataSources._sService.UpdateSession(id, model);
		},
		setActiveSession: async (_, { id }, { dataSources }) => {
			return await dataSources._sService.SetActiveSession(id);
		}
	},
	Session: {
		created_at: ({ created_at }) => new Date(created_at).toISOString()
	}
};

exports.resolvers = resolvers;
