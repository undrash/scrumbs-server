

import { Router, Request, Response, NextFunction } from "express";





class MemberController {

    router: Router;


    constructor() {
        this.router = Router();
        this.routes();
    }


    public routes() {

    }






}



export default new MemberController().router;