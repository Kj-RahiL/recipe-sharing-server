import mongoose, { model } from "mongoose";

const groupSchema = new mongoose.Schema({
    name: String,
    description: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who joined the group
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] // Posts in the group
});


export const Group = model('group', groupSchema);