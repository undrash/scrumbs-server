

import { Router, Request, Response, NextFunction } from "express";

import Blocker from "../models/Blocker";
import Log from "../models/Log";





class BlockerController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.put( "/unsolve/:id", this.unsolveBlocker );
        this.router.put( "/solve/:id", this.solveBlocker );
        this.router.post( "/create", this.createBlocker );
        this.router.get( "/:id", this.getBlockers );
    }



    public createBlocker(req: Request, res: Response, next: NextFunction) {
        const { userId, content, label } = req.body;

        const blocker = new Blocker({
            content: content,
            owner: userId,
            label: label
        });

        blocker.save()
            .then( () => res.send( { success: true, blocker: blocker, message: "Blocker successfully created." } ) )
            .catch( next );

    }



    public getBlockers(req: Request, res: Response, next: NextFunction) {

        const userId: string = req.params.id;

        Blocker.find( { owner: userId })
            .then( (blockers) => {
                let solved = blockers.filter( (blocker) => {
                    return blocker.solved === true;
                });

                let unsolved = blockers.filter( (blocker) => {
                    return blocker.solved === false;
                });


                res.send( { success: true, solved: solved, unsolved: unsolved } );
            })
            .catch( next );
    }



    public solveBlocker(req: Request, res: Response, next: NextFunction) {
        const blockerId: string = req.params.id;

        Blocker.findById( blockerId )
            .then( (blocker) => {

                if ( ! blocker ) res.send( { success: false, message: "Blocker with id " + blockerId + " was not found in the system!" } );


                if ( ! blocker.record ) {

                    blocker.solved = true;
                    blocker.save()
                        .then( () => res.send( { success: true, blockerId: blocker._id, message: "Blocker successfully solved!" } ) );

                } else {

                    Log.findById( blocker.log )
                        .then( (log) => {
                            if ( ! log ) res.send( { success: false, message: "Log associated with blocker " + blocker._id + " not found." });

                            log.notes.filter( (note) => {
                                if ( note._id === blocker.note ) note.blocker = null;
                            });

                            blocker.solved = true;

                            Promise.all([
                                blocker.save(),
                                log.save()
                            ])
                                .then( () => res.send( { success: true, blockerId: blocker._id, message: "Blocker successfully solved!" } ) )
                        });
                }
            })
            .catch( next );
    }



    public unsolveBlocker(req: Request, res: Response, next: NextFunction) {
        const blockerId: string = req.params.id;

        Blocker.findById( blockerId )
            .then( (blocker) => {

                if ( ! blocker ) res.send( { success: false, message: "Blocker with id " + blockerId + " was not found in the system!" } );

                blocker.solved = false;

                blocker.save()
                    .then( () => res.send( { success: true, blockerId: blocker._id, message: "Blocker successfully unsolved!" } ) );

            })
            .catch( next );
    }


}



export default new BlockerController().router;