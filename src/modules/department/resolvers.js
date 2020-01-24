// const { AuthenticationError } = require("apollo-server");

const resolvers = {
	Query: {
		getDepartments: () => [
			"Computer Science",
			"Accountancy",
			"Business Management"
		]
	}
};

exports.resolvers = resolvers;
