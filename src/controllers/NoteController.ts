

import { Router, Request, Response, NextFunction } from "express";





class NoteController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {

    }






}



export default new NoteController().router;