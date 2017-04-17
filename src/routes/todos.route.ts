import {Router, Request, Response, NextFunction} from 'express';
import * as database from "../database/database";


export class TodoRouter {
  router: Router

  /**
   * Initialize the Todo Router
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET all Todos.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    database.getDB().collection('todos').find({}).toArray((err,todos)=>{
      if(err)
        throw err;
      res.json(todos);
    });  
    
  }

  /**
   * CREATE new Todo.
   */
  public createOne(req: Request, res: Response, next: NextFunction) {
    database.getDB().collection('todos').insert(req.body,(err,result)=>{
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

// Create the TodosRouter, and export its configured Express.Router
const todosRouter = new TodoRouter();
todosRouter.init();

export default todosRouter.router;