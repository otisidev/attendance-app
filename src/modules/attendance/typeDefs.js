const { gql } = require("apollo-server");

const typeDefs = gql`
	scalar Upload
	extend type Query {
		"Student attendance report"
		GetStudentAttendanceReport: StudentAttendanceReportResponse!
		"Lecturer attendance report"
		GetLecturerAttendanceReport(
			"lecturer id"
			lecturer: ID!
		): AttendanceListResponse!

		"Gets Departmental base attendance report"
		GetCourseAttendanceReport(
			"Departmental course id"
			id: ID
		): AttendanceListResponse!
	}

	extend type Mutation {
		"Upload attendance"
		UploadAttendance(
			"Attendance file"
			content: String!
		): AttendanceUploadResponse!
	}

	type AttendanceUploadResponse {
		"Response status code"
		status: Int!
		"Response status message"
		message: String!
		"Response body"
		doc: AttendanceUploadModel!
	}
	"New attendance upload template"
	type AttendanceUploadModel {
		"Total attendance uploaded"
		total_uploaded: Int!
		"Total attendance saved"
		total_saved: Int!
	}

	"Student attenance report template"
	type StudentAttendanceReportResponse {
		"Response status code"
		status: Int!
		"Response status message"
		message: String!
		"Response body"
		docs: [StudentAttendanceReportModel!]
	}
	"Student Attendance Report Model template"
	type StudentAttendanceReportModel {
		"Attendance Summary Model"
		attendance_summary: StudentAttendanceReport!
		"Total record"
		total: Int!
		"Departmental course object"
		course: DepartmentalCourse!
	}
	"Student Attendance Report Template"
	type StudentAttendanceReport {
		"Attendance id"
		id: ID!
		"Attendance date and time"
		date: String!
		"Boolean value indicating if student attended or not"
		present: Boolean!
		"Exemption Status"
		exempted: Boolean!
	}

	"Attendance list response template"
	type AttendanceListResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		docs: [Attendance!]
	}
	"Single Attendance response template"
	type AttendanceResponse {
		"Request status code"
		status: Int!
		"Request status message"
		message: String!
		"Request data"
		doc: Attendance!
	}

	"Attendance object template"
	type Attendance {
		"Attendance id"
		id: ID!
		"Attendance's date"
		date: String!
		"Attendance Status"
		cancelled: Boolean!
		"Attendance students list"
		students: [AttendanceStudent!]
		"Lecturer"
		lecturer: Lecturer
		"Session"
		session: Session
		"departmental course"
		departmentalCourse: DepartmentalCourse!
	}
	type AttendanceStudent {
		student: Student
		present: Boolean!
		exempted: Boolean!
	}
`;

exports.typeDefs = typeDefs;
