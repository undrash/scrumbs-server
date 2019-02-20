

import { Router, Request, Response, NextFunction } from "express";
import Note from "../models/Note";





class NoteController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( "/member/:id&:batch&:limit", this.getMemberNotes );
        this.router.get( "/solved", this.getSolved );
        this.router.get( "/unsolved", this.getUnsolved );
        this.router.post( '/', this.createNote );
        this.router.put( "/solve/:id", this.solve );
        this.router.put( "/unsolve/:id", this.unsolve );
    }



    public getMemberNotes(req: Request, res: Response, next: NextFunction) {
        const id    = req.params.id;
        const batch = req.params.batch || "0" ;
        const limit = req.params.limit || "15";


        Note.find( { member: id } )
            .sort( { date: -1 } )
            .skip( parseInt( batch ) * parseInt( limit ) )
            .limit( parseInt( limit ) )
            .then( notes => res.status( 200 ).json( { success: true, notes } ) )
            .catch( next );
    }



    public getSolved(req: Request, res: Response, next: NextFunction) {
        const userId = req.app.get( "user" )._id;

        Note.find( { owner: userId, isImpediment: true, isSolved: true } )
            .populate( "member", "name _id" )
            .then( impediments => res.status( 200 ).json( { success: true, impediments } ) )
            .catch( next );
    }



    public getUnsolved(req: Request, res: Response, next: NextFunction) {
        const userId = req.app.get( "user" )._id;

        Note.find( { owner: userId, isImpediment: true, isSolved: false } )
            .populate( "member", "name _id" )
            .then( impediments => res.status( 200 ).json( { success: true, impediments } ) )
            .catch( next );
    }



    public createNote(req: Request, res: Response, next: NextFunction) {
        const userId                            = req.app.get( "user" )._id;
        const { member, content, isImpediment }    = req.body;

        const note = new Note({
            owner: userId,
            member,
            content,
            isImpediment
        });

        note.save()
            .then( note => res.status( 200 ).json( { success: true, note } ) )
            .catch( next );
    }



    public solve(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        Note.findByIdAndUpdate( id, { isSolved: true }, { "new" : true } )
            .populate( "member", "name _id" )
            .then( note => res.status( 200 ).json( { success: true, note } ) )
            .catch( next );
    }



    public unsolve(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        Note.findByIdAndUpdate( id, { isSolved: false }, { "new" : true } )
            .populate( "member", "name _id" )
            .then( note => res.status( 200 ).json( { success: true, note } ) )
            .catch( next );
    }

}



export default new NoteController().router;