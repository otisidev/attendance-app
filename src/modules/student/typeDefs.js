const { gql } = require("apollo-server");

const typeDefs = gql`
	extend type Query {
		"List of Student in a particular department"
		GetStudentsByDepartment(
			"Department id"
			departmental: ID!
			"Page no"
			page: Int
			"Maximum record per request"
			limit: Int
		): StudentListResponse!
		"List of Student in a the entire campus"
		GetStudents(
			"Page no"
			page: Int
			"Maximum record per request"
			limit: Int
		): StudentListResponse!
		"Gets a single Student using its' id"
		GetStudentById("Student id" id: ID!): StudentResponse!
		GetStudentByNo(
			"Student phone/email/reg no"
			id: String!
		): StudentResponse!

		"Gets a list of student that registered the same course."
		GetCoursemate: StudentListResponse!
		"Gets a list of course registered by student (current session)"
		GetRegisteredCourses: StudentRegisteredCourseResponse!
	}

	extend type Mutation {
		"Creates new Student object"
		CreateStudent(
			"Student model"
			model: StudentInput!
		): StudentLoginResponse!

		"Update a single Student object"
		UpdateStudent(
			"New Student name"
			name: String!
			"Phone number"
			phone: String!
		): StudentResponse!
		"Removes a single Student object"
		DeleteStudent("Student id" id: ID!): DeletedResponse!
		"Update a single Student's fingerprint data"
		UpdateStudentBiometric(
			"Student's id"
			id: ID!
			"Fingerprint template"
			fingerprint: ID!
		): StudentResponse!

		"Updates student current level"
		UpdateStudentLevel("Student new level" level: Int!): StudentResponse!
		"Updates student current level"
		UpdateStudentImage(
			"Student image path"
			image_path: String!
		): StudentResponse!

		StudentCourseRegistration(
			"List of departmental course id"
			departmentalCourse: [ID!]!
		): StudentResponse!

		"Student login"
		StudentLogin(
			"Student email/phone/reg no"
			no: String!
			"Password"
			password: String!
		): StudentLoginResponse!
		"Upload student biometric file"
		UploadStudentBiometricData(
			"File containing a list of id and fingerprint of students"
			file: Upload!
		): UploadResponse!
	}
	"File upload Response template"
	type UploadResponse {
		"Response status code"
		status: Int!
		"Response status message"
		message: String!
	}
	"Student input template"
	input StudentInput {
		"Student's name"
		name: String!
		"Student's email address"
		email: String!
		"Student's phone number"
		phone: String!
		"Student reg no"
		regNo: String!
		"Password"
		password: String!
		"Student's level"
		level: Int!
		"Student's department's id"
		department: ID!
		"Student passport path"
		image: String
	}

	"Student list response template"
	type StudentListResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		docs: [Student!]
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
	"Single Student response template"
	type StudentResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		doc: Student!
	}
	"Single Student Login response template"
	type StudentLoginResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		doc: Student!
		"Student login token"
		token: String!
	}

	"Student object template"
	type Student {
		"Student id"
		id: ID!
		"Student's name"
		name: String!
		"Phone number"
		phone: String!
		"email address"
		email: String!
		"Fingerprint template (Binary)"
		fingerprint: ID
		"Date created"
		created_at: String!
		"Assigned departmental course"
		assigned_courses: [DepartmentalCourse!]
		"Student password"
		image: String
		"Reg no"
		reg_no: String!
		"Department"
		department: Department
		"Student level"
		level: Int
	}

	"Student course response template"
	type StudentRegisteredCourseResponse {
		"Response status code"
		status: Int!
		"Response status message"
		message: String!
		"Response  data"
		docs: [StudentRegisteredCourseModel!]
	}

	"Stundent Registered course list template"
	type StudentRegisteredCourseModel {
		"School session and semester"
		session: Session!
		"Student level"
		level: Int!
		"List of student course within a group"
		courses: [StudentCourseModel!]
		"Total number of student course found with the group"
		total: Int!
	}
	"Student course model template"
	type StudentCourseModel {
		"Registered course id"
		id: ID
		"Date the course was registered"
		date: String!
		"Department course object"
		course: DepartmentalCourse!
	}
`;

exports.typeDefs = typeDefs;
