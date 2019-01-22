

import { Document, Schema } from "mongoose";





export interface INote extends Document {
    owner: Schema.Types.ObjectId,
    member: Schema.Types.ObjectId,
    content: string,
    isBlocker: boolean,
    isSolved: boolean,
    date: Date
}