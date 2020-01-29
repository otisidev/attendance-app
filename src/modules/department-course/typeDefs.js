const { gql } = require("apollo-server");

const typeDefs = gql`
	extend type Query {
		"List of departmental course"
		GetDepartmentalCourseList(
			"department id"
			dept: ID!
			"student's level"
			level: Int
		): DepartmentalCourseListResponse!
		"Gets a single departmental course object"
		GetDepartmentalCourse(
			"Departmental course id"
			id: ID!
		): DepartmentalCourseResponse!

		"Get Student Registerable course list"
		GetStudentRegisterableCourses: StudentDepartmentalCourseResponse!
	}

	extend type Mutation {
		"New departmental course"
		NewDepartmentalCourse(
			"New departmental course model"
			model: DepartmentalCourseInput
		): DepartmentalCourseResponse!

		"Updates a single departmental course"
		UpdateDepartmentalCourse(
			"Departmental course id"
			id: ID!
			"Departmental course update model"
			model: DepartmentalCourseInput!
		): DepartmentalCourseResponse!

		"Removes a single departmental course"
		RemoveDepartmentalCourse(
			"Departmental Course id"
			id: ID!
		): DeletedResponse!

		"Assigns a single departmental course to lecturer"
		AssignToLecturer(
			"Departmental course id"
			id: ID!
			"Lecturer's id"
			lecturer: ID!
		): DepartmentalCourseResponse!
	}

	"New Departmental course input template"
	input DepartmentalCourseInput {
		"Course title"
		title: String!
		"course code"
		code: String!
		"student level"
		level: Int!
		"Course credit unit"
		creditUnit: Int!
		"Course department (id <execute GetDepartment to see list of department and its' id>)"
		department: ID!
		"Course semester"
		semester: String!
	}
	"DepartmentalCourse list response template"
	type DepartmentalCourseListResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		docs: [DepartmentalCourse!]
	}

	"Departmental course response template"
	type DepartmentalCourseResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		doc: DepartmentalCourse!
	}

	"Departmental Course object template"
	type DepartmentalCourse {
		"Departmental Course id"
		id: ID!
		"Course title"
		title: String!
		"Course code"
		code: String!
		"Student level"
		level: Int!
		"Semester"
		semester: String!
		"Date created"
		created_at: String!
		"Department object"
		department: Department
		"List of lecturers taking the course"
		assgned_lecturers: [Lecturer]
	}

	"Student departmental course template"
	type StudentDepartmentalCourseResponse {
		"Response status code"
		status: Int!
		"Response status message"
		message: String!
		"Response data"
		docs: [StudentDepartmentalCourseModel!]
	}

	"Student Departmental course model template"
	type StudentDepartmentalCourseModel {
		"Student level"
		level: Int!
		"Student course data"
		data: [StudentDepartmentalCourseData!]
	}
	"Student course template"
	type StudentDepartmentalCourseData {
		"Semester"
		semester: String!
		"Total  course found"
		total: Int!
		"List of school course "
		courses: [StudentCourse!]
	}
	"School course template"
	type StudentCourse {
		"Departmental course id"
		id: ID!
		"course title"
		title: String!
		"course code"
		code: String!
		"course credit unit"
		credit_unit: Int!
	}
`;

exports.typeDefs = typeDefs;
