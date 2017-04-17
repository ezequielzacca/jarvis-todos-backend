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
   * GET all Todos.
   */
  public apiaiHook(req: Request, res: Response, next: NextFunction) {
    console.log("Hook Request");   
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
               // speech = '';

                /*if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }*/

                if (requestBody.result.action == "add_todo") {
                    //speech += 'action: ' + requestBody.result.action;
                    console.log("Action is ",requestBody.result.action);
                    console.log("Todo to add is ",requestBody.result.parameters.todo);
                     database.getDB().collection('todos').insert({nombre:requestBody.result.parameters.todo,completada:false},(err,result)=>{
                        if(err){
                            throw err;
                        }
                        let possibleAnswers = [`${requestBody.result.parameters.todo} added to your list, anything else?`,`I've just added ${requestBody.result.parameters.todo} to your list, can i help you with something else?`]
                        return res.json({
                          speech: possibleAnswers[Math.floor(Math.random()*possibleAnswers.length)],
                          displayText: possibleAnswers[Math.floor(Math.random()*possibleAnswers.length)],
                          source: 'apiai-webhook-sample'
                      });
                    });  
                }
            }
        }

        
    
    
    
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
    this.router.post('/hook', this.apiaiHook);
    
  }

}

// Create the TodosRouter, and export its configured Express.Router
const todosRouter = new TodoRouter();
todosRouter.init();

export default todosRouter.router;