// const { AuthenticationError } = require("apollo-server");

const resolvers = {
	Query: {
		getDepartments: async (_, __, { dataSources }) => {
			return await dataSources._dService.GetDepartments();
		},
		getDepartment: async (_, { id }, { dataSources }) => {
			return await dataSources._dService.GetDepartment(id);
		}
	},
	Mutation: {
		createDepartment: async (_, { name }, { dataSources }) => {
			return await dataSources._dService.NewDepartment(name);
		},
		updateDepartment: async (_, { id, name }, { dataSources }) => {
			return await dataSources._dService.UpdateDepartment(id, name);
		},
		DeleteDepartment: async (_, { id }, { dataSources }) => {
			return await dataSources._dService.RemoveDepartment(id);
		}
	},
	Department: {
		created_at: ({ created_at }) => new Date(created_at).toISOString()
	}
};

exports.resolvers = resolvers;
