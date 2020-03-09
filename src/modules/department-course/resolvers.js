const { AuthenticationError, ApolloError } = require("apollo-server");

const resolvers = {
    Query: {
        GetDepartmentalCourseList: async (_, __, { dataSources, user }) => {
            if (user) {
                const { level, dept } = __;
                return await dataSources._dcService.GetDepartmentalCourses(dept, level);
            }
            return new AuthenticationError("Unauthorized Access!");
        },
        GetDepartmentalCourse: async (_, { id }, { dataSources, user }) => {
            if (user) {
                return await dataSources._dcService.GetDepartmentalCourse(id);
            }
            return new AuthenticationError("Unauthorized Access!");
        },
        GetStudentRegisterableCourses: async (_, __, { dataSources, user }) => {
            if (user) {
                // user is meant to be student
                const { _dcService, _studService } = dataSources;
                const status = await _studService.HasRegisteredCourse(user.level, user.id);
                if (status) {
                    return new ApolloError("You've completed course registration for current session", "404");
                }
                //  get a single student
                const student_res = await _studService.GetStudentById(user.id);
                // get department
                const { department } = student_res.doc;
                const result = await _dcService.GetStudentAssignableCourses(department.id);
                return result;
            }
            return new AuthenticationError("Unauthorized Access!");
        }
    },
    Mutation: {
        NewDepartmentalCourse: async (_, { model }, { dataSources, user }) => {
            if (user) {
                return await dataSources._dcService.Create(model);
            }
            return new AuthenticationError("Unauthorized Access!");
        },
        UpdateDepartmentalCourse: async (_, __, { dataSources, user }) => {
            if (user) {
                const { id, model } = __;
                return await dataSources._dcService.UpdateModel(id, model);
            }
            return new AuthenticationError("Unauthorized Access!");
        },
        RemoveDepartmentalCourse: async (_, { id }, { dataSources, user }) => {
            if (user) {
                return await dataSources._dcService.RemoveModel(id);
            }
            return new AuthenticationError("Unauthorized Access!");
        },
        AssignToLecturer: async (_, __, { dataSources, user }) => {
            if (user) {
                const { ids, lecturer } = __;
                const result = await dataSources._dcService.AssignToLecturer(ids, lecturer);
                await dataSources._lecService.UpdateAssignedCourse(lecturer, ids);
                return result;
            }
            return new AuthenticationError("Unauthorized Access!");
        }
    },
    DepartmentalCourse: {
        created_at: ({ created_at }) => new Date(created_at).toISOString(),
        credit_unit: ({ creditUnit }) => creditUnit,
        assgined_lecturers: async ({ lecturers }, _, { dataSources }) => {
            // console.log(JSON.stringify(lecturers, null, 4));
            return await dataSources.loaders.lecturerLoader.loadMany(lecturers.map(c => c.toString()));
        },
        department: async ({ department }, _, { dataSources }) => {
            return await dataSources.loaders.departmentLoader.load(department.toString());
        }
    }
};

exports.resolvers = resolvers;
