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
              `${requestBody.result.parameters.todo} agregada a su lista, ¿Algo mas?`,
              `Acabo de agregar ${requestBody.result.parameters.todo} a tu lista, ¿Puedo ayudarte con algo más?`,
              `Sus deseos son ordenes, ${requestBody.result.parameters.todo} agregado, ¿Alguna otra tarea?`,
              `${requestBody.result.parameters.todo} anotado en su lista, ¿Te puedo ayudar con algo más?`,
              `Listo, ${requestBody.result.parameters.todo} agregado, ¿Alguna otra cosa?`,
              `Tengo el placer de anunciarte que ${requestBody.result.parameters.todo} fue agregado, Avisame si necesitas algo más...`
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
                `Por supuesto, ahi va`,
                `Esta es tu lista`,
                `Tal como fue solicitado, tus tareas: `,
                `Si, mostrando la lista ahora mismo`,
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
                `Por supuesto, pero primero deberas agregar alguna porque esta vacia`,
                `Quizas podrias agregar algunas, en este momento hay cero`,
                `Lamento informarte que tu lista esta vacia`,
                `Te sugiero que añadas algunas, porque ahora mismo no hay ninguna`,
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
                `${cantidad} tareas conicidieron y fueron borradas, ¿Algo más?`,
                `He borrado ${cantidad} tareas que coincidieron, ¿Puedo ayudarte con algo más?`,
                `Tus deseos son ordenes, ${cantidad} tareas borradas`,
                `${cantidad} tareas dejaron de existir, ¿Algo mas que pueda hacer por ti?`,
                `Listo, ${cantidad} tareas borradas, ¿Se te ofrece algo más?`,
                `Es un placer comunicarte que ${cantidad} tareas fueron expulsadas de la lista, hazme saber si necesitas algo más...`
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
                `Perdon, pero no hay tareas que coincidan con eso`,
                `He borrado... Ups, ninguna tarea coincide con ese criterio... ¿Podemos intentar uno diferente?`,
                `Sus deseos son ordenes, Y desearia poder cumplirla, pero con ese criterio no hay ninguna tarea`,
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
                  speech: "Uhhh tranquilo por favor, solo soy un simple robot",
                  displayText: "Uhhh tranquilo por favor, solo soy un simple robot",
                  source: 'apiai-webhook-sample'
                });
              } else if (sentiment.score > 0.3) {
                return res.json({
                  speech: "Siempre es agradable charlar con gente amable",
                  displayText: "Siempre es agradable charlar con gente amable",
                  source: 'apiai-webhook-sample'
                });
              } else {
                return res.json({
                  speech: "¿Perdon? No entiendo lo que me pides, ¿Puedes decirlo de otra manera?",
                  displayText: "¿Perdon? No entiendo lo que me pides, ¿Puedes decirlo de otra manera?",
                  source: 'apiai-webhook-sample'
                });
              }

            } else {
              return res.json({
                speech: "¿Perdon? No entiendo lo que me pides, ¿Puedes decirlo de otra manera?",
                displayText: "¿Perdon? No entiendo lo que me pides, ¿Puedes decirlo de otra manera?",
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