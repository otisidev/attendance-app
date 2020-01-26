const { UserModel } = require("../models/user.model");
const { Types } = require("mongoose");

// local props
const Model = UserModel;
const { isValid } = Types.ObjectId;

exports.UserService = class UserService {
	async NewUser(model, password, author) {
		if (model && password) {
			const cb = await new Model({
				...model,
				passphase: password,
				author
			}).save();
			if (cb)
				return {
					status: 200,
					message: `${model.name} added successfully!`,
					doc: cb
				};
		}
		throw new Error("Invalid user object!");
	}

	async GetUser(id) {
		if (isValid(id)) {
			const query = { removed: false, _id: id };
			const cb = await Model.findOne(query).exec();
			if (cb)
				return {
					status: 200,
					message: "User found!",
					doc: cb
				};
		}
		throw new Error("User not found!");
	}

	async GetUsers(page, limit) {
		const query = { removed: false };
		const cb = await Model.paginate(query, {
			page,
			limit,
			sort: { created_at: -1 }
		});

		return {
			status: 200,
			message: "Completed!",
			...cb
		};
	}

	async GetUserByEmail(email) {
		if (email) {
			const q = {
				removed: false,
				email
			};
			const cb = await Model.findOne(q).exec();
			if (cb)
				return {
					status: 200,
					message: "User found!",
					doc: cb
				};
		}
		throw new Error("User not found!");
	}

	async UpdatePassword(id, newPwd) {
		// validation
		if (isValid(id) && newPwd) {
			// query statement
			const q = { removed: false, _id: id };
			// query execution
			const u = { $set: { passphase: newPwd } };
			const op = await Model.findOneAndUpdate(q, u, {
				new: true
			}).exec();
			if (op)
				return {
					status: 200,
					message: "Password Changed!",
					doc: op
				};
		}
		throw new Error("User not found!");
	}

	async RemoveUser(id) {
		if (isValid(id)) {
			const q = { removed: false, _id: id };
			const update = { $set: { removed: true } };
			const cb = await Model.findOneAndUpdate(q, update).exec();
			if (cb)
				return {
					status: 200,
					message: "User account removed successfully!",
					doc: { id, status: "Deleted" }
				};
		}
		throw new Error("Failed! User account not found.");
	}

	async UpdateUser(id, name) {
		if (isValid(id) && name) {
			// query state
			const q = { removed: false, _id: id };
			// query execution
			const u = { $set: { name } };
			const cb = await Model.findOneAndUpdate(q, u, { new: true }).exec();
			if (cb)
				return {
					status: 200,
					message: "Record updated successfully!",
					doc: cb
				};
		}
		throw new Error("User not found!");
	}

	async IsFirstUserAccount() {
		const q = { removed: false };
		const count = await Model.countDocuments(q).exec();
		return count === 0;
	}
};
