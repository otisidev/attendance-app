// const { AuthenticationError } = require("apollo-server");

const resolvers = {
	Query: {
		GetSessions: async (_, __, { dataSources }) => {
			return await dataSources._sService.GetSessions();
		},
		GetSession: async (_, { id }, { dataSources }) => {
			return await dataSources._sService.GetSession(id);
		},
		GetActiveSession: async (_, __, { dataSources }) => {
			return await dataSources._sService.GetActiveSession();
		}
	},
	Mutation: {
		CreateSession: async (_, { model }, { dataSources }) => {
			return await dataSources._sService.NewSession(model);
		},
		UpdateSession: async (_, { id, model }, { dataSources }) => {
			return await dataSources._sService.UpdateSession(id, model);
		},
		SetActiveSession: async (_, { id }, { dataSources }) => {
			return await dataSources._sService.SetActiveSession(id);
		}
	},
	Session: {
		created_at: ({ created_at }) => new Date(created_at).toISOString()
	}
};

exports.resolvers = resolvers;
