const { gql } = require("apollo-server");

const typeDefs = gql`
	extend type Query {
		"List of user"
		GetUser("User's id" id: ID!): UserResponse!
		GetUserByEmail("User's email address" email: String!): UserResponse!
		GetUsers(
			"page number"
			page: Int
			"Maxmimum record per request"
			limit: Int
		): UserListResponse!
	}

	extend type Mutation {
		"Creates a new user account"
		NewUserAccount(
			"object containing new user props"
			model: UserInput!
		): LoginResponse!
		"Updates user's password"
		UpdateUserPassword(
			"object containing new and old password"
			model: PasswordInput!
		): UserResponse!
		"Removes a single user object"
		RemoveUserAccount("User id" id: ID!): DeletedResponse!
		"Updates user's name"
		UpdateUserAccount(
			"User id"
			id: ID!
			"New name"
			name: String!
		): UserResponse!
		"User account login"
		Login(
			"Email Address"
			email: String!
			"Password"
			password: String!
		): LoginResponse!
		"Creates new user for the first time only"
		UsersetUp(model: UserInput): LoginResponse!
	}

	"User Login Response Template"
	type LoginResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		doc: User!
		"Generated token"
		token: String!
	}
	input UserInput {
		email: String!
		password: String!
		name: String!
	}

	input PasswordInput {
		old_password: String!
		new_password: String!
	}
	"Single User response template"
	type UserResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		doc: User!
	}
	"User list response template"
	type UserListResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		docs: [User!]
		"Page number"
		page: Int
		"Maximum record per request"
		limit: Int
		"Total number of document"
		totalDocs: Int
		"Total pages"
		totalPages: Int
		"Next page number"
		nextPage: Int
		"Previous page number"
		prevPage: Int
	}

	"User object template"
	type User {
		"User id"
		id: ID!
		"User name"
		name: String!
		"User's email address"
		email: String!
		"Date created"
		created_at: String!
	}
`;

exports.typeDefs = typeDefs;
