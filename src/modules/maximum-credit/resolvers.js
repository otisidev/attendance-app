// const { AuthenticationError } = require("apollo-server");

const resolvers = {
	Query: {
		getMaximumCredits: async (_, __, { dataSources }) => {
			return await dataSources._mService.GetMaximumCreditUnits();
		}
	},
	Mutation: {
		createMaximumCredit: async (_, { model }, { dataSources }) => {
			return await dataSources._mService.NewMaximumCredit(model);
		},
		DeleteMaximumCredit: async (_, { id }, { dataSources }) => {
			return await dataSources._mService.RemoveRecord(id);
		}
	},
	MaximumCredit: {
		created_at: ({ created_at }) => new Date(created_at).toISOString(),
		credit_unit: ({ creditUnit }) => creditUnit
	}
};

exports.resolvers = resolvers;
