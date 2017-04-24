"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var database = require("../database/database");
var language = require("@google-cloud/language");
var TodoRouter = (function () {
    /**
     * Initialize the Todo Router
     */
    function TodoRouter() {
        this.router = express_1.Router();
        this.init();
    }
    /**
     * GET all Todos.
     */
    TodoRouter.prototype.getAll = function (req, res, next) {
        database.getDB().collection('todos').find({}).toArray(function (err, todos) {
            if (err)
                throw err;
            res.json(todos);
        });
    };
    /**
     * GET all Todos.
     */
    TodoRouter.prototype.apiaiHook = function (req, res, next) {
        console.log("Hook Request");
        var speech = 'empty speech';
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
                    database.getDB().collection('todos').insert({ nombre: requestBody.result.parameters.todo, completada: false }, function (err, result) {
                        if (err) {
                            throw err;
                        }
                        var possibleAnswers = [
                            requestBody.result.parameters.todo + " agregada a su lista, \u00BFAlgo mas?",
                            "Acabo de agregar " + requestBody.result.parameters.todo + " a tu lista, \u00BFPuedo ayudarte con algo m\u00E1s?",
                            "Sus deseos son ordenes, " + requestBody.result.parameters.todo + " agregado, \u00BFAlguna otra tarea?",
                            requestBody.result.parameters.todo + " anotado en su lista, \u00BFTe puedo ayudar con algo m\u00E1s?",
                            "Listo, " + requestBody.result.parameters.todo + " agregado, \u00BFAlguna otra cosa?",
                            "Tengo el placer de anunciarte que " + requestBody.result.parameters.todo + " fue agregado, Avisame si necesitas algo m\u00E1s..."
                        ];
                        var random = Math.floor(Math.random() * possibleAnswers.length);
                        console.log("random value: ", random);
                        var speech = possibleAnswers[random];
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'apiai-webhook-sample'
                        });
                    });
                }
                else if (requestBody.result.action == "list_todos") {
                    //speech += 'action: ' + requestBody.result.action;
                    console.log("Action is ", requestBody.result.action);
                    database.getDB().collection('todos').find({}).toArray(function (err, results) {
                        if (err) {
                            throw err;
                        }
                        if (results.length > 0) {
                            var possibleAnswers = [
                                "Por supuesto, ahi va",
                                "Esta es tu lista",
                                "Tal como fue solicitado, tus tareas: ",
                                "Si, mostrando la lista ahora mismo",
                            ];
                            var listText_1 = "";
                            var contador = 1;
                            results.map(function (result) {
                                listText_1 += "\n    " + contador + ".- " + result.nombre;
                                contador++;
                            });
                            var random = Math.floor(Math.random() * possibleAnswers.length);
                            console.log("random value: ", random);
                            var speech_1 = possibleAnswers[random] + listText_1;
                            return res.json({
                                speech: speech_1,
                                displayText: speech_1,
                                source: 'apiai-webhook-sample'
                            });
                        }
                        else {
                            var possibleAnswers = [
                                "Por supuesto, pero primero deberas agregar alguna porque esta vacia",
                                "Quizas podrias agregar algunas, en este momento hay cero",
                                "Lamento informarte que tu lista esta vacia",
                                "Te sugiero que a\u00F1adas algunas, porque ahora mismo no hay ninguna",
                            ];
                            var random = Math.floor(Math.random() * possibleAnswers.length);
                            console.log("random value: ", random);
                            var speech_2 = possibleAnswers[random];
                            return res.json({
                                speech: speech_2,
                                displayText: speech_2,
                                source: 'apiai-webhook-sample'
                            });
                        }
                    });
                }
                else if (requestBody.result.action == "delete_todo") {
                    //speech += 'action: ' + requestBody.result.action;
                    console.log("Action is ", requestBody.result.action);
                    console.log("Todo to delete is ", requestBody.result.parameters.todo);
                    database.getDB().collection('todos').remove({ $text: { $search: requestBody.result.parameters.todo } }, function (err, removed) {
                        if (err) {
                            throw err;
                        }
                        var cantidad = removed.result.n;
                        console.log("la cantidad es", cantidad);
                        console.log(cantidad > 0);
                        if (cantidad > 0) {
                            var possibleAnswers = [
                                cantidad + " tareas conicidieron y fueron borradas, \u00BFAlgo m\u00E1s?",
                                "He borrado " + cantidad + " tareas que coincidieron, \u00BFPuedo ayudarte con algo m\u00E1s?",
                                "Tus deseos son ordenes, " + cantidad + " tareas borradas",
                                cantidad + " tareas dejaron de existir, \u00BFAlgo mas que pueda hacer por ti?",
                                "Listo, " + cantidad + " tareas borradas, \u00BFSe te ofrece algo m\u00E1s?",
                                "Es un placer comunicarte que " + cantidad + " tareas fueron expulsadas de la lista, hazme saber si necesitas algo m\u00E1s..."
                            ];
                            var random = Math.floor(Math.random() * possibleAnswers.length);
                            console.log("random value: ", random);
                            var speech_3 = possibleAnswers[random];
                            return res.json({
                                speech: speech_3,
                                displayText: speech_3,
                                source: 'apiai-webhook-sample'
                            });
                        }
                        else {
                            var possibleAnswers = [
                                "Perdon, pero no hay tareas que coincidan con eso",
                                "He borrado... Ups, ninguna tarea coincide con ese criterio... \u00BFPodemos intentar uno diferente?",
                                "Sus deseos son ordenes, Y desearia poder cumplirla, pero con ese criterio no hay ninguna tarea",
                            ];
                            var random = Math.floor(Math.random() * possibleAnswers.length);
                            var speech_4 = possibleAnswers[random];
                            return res.json({
                                speech: speech_4,
                                displayText: speech_4,
                                source: 'apiai-webhook-sample'
                            });
                        }
                    });
                }
                else if (requestBody.result.action == "input.unknown") {
                    //speech += 'action: ' + requestBody.result.action;
                    var input = requestBody.result.resolvedQuery;
                    var languageClient = language({
                        projectId: 'todosassistant@todosassistant-164919.iam.gserviceaccount.com',
                        keyFilename: __dirname + "/../gcloudconfig.json"
                    });
                    var document_1 = languageClient.document(input);
                    document_1.detectSentiment(function (err, sentiment) {
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
                            }
                            else if (sentiment.score > 0.3) {
                                return res.json({
                                    speech: "Siempre es agradable charlar con gente amable",
                                    displayText: "Siempre es agradable charlar con gente amable",
                                    source: 'apiai-webhook-sample'
                                });
                            }
                            else {
                                return res.json({
                                    speech: "¿Perdon? No entiendo lo que me pides, ¿Puedes decirlo de otra manera?",
                                    displayText: "¿Perdon? No entiendo lo que me pides, ¿Puedes decirlo de otra manera?",
                                    source: 'apiai-webhook-sample'
                                });
                            }
                        }
                        else {
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
    };
    /**
     * CREATE new Todo.
     */
    TodoRouter.prototype.createOne = function (req, res, next) {
        database.getDB().collection('todos').insert(req.body, function (err, result) {
            if (err) {
                throw err;
            }
            res.send(result.ops[0]);
        });
    };
    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    TodoRouter.prototype.init = function () {
        this.router.get('/', this.getAll);
        this.router.post('/', this.createOne);
        this.router.post('/hook', this.apiaiHook);
    };
    return TodoRouter;
}());
exports.TodoRouter = TodoRouter;
// Create the TodosRouter, and export its configured Express.Router
var todosRouter = new TodoRouter();
todosRouter.init();
exports.default = todosRouter.router;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvdG9kb3Mucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBa0U7QUFDbEUsK0NBQWlEO0FBQ2pELGlEQUFtRDtBQUduRDtJQUlFOztPQUVHO0lBQ0g7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFZCxDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQkFBTSxHQUFiLFVBQWMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUMzRCxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSztZQUMvRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQ04sTUFBTSxHQUFHLENBQUM7WUFDWixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVEOztPQUVHO0lBQ0ksOEJBQVMsR0FBaEIsVUFBaUIsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFXLGNBQWMsQ0FBQztRQUVwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLGVBQWU7Z0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQ7OzttQkFHRztnQkFFSCxFQUFFLENB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QUQsQ0FoUEEsQUFnUEMsSUFBQTtBQWhQWSxnQ0FBVTtBQWtQdkIsbUVBQW1FO0FBQ25FLElBQU0sV0FBVyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDckMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0FBRW5CLGtCQUFlLFdBQVcsQ0FBQyxNQUFNLENBQUMiLCJmaWxlIjoicm91dGVzL3RvZG9zLnJvdXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVyLCBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCAqIGFzIGRhdGFiYXNlIGZyb20gXCIuLi9kYXRhYmFzZS9kYXRhYmFzZVwiO1xyXG5pbXBvcnQgKiBhcyBsYW5ndWFnZSBmcm9tICdAZ29vZ2xlLWNsb3VkL2xhbmd1YWdlJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVG9kb1JvdXRlciB7XHJcbiAgcm91dGVyOiBSb3V0ZXJcclxuICBsYW5ndWFnZUNsaWVudDogYW55O1xyXG5cclxuICAvKipcclxuICAgKiBJbml0aWFsaXplIHRoZSBUb2RvIFJvdXRlclxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5yb3V0ZXIgPSBSb3V0ZXIoKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdFVCBhbGwgVG9kb3MuXHJcbiAgICovXHJcbiAgcHVibGljIGdldEFsbChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gICAgZGF0YWJhc2UuZ2V0REIoKS5jb2xsZWN0aW9uKCd0b2RvcycpLmZpbmQoe30pLnRvQXJyYXkoKGVyciwgdG9kb3MpID0+IHtcclxuICAgICAgaWYgKGVycilcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIHJlcy5qc29uKHRvZG9zKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdFVCBhbGwgVG9kb3MuXHJcbiAgICovXHJcbiAgcHVibGljIGFwaWFpSG9vayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gICAgY29uc29sZS5sb2coXCJIb29rIFJlcXVlc3RcIik7XHJcbiAgICBsZXQgc3BlZWNoOiBzdHJpbmcgPSAnZW1wdHkgc3BlZWNoJztcclxuXHJcbiAgICBpZiAocmVxLmJvZHkpIHtcclxuICAgICAgdmFyIHJlcXVlc3RCb2R5ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgICBpZiAocmVxdWVzdEJvZHkucmVzdWx0KSB7XHJcbiAgICAgICAgLy8gc3BlZWNoID0gJyc7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpb246IFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uKTtcclxuICAgICAgICAvKmlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuZnVsZmlsbG1lbnQpIHtcclxuICAgICAgICAgICAgc3BlZWNoICs9IHJlcXVlc3RCb2R5LnJlc3VsdC5mdWxmaWxsbWVudC5zcGVlY2g7XHJcbiAgICAgICAgICAgIHNwZWVjaCArPSAnICc7XHJcbiAgICAgICAgfSovXHJcblxyXG4gICAgICAgIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uID09IFwiYWRkX3RvZG9cIikge1xyXG4gICAgICAgICAgLy9zcGVlY2ggKz0gJ2FjdGlvbjogJyArIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb247XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGlvbiBpcyBcIiwgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbik7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvZG8gdG8gYWRkIGlzIFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvKTtcclxuICAgICAgICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5pbnNlcnQoeyBub21icmU6IHJlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG8sIGNvbXBsZXRhZGE6IGZhbHNlIH0sIChlcnIsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZUFuc3dlcnMgPSBbXHJcbiAgICAgICAgICAgICAgYCR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gYWdyZWdhZGEgYSBzdSBsaXN0YSwgwr9BbGdvIG1hcz9gLFxyXG4gICAgICAgICAgICAgIGBBY2FibyBkZSBhZ3JlZ2FyICR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gYSB0dSBsaXN0YSwgwr9QdWVkbyBheXVkYXJ0ZSBjb24gYWxnbyBtw6FzP2AsXHJcbiAgICAgICAgICAgICAgYFN1cyBkZXNlb3Mgc29uIG9yZGVuZXMsICR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gYWdyZWdhZG8sIMK/QWxndW5hIG90cmEgdGFyZWE/YCxcclxuICAgICAgICAgICAgICBgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSBhbm90YWRvIGVuIHN1IGxpc3RhLCDCv1RlIHB1ZWRvIGF5dWRhciBjb24gYWxnbyBtw6FzP2AsXHJcbiAgICAgICAgICAgICAgYExpc3RvLCAke3JlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG99IGFncmVnYWRvLCDCv0FsZ3VuYSBvdHJhIGNvc2E/YCxcclxuICAgICAgICAgICAgICBgVGVuZ28gZWwgcGxhY2VyIGRlIGFudW5jaWFydGUgcXVlICR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gZnVlIGFncmVnYWRvLCBBdmlzYW1lIHNpIG5lY2VzaXRhcyBhbGdvIG3DoXMuLi5gXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgbGV0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQW5zd2Vycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJhbmRvbSB2YWx1ZTogXCIsIHJhbmRvbSk7XHJcbiAgICAgICAgICAgIGxldCBzcGVlY2ggPSBwb3NzaWJsZUFuc3dlcnNbcmFuZG9tXTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICBzcGVlY2g6IHNwZWVjaCxcclxuICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbiA9PSBcImxpc3RfdG9kb3NcIikge1xyXG4gICAgICAgICAgLy9zcGVlY2ggKz0gJ2FjdGlvbjogJyArIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb247XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGlvbiBpcyBcIiwgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbik7XHJcbiAgICAgICAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykuZmluZCh7fSkudG9BcnJheSgoZXJyLCByZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgIGxldCBwb3NzaWJsZUFuc3dlcnMgPSBbXHJcbiAgICAgICAgICAgICAgICBgUG9yIHN1cHVlc3RvLCBhaGkgdmFgLFxyXG4gICAgICAgICAgICAgICAgYEVzdGEgZXMgdHUgbGlzdGFgLFxyXG4gICAgICAgICAgICAgICAgYFRhbCBjb21vIGZ1ZSBzb2xpY2l0YWRvLCB0dXMgdGFyZWFzOiBgLFxyXG4gICAgICAgICAgICAgICAgYFNpLCBtb3N0cmFuZG8gbGEgbGlzdGEgYWhvcmEgbWlzbW9gLFxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICBsZXQgbGlzdFRleHQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgIHZhciBjb250YWRvciA9IDE7XHJcbiAgICAgICAgICAgICAgcmVzdWx0cy5tYXAocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGxpc3RUZXh0ICs9IGBcXG4gICAgJHtjb250YWRvcn0uLSAke3Jlc3VsdC5ub21icmV9YDtcclxuICAgICAgICAgICAgICAgIGNvbnRhZG9yKys7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgbGV0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQW5zd2Vycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmFuZG9tIHZhbHVlOiBcIiwgcmFuZG9tKTtcclxuICAgICAgICAgICAgICBsZXQgc3BlZWNoID0gcG9zc2libGVBbnN3ZXJzW3JhbmRvbV0gKyBsaXN0VGV4dDtcclxuICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgc3BlZWNoOiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGV0IHBvc3NpYmxlQW5zd2VycyA9IFtcclxuICAgICAgICAgICAgICAgIGBQb3Igc3VwdWVzdG8sIHBlcm8gcHJpbWVybyBkZWJlcmFzIGFncmVnYXIgYWxndW5hIHBvcnF1ZSBlc3RhIHZhY2lhYCxcclxuICAgICAgICAgICAgICAgIGBRdWl6YXMgcG9kcmlhcyBhZ3JlZ2FyIGFsZ3VuYXMsIGVuIGVzdGUgbW9tZW50byBoYXkgY2Vyb2AsXHJcbiAgICAgICAgICAgICAgICBgTGFtZW50byBpbmZvcm1hcnRlIHF1ZSB0dSBsaXN0YSBlc3RhIHZhY2lhYCxcclxuICAgICAgICAgICAgICAgIGBUZSBzdWdpZXJvIHF1ZSBhw7FhZGFzIGFsZ3VuYXMsIHBvcnF1ZSBhaG9yYSBtaXNtbyBubyBoYXkgbmluZ3VuYWAsXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGxldCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUFuc3dlcnMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJhbmRvbSB2YWx1ZTogXCIsIHJhbmRvbSk7XHJcbiAgICAgICAgICAgICAgbGV0IHNwZWVjaCA9IHBvc3NpYmxlQW5zd2Vyc1tyYW5kb21dO1xyXG4gICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBzcGVlY2g6IHNwZWVjaCxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbiA9PSBcImRlbGV0ZV90b2RvXCIpIHtcclxuICAgICAgICAgIC8vc3BlZWNoICs9ICdhY3Rpb246ICcgKyByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJBY3Rpb24gaXMgXCIsIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24pO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJUb2RvIHRvIGRlbGV0ZSBpcyBcIiwgcmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kbyk7XHJcbiAgICAgICAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykucmVtb3ZlKHsgJHRleHQ6IHsgJHNlYXJjaDogcmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kbyB9IH0sIChlcnIsIHJlbW92ZWQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGNhbnRpZGFkID0gcmVtb3ZlZC5yZXN1bHQubjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYSBjYW50aWRhZCBlc1wiLCBjYW50aWRhZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNhbnRpZGFkID4gMCk7XHJcbiAgICAgICAgICAgIGlmIChjYW50aWRhZCA+IDApIHtcclxuICAgICAgICAgICAgICBsZXQgcG9zc2libGVBbnN3ZXJzID0gW1xyXG4gICAgICAgICAgICAgICAgYCR7Y2FudGlkYWR9IHRhcmVhcyBjb25pY2lkaWVyb24geSBmdWVyb24gYm9ycmFkYXMsIMK/QWxnbyBtw6FzP2AsXHJcbiAgICAgICAgICAgICAgICBgSGUgYm9ycmFkbyAke2NhbnRpZGFkfSB0YXJlYXMgcXVlIGNvaW5jaWRpZXJvbiwgwr9QdWVkbyBheXVkYXJ0ZSBjb24gYWxnbyBtw6FzP2AsXHJcbiAgICAgICAgICAgICAgICBgVHVzIGRlc2VvcyBzb24gb3JkZW5lcywgJHtjYW50aWRhZH0gdGFyZWFzIGJvcnJhZGFzYCxcclxuICAgICAgICAgICAgICAgIGAke2NhbnRpZGFkfSB0YXJlYXMgZGVqYXJvbiBkZSBleGlzdGlyLCDCv0FsZ28gbWFzIHF1ZSBwdWVkYSBoYWNlciBwb3IgdGk/YCxcclxuICAgICAgICAgICAgICAgIGBMaXN0bywgJHtjYW50aWRhZH0gdGFyZWFzIGJvcnJhZGFzLCDCv1NlIHRlIG9mcmVjZSBhbGdvIG3DoXM/YCxcclxuICAgICAgICAgICAgICAgIGBFcyB1biBwbGFjZXIgY29tdW5pY2FydGUgcXVlICR7Y2FudGlkYWR9IHRhcmVhcyBmdWVyb24gZXhwdWxzYWRhcyBkZSBsYSBsaXN0YSwgaGF6bWUgc2FiZXIgc2kgbmVjZXNpdGFzIGFsZ28gbcOhcy4uLmBcclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgbGV0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQW5zd2Vycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmFuZG9tIHZhbHVlOiBcIiwgcmFuZG9tKTtcclxuICAgICAgICAgICAgICBsZXQgc3BlZWNoID0gcG9zc2libGVBbnN3ZXJzW3JhbmRvbV07XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIHNwZWVjaDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IHNwZWVjaCxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxldCBwb3NzaWJsZUFuc3dlcnMgPSBbXHJcbiAgICAgICAgICAgICAgICBgUGVyZG9uLCBwZXJvIG5vIGhheSB0YXJlYXMgcXVlIGNvaW5jaWRhbiBjb24gZXNvYCxcclxuICAgICAgICAgICAgICAgIGBIZSBib3JyYWRvLi4uIFVwcywgbmluZ3VuYSB0YXJlYSBjb2luY2lkZSBjb24gZXNlIGNyaXRlcmlvLi4uIMK/UG9kZW1vcyBpbnRlbnRhciB1bm8gZGlmZXJlbnRlP2AsXHJcbiAgICAgICAgICAgICAgICBgU3VzIGRlc2VvcyBzb24gb3JkZW5lcywgWSBkZXNlYXJpYSBwb2RlciBjdW1wbGlybGEsIHBlcm8gY29uIGVzZSBjcml0ZXJpbyBubyBoYXkgbmluZ3VuYSB0YXJlYWAsXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIGxldCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUFuc3dlcnMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICBsZXQgc3BlZWNoID0gcG9zc2libGVBbnN3ZXJzW3JhbmRvbV07XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIHNwZWVjaDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IHNwZWVjaCxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbiA9PSBcImlucHV0LnVua25vd25cIikge1xyXG4gICAgICAgICAgLy9zcGVlY2ggKz0gJ2FjdGlvbjogJyArIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb247XHJcbiAgICAgICAgICBsZXQgaW5wdXQgPSByZXF1ZXN0Qm9keS5yZXN1bHQucmVzb2x2ZWRRdWVyeTtcclxuICAgICAgICAgIGxldCBsYW5ndWFnZUNsaWVudCA9IGxhbmd1YWdlKHtcclxuICAgICAgICAgICAgcHJvamVjdElkOiAndG9kb3Nhc3Npc3RhbnRAdG9kb3Nhc3Npc3RhbnQtMTY0OTE5LmlhbS5nc2VydmljZWFjY291bnQuY29tJyxcclxuICAgICAgICAgICAga2V5RmlsZW5hbWU6IGAke19fZGlybmFtZX0vLi4vZ2Nsb3VkY29uZmlnLmpzb25gXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGxldCBkb2N1bWVudCA9IGxhbmd1YWdlQ2xpZW50LmRvY3VtZW50KGlucHV0KTtcclxuICAgICAgICAgIGRvY3VtZW50LmRldGVjdFNlbnRpbWVudChmdW5jdGlvbiAoZXJyLCBzZW50aW1lbnQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnI6IFwiLCBlcnIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbnRpbWVudDogXCIsIHNlbnRpbWVudCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VudGltZW50IGlzIHBvc2l0aXZlOiBcIiwgc2VudGltZW50LnNjb3JlID4gMC4zKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZW50aW1lbnQgaXMgbmVnYXRpdmU6IFwiLCBzZW50aW1lbnQuc2NvcmUgPD0gLTAuMyk7XHJcbiAgICAgICAgICAgIGlmIChzZW50aW1lbnQpIHtcclxuICAgICAgICAgICAgICBpZiAoc2VudGltZW50LnNjb3JlIDw9IC0wLjMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgIHNwZWVjaDogXCJVaGhoIHRyYW5xdWlsbyBwb3IgZmF2b3IsIHNvbG8gc295IHVuIHNpbXBsZSByb2JvdFwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogXCJVaGhoIHRyYW5xdWlsbyBwb3IgZmF2b3IsIHNvbG8gc295IHVuIHNpbXBsZSByb2JvdFwiLFxyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VudGltZW50LnNjb3JlID4gMC4zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICBzcGVlY2g6IFwiU2llbXByZSBlcyBhZ3JhZGFibGUgY2hhcmxhciBjb24gZ2VudGUgYW1hYmxlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIlNpZW1wcmUgZXMgYWdyYWRhYmxlIGNoYXJsYXIgY29uIGdlbnRlIGFtYWJsZVwiLFxyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICBzcGVlY2g6IFwiwr9QZXJkb24/IE5vIGVudGllbmRvIGxvIHF1ZSBtZSBwaWRlcywgwr9QdWVkZXMgZGVjaXJsbyBkZSBvdHJhIG1hbmVyYT9cIixcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IFwiwr9QZXJkb24/IE5vIGVudGllbmRvIGxvIHF1ZSBtZSBwaWRlcywgwr9QdWVkZXMgZGVjaXJsbyBkZSBvdHJhIG1hbmVyYT9cIixcclxuICAgICAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBzcGVlY2g6IFwiwr9QZXJkb24/IE5vIGVudGllbmRvIGxvIHF1ZSBtZSBwaWRlcywgwr9QdWVkZXMgZGVjaXJsbyBkZSBvdHJhIG1hbmVyYT9cIixcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIsK/UGVyZG9uPyBObyBlbnRpZW5kbyBsbyBxdWUgbWUgcGlkZXMsIMK/UHVlZGVzIGRlY2lybG8gZGUgb3RyYSBtYW5lcmE/XCIsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ1JFQVRFIG5ldyBUb2RvLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGVPbmUocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5pbnNlcnQocmVxLmJvZHksIChlcnIsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9XHJcbiAgICAgIHJlcy5zZW5kKHJlc3VsdC5vcHNbMF0pO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZSBlYWNoIGhhbmRsZXIsIGFuZCBhdHRhY2ggdG8gb25lIG9mIHRoZSBFeHByZXNzLlJvdXRlcidzXHJcbiAgICogZW5kcG9pbnRzLlxyXG4gICAqL1xyXG4gIGluaXQoKSB7XHJcblxyXG4gICAgdGhpcy5yb3V0ZXIuZ2V0KCcvJywgdGhpcy5nZXRBbGwpO1xyXG4gICAgdGhpcy5yb3V0ZXIucG9zdCgnLycsIHRoaXMuY3JlYXRlT25lKTtcclxuICAgIHRoaXMucm91dGVyLnBvc3QoJy9ob29rJywgdGhpcy5hcGlhaUhvb2spO1xyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG4vLyBDcmVhdGUgdGhlIFRvZG9zUm91dGVyLCBhbmQgZXhwb3J0IGl0cyBjb25maWd1cmVkIEV4cHJlc3MuUm91dGVyXHJcbmNvbnN0IHRvZG9zUm91dGVyID0gbmV3IFRvZG9Sb3V0ZXIoKTtcclxudG9kb3NSb3V0ZXIuaW5pdCgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdG9kb3NSb3V0ZXIucm91dGVyOyJdLCJzb3VyY2VSb290IjoiLi4ifQ==
