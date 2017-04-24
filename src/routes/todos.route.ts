import { Router, Request, Response, NextFunction } from 'express';
import * as database from "../database/database";
import * as language from '@google-cloud/language';


export class TodoRouter {
  router: Router
  languageClient: any;

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
    database.getDB().collection('todos').find({}).toArray((err, todos) => {
      if (err)
        throw err;
      res.json(todos);
    });

  }

  /**
   * GET all Todos.
   */
  public apiaiHook(req: Request, res: Response, next: NextFunction) {
    console.log("Hook Request");
    let speech: string = 'empty speech';

    if (req.body) {
      var requestBody = req.body;

      if (requestBody.result) {
        // speech = '';
        console.log("action: ", requestBody.result.action);
        /*if (requestBody.result.fulfillment) {
            speech += requestBody.result.fulfillment.speech;
            speech += ' ';
        }*/

        if (requestBody.result.action == "add_todo") {
          //speech += 'action: ' + requestBody.result.action;
          console.log("Action is ", requestBody.result.action);
          console.log("Todo to add is ", requestBody.result.parameters.todo);
          database.getDB().collection('todos').insert({ nombre: requestBody.result.parameters.todo, completada: false }, (err, result) => {
            if (err) {
              throw err;
            }
            let possibleAnswers = [
              `${requestBody.result.parameters.todo} added to your list, anything else?`,
              `I've just added ${requestBody.result.parameters.todo} to your list, can i help you with something else?`,
              `Your wishes are orders, ${requestBody.result.parameters.todo} added, any other Todo?`,
              `${requestBody.result.parameters.todo} shipped right onto the list, can i do anything else for you?`,
              `Done, ${requestBody.result.parameters.todo} was added, can i do any more things for you?`,
              `Im happy to annouce you that ${requestBody.result.parameters.todo} was added, if you need anything else...`
            ]
            let random = Math.floor(Math.random() * possibleAnswers.length);
            console.log("random value: ", random);
            let speech = possibleAnswers[random];
            return res.json({
              speech: speech,
              displayText: speech,
              source: 'apiai-webhook-sample'
            });
          });
        } else if (requestBody.result.action == "list_todos") {
          //speech += 'action: ' + requestBody.result.action;
          console.log("Action is ", requestBody.result.action);
          database.getDB().collection('todos').find({}).toArray((err, results) => {
            if (err) {
              throw err;
            }
            if (results.length > 0) {
              let possibleAnswers = [
                `Of course, here it goes`,
                `This is your list`,
                `As requested, enjoy it`,
                `Yes, showing list right now`,
              ]
              let listText = "";
              var contador = 1;
              results.map(result => {
                listText += `\n    ${contador}.- ${result.nombre}`;
                contador++;
              });
              let random = Math.floor(Math.random() * possibleAnswers.length);
              console.log("random value: ", random);
              let speech = possibleAnswers[random] + listText;
              return res.json({
                speech: speech,
                displayText: speech,
                source: 'apiai-webhook-sample'
              });
            } else {
              let possibleAnswers = [
                `Yes but first add some, because its empty`,
                `Maybe you could add a few, right now it has zero`,
                `As requested, enjoy an empty list (?`,
                `I'd suggest you to add some, because there is no todos to show right now`,
              ]
              
              let random = Math.floor(Math.random() * possibleAnswers.length);
              console.log("random value: ", random);
              let speech = possibleAnswers[random];
              return res.json({
                speech: speech,
                displayText: speech,
                source: 'apiai-webhook-sample'
              });
            }

          });
        } else if (requestBody.result.action == "delete_todo") {
          //speech += 'action: ' + requestBody.result.action;
          console.log("Action is ", requestBody.result.action);
          console.log("Todo to delete is ", requestBody.result.parameters.todo);
          database.getDB().collection('todos').remove({ $text: { $search: requestBody.result.parameters.todo } }, (err, removed) => {
            if (err) {
              throw err;
            }

            let cantidad = removed.result.n;
            console.log("la cantidad es", cantidad);
            console.log(cantidad > 0);
            if (cantidad > 0) {
              let possibleAnswers = [
                `${cantidad} todos matched and removed from your list, anything else?`,
                `I've just removed ${cantidad} todos that matched, can i help you with something else?`,
                `Your wishes are orders, ${cantidad} todos removed`,
                `${cantidad} todos finished their existence, can i do anything else for you?`,
                `Done, ${cantidad} todos were deleted, can i do any more things for you?`,
                `Im happy to annouce you that ${cantidad} todos were kicked from your list, if you need anything else...`
              ]
              let random = Math.floor(Math.random() * possibleAnswers.length);
              console.log("random value: ", random);
              let speech = possibleAnswers[random];
              return res.json({
                speech: speech,
                displayText: speech,
                source: 'apiai-webhook-sample'
              });
            } else {
              let possibleAnswers = [
                `Sorry, but i could not find any todo matching that criteria.`,
                `I've just removed... Oops, 0 todos match those words... maybe try a different term`,
                `Your wishes are orders, and i wish i could find any todo, but with those words there ar 0`,
              ]
              let random = Math.floor(Math.random() * possibleAnswers.length);
              let speech = possibleAnswers[random];
              return res.json({
                speech: speech,
                displayText: speech,
                source: 'apiai-webhook-sample'
              });
            }


          });
        } else if (requestBody.result.action == "input.unknown") {
          //speech += 'action: ' + requestBody.result.action;
          let input = requestBody.result.resolvedQuery;
          let languageClient = language({
            projectId: 'todosassistant@todosassistant-164919.iam.gserviceaccount.com',
            keyFilename: `${__dirname}/../gcloudconfig.json`
          });
          let document = languageClient.document(input);
          document.detectSentiment(function (err, sentiment) {
            console.log("err: ", err);
            console.log("sentiment: ", sentiment);
            console.log("sentiment is positive: ", sentiment.score > 0.3);
            console.log("sentiment is negative: ", sentiment.score <= -0.3);
            if (sentiment) {
              if (sentiment.score <= -0.3) {
                return res.json({
                  speech: "Whoaaa take it easy man, im just a poor bot",
                  displayText: "Whoaaa take it easy man, im just a poor bot",
                  source: 'apiai-webhook-sample'
                });
              } else if (sentiment.score > 0.3) {
                return res.json({
                  speech: "Its always great to talk with nice people",
                  displayText: "Its always great to talk with nice people",
                  source: 'apiai-webhook-sample'
                });
              } else {
                return res.json({
                  speech: "Sorry, i dont understand",
                  displayText: "Sorry, i dont understand",
                  source: 'apiai-webhook-sample'
                });
              }

            } else {
              return res.json({
                speech: "Sorry, i dont understand",
                displayText: "Sorry, i dont understand",
                source: 'apiai-webhook-sample'
              });
            }
          });


        }
      }
    }





  }

  /**
   * CREATE new Todo.
   */
  public createOne(req: Request, res: Response, next: NextFunction) {
    database.getDB().collection('todos').insert(req.body, (err, result) => {
      if (err) {
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