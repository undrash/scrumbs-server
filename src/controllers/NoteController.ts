

import { Router, Request, Response, NextFunction } from "express";
import Note from "../models/Note";





class NoteController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( "/:member", this.getNotes );
        this.router.post( '/', this.createNote );
        this.router.put( "/solve/:id", this.solve );
        this.router.put( "/unsolve/:id", this.unsolve );
    }



    public getNotes(req: Request, res: Response, next: NextFunction) {
        const { member } = req.params;

        Note.find( { member } )
            .sort( { date: -1 } )
            .then( notes => res.status( 200 ).json( { success: true, notes } ) )
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
            .then( note => res.status( 200 ).json( { success: true, note } ) )
            .catch( next );
    }



    public unsolve(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        Note.findByIdAndUpdate( id, { isSolved: false }, { "new" : true } )
            .then( note => res.status( 200 ).json( { success: true, note } ) )
            .catch( next );
    }

}



export default new NoteController().router;