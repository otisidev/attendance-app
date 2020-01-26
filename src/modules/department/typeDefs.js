const { gql } = require("apollo-server");

const typeDefs = gql`
	extend type Query {
		"List of department within the system"
		getDepartments: DepartmentListResponse!
		"Gets a single department using its' id"
		getDepartment("Department id" id: ID!): DepartmentResponse!
	}

	extend type Mutation {
		"Creates new department object"
		createDepartment("Department name" name: String!): DepartmentResponse!
		"Update a single department object"
		updateDepartment(
			"Department id"
			id: ID!
			"New department name"
			name: String!
		): DepartmentResponse!
		"Removes a single department object"
		DeleteDepartment("department id" id: ID!): DeletedResponse!
	}
	"Department list response template"
	type DepartmentListResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		docs: [Department!]
	}
	"Single department response template"
	type DepartmentResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		doc: Department!
	}

	"Department object template"
	type Department {
		"Department id"
		id: ID!
		"Department's name"
		name: String!
		"Date created"
		created_at: String!
	}

	"Object removal response template"
	type DeletedResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request body"
		doc: DeletedObject!
	}

	"Deleted reponse template"
	type DeletedObject {
		"The id of the deleted item"
		id: ID!
		"Request status"
		status: String!
	}
`;

exports.typeDefs = typeDefs;
