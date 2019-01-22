

import { INote } from "./interfaces/INote";
import { Schema, model } from "mongoose";





const NoteSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    member: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    },

    content: {
        type: String,
        required: true
    },

    isBlocker: {
        type: Boolean,
        default: false
    },

    isSolved: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now
    }
});


export default model<INote>( "Note", NoteSchema );