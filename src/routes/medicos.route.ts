import {Router, Request, Response, NextFunction} from 'express';
import * as database from "../database/database";
const MEDICOS = [];

export class MedicosRouter {
  router: Router

  /**
   * Initialize the MedicosRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET all Medicos.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    database.getDB().collection('medicos').find({}).toArray((err,medicos)=>{
      if(err)
        throw err;
      res.json(medicos);
    });  
    
  }

  /**
   * GET all Medicos.
   */
  public createOne(req: Request, res: Response, next: NextFunction) {
    database.getDB().collection('medicos').insert(req.body,(err,result)=>{
        if(err){
            throw err;
        }
        res.send(result.ops[0]);
    });  
    
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
    this.router.post('/', this.createOne);
    
  }

}

// Create the HeroRouter, and export its configured Express.Router
const medicosRouter = new MedicosRouter();
medicosRouter.init();

export default medicosRouter.router;