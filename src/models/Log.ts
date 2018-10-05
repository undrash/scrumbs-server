import { Schema, model } from "mongoose";
import NoteSchema from "./Note";

const LogSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },

    record: {
        type: Schema.Types.ObjectId,
        ref: "Record"
    },

    notes: {
        type: [ NoteSchema ],
        default: []
    }

});


export default model( "Log", LogSchema );