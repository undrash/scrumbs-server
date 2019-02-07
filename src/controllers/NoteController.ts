

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