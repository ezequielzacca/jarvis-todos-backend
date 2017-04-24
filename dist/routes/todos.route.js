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
                            requestBody.result.parameters.todo + " added to your list, anything else?",
                            "I've just added " + requestBody.result.parameters.todo + " to your list, can i help you with something else?",
                            "Your wishes are orders, " + requestBody.result.parameters.todo + " added, any other Todo?",
                            requestBody.result.parameters.todo + " shipped right onto the list, can i do anything else for you?",
                            "Done, " + requestBody.result.parameters.todo + " was added, can i do any more things for you?",
                            "Im happy to annouce you that " + requestBody.result.parameters.todo + " was added, if you need anything else..."
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
                                "Of course, here it goes",
                                "This is your list",
                                "As requested, enjoy it",
                                "Yes, showing list right now",
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
                                "Yes but first add some, because its empty",
                                "Maybe you could add a few, right now it has zero",
                                "As requested, enjoy an empty list (?",
                                "I'd suggest you to add some, because there is no todos to show right now",
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
                                cantidad + " todos matched and removed from your list, anything else?",
                                "I've just removed " + cantidad + " todos that matched, can i help you with something else?",
                                "Your wishes are orders, " + cantidad + " todos removed",
                                cantidad + " todos finished their existence, can i do anything else for you?",
                                "Done, " + cantidad + " todos were deleted, can i do any more things for you?",
                                "Im happy to annouce you that " + cantidad + " todos were kicked from your list, if you need anything else..."
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
                                "Sorry, but i could not find any todo matching that criteria.",
                                "I've just removed... Oops, 0 todos match those words... maybe try a different term",
                                "Your wishes are orders, and i wish i could find any todo, but with those words there ar 0",
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
                                    speech: "Whoaaa take it easy man, im just a poor bot",
                                    displayText: "Whoaaa take it easy man, im just a poor bot",
                                    source: 'apiai-webhook-sample'
                                });
                            }
                            else if (sentiment.score > 0.3) {
                                return res.json({
                                    speech: "Its always great to talk with nice people",
                                    displayText: "Its always great to talk with nice people",
                                    source: 'apiai-webhook-sample'
                                });
                            }
                            else {
                                return res.json({
                                    speech: "Sorry, i dont understand",
                                    displayText: "Sorry, i dont understand",
                                    source: 'apiai-webhook-sample'
                                });
                            }
                        }
                        else {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvdG9kb3Mucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBa0U7QUFDbEUsK0NBQWlEO0FBQ2pELGlEQUFtRDtBQUduRDtJQUlFOztPQUVHO0lBQ0g7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFZCxDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQkFBTSxHQUFiLFVBQWMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUMzRCxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSztZQUMvRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQ04sTUFBTSxHQUFHLENBQUM7WUFDWixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVEOztPQUVHO0lBQ0ksOEJBQVMsR0FBaEIsVUFBaUIsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFXLGNBQWMsQ0FBQztRQUVwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLGVBQWU7Z0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQ7OzttQkFHRztnQkFFSCxFQUFFLENB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QUFELENBaFBBLEFBZ1BDLElBQUE7QUFoUFksZ0NBQVU7QUFrUHZCLG1FQUFtRTtBQUNuRSxJQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ3JDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUVuQixrQkFBZSxXQUFXLENBQUMsTUFBTSxDQUFDIiwiZmlsZSI6InJvdXRlcy90b2Rvcy5yb3V0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlciwgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgKiBhcyBkYXRhYmFzZSBmcm9tIFwiLi4vZGF0YWJhc2UvZGF0YWJhc2VcIjtcclxuaW1wb3J0ICogYXMgbGFuZ3VhZ2UgZnJvbSAnQGdvb2dsZS1jbG91ZC9sYW5ndWFnZSc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFRvZG9Sb3V0ZXIge1xyXG4gIHJvdXRlcjogUm91dGVyXHJcbiAgbGFuZ3VhZ2VDbGllbnQ6IGFueTtcclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZSB0aGUgVG9kbyBSb3V0ZXJcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMucm91dGVyID0gUm91dGVyKCk7XHJcbiAgICB0aGlzLmluaXQoKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHRVQgYWxsIFRvZG9zLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRBbGwocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5maW5kKHt9KS50b0FycmF5KChlcnIsIHRvZG9zKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpXHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICByZXMuanNvbih0b2Rvcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHRVQgYWxsIFRvZG9zLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBhcGlhaUhvb2socmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGNvbnNvbGUubG9nKFwiSG9vayBSZXF1ZXN0XCIpO1xyXG4gICAgbGV0IHNwZWVjaDogc3RyaW5nID0gJ2VtcHR5IHNwZWVjaCc7XHJcblxyXG4gICAgaWYgKHJlcS5ib2R5KSB7XHJcbiAgICAgIHZhciByZXF1ZXN0Qm9keSA9IHJlcS5ib2R5O1xyXG5cclxuICAgICAgaWYgKHJlcXVlc3RCb2R5LnJlc3VsdCkge1xyXG4gICAgICAgIC8vIHNwZWVjaCA9ICcnO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aW9uOiBcIiwgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbik7XHJcbiAgICAgICAgLyppZiAocmVxdWVzdEJvZHkucmVzdWx0LmZ1bGZpbGxtZW50KSB7XHJcbiAgICAgICAgICAgIHNwZWVjaCArPSByZXF1ZXN0Qm9keS5yZXN1bHQuZnVsZmlsbG1lbnQuc3BlZWNoO1xyXG4gICAgICAgICAgICBzcGVlY2ggKz0gJyAnO1xyXG4gICAgICAgIH0qL1xyXG5cclxuICAgICAgICBpZiAocmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbiA9PSBcImFkZF90b2RvXCIpIHtcclxuICAgICAgICAgIC8vc3BlZWNoICs9ICdhY3Rpb246ICcgKyByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJBY3Rpb24gaXMgXCIsIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24pO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJUb2RvIHRvIGFkZCBpcyBcIiwgcmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kbyk7XHJcbiAgICAgICAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykuaW5zZXJ0KHsgbm9tYnJlOiByZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvLCBjb21wbGV0YWRhOiBmYWxzZSB9LCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcG9zc2libGVBbnN3ZXJzID0gW1xyXG4gICAgICAgICAgICAgIGAke3JlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG99IGFkZGVkIHRvIHlvdXIgbGlzdCwgYW55dGhpbmcgZWxzZT9gLFxyXG4gICAgICAgICAgICAgIGBJJ3ZlIGp1c3QgYWRkZWQgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSB0byB5b3VyIGxpc3QsIGNhbiBpIGhlbHAgeW91IHdpdGggc29tZXRoaW5nIGVsc2U/YCxcclxuICAgICAgICAgICAgICBgWW91ciB3aXNoZXMgYXJlIG9yZGVycywgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSBhZGRlZCwgYW55IG90aGVyIFRvZG8/YCxcclxuICAgICAgICAgICAgICBgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSBzaGlwcGVkIHJpZ2h0IG9udG8gdGhlIGxpc3QsIGNhbiBpIGRvIGFueXRoaW5nIGVsc2UgZm9yIHlvdT9gLFxyXG4gICAgICAgICAgICAgIGBEb25lLCAke3JlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG99IHdhcyBhZGRlZCwgY2FuIGkgZG8gYW55IG1vcmUgdGhpbmdzIGZvciB5b3U/YCxcclxuICAgICAgICAgICAgICBgSW0gaGFwcHkgdG8gYW5ub3VjZSB5b3UgdGhhdCAke3JlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG99IHdhcyBhZGRlZCwgaWYgeW91IG5lZWQgYW55dGhpbmcgZWxzZS4uLmBcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICBsZXQgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVBbnN3ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmFuZG9tIHZhbHVlOiBcIiwgcmFuZG9tKTtcclxuICAgICAgICAgICAgbGV0IHNwZWVjaCA9IHBvc3NpYmxlQW5zd2Vyc1tyYW5kb21dO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgIHNwZWVjaDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uID09IFwibGlzdF90b2Rvc1wiKSB7XHJcbiAgICAgICAgICAvL3NwZWVjaCArPSAnYWN0aW9uOiAnICsgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0aW9uIGlzIFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uKTtcclxuICAgICAgICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5maW5kKHt9KS50b0FycmF5KChlcnIsIHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzdWx0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHBvc3NpYmxlQW5zd2VycyA9IFtcclxuICAgICAgICAgICAgICAgIGBPZiBjb3Vyc2UsIGhlcmUgaXQgZ29lc2AsXHJcbiAgICAgICAgICAgICAgICBgVGhpcyBpcyB5b3VyIGxpc3RgLFxyXG4gICAgICAgICAgICAgICAgYEFzIHJlcXVlc3RlZCwgZW5qb3kgaXRgLFxyXG4gICAgICAgICAgICAgICAgYFllcywgc2hvd2luZyBsaXN0IHJpZ2h0IG5vd2AsXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIGxldCBsaXN0VGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgdmFyIGNvbnRhZG9yID0gMTtcclxuICAgICAgICAgICAgICByZXN1bHRzLm1hcChyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGlzdFRleHQgKz0gYFxcbiAgICAke2NvbnRhZG9yfS4tICR7cmVzdWx0Lm5vbWJyZX1gO1xyXG4gICAgICAgICAgICAgICAgY29udGFkb3IrKztcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBsZXQgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVBbnN3ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyYW5kb20gdmFsdWU6IFwiLCByYW5kb20pO1xyXG4gICAgICAgICAgICAgIGxldCBzcGVlY2ggPSBwb3NzaWJsZUFuc3dlcnNbcmFuZG9tXSArIGxpc3RUZXh0O1xyXG4gICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBzcGVlY2g6IHNwZWVjaCxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgcG9zc2libGVBbnN3ZXJzID0gW1xyXG4gICAgICAgICAgICAgICAgYFllcyBidXQgZmlyc3QgYWRkIHNvbWUsIGJlY2F1c2UgaXRzIGVtcHR5YCxcclxuICAgICAgICAgICAgICAgIGBNYXliZSB5b3UgY291bGQgYWRkIGEgZmV3LCByaWdodCBub3cgaXQgaGFzIHplcm9gLFxyXG4gICAgICAgICAgICAgICAgYEFzIHJlcXVlc3RlZCwgZW5qb3kgYW4gZW1wdHkgbGlzdCAoP2AsXHJcbiAgICAgICAgICAgICAgICBgSSdkIHN1Z2dlc3QgeW91IHRvIGFkZCBzb21lLCBiZWNhdXNlIHRoZXJlIGlzIG5vIHRvZG9zIHRvIHNob3cgcmlnaHQgbm93YCxcclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgbGV0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQW5zd2Vycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmFuZG9tIHZhbHVlOiBcIiwgcmFuZG9tKTtcclxuICAgICAgICAgICAgICBsZXQgc3BlZWNoID0gcG9zc2libGVBbnN3ZXJzW3JhbmRvbV07XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIHNwZWVjaDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IHNwZWVjaCxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uID09IFwiZGVsZXRlX3RvZG9cIikge1xyXG4gICAgICAgICAgLy9zcGVlY2ggKz0gJ2FjdGlvbjogJyArIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb247XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGlvbiBpcyBcIiwgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbik7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvZG8gdG8gZGVsZXRlIGlzIFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvKTtcclxuICAgICAgICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5yZW1vdmUoeyAkdGV4dDogeyAkc2VhcmNoOiByZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvIH0gfSwgKGVyciwgcmVtb3ZlZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgY2FudGlkYWQgPSByZW1vdmVkLnJlc3VsdC5uO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhIGNhbnRpZGFkIGVzXCIsIGNhbnRpZGFkKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coY2FudGlkYWQgPiAwKTtcclxuICAgICAgICAgICAgaWYgKGNhbnRpZGFkID4gMCkge1xyXG4gICAgICAgICAgICAgIGxldCBwb3NzaWJsZUFuc3dlcnMgPSBbXHJcbiAgICAgICAgICAgICAgICBgJHtjYW50aWRhZH0gdG9kb3MgbWF0Y2hlZCBhbmQgcmVtb3ZlZCBmcm9tIHlvdXIgbGlzdCwgYW55dGhpbmcgZWxzZT9gLFxyXG4gICAgICAgICAgICAgICAgYEkndmUganVzdCByZW1vdmVkICR7Y2FudGlkYWR9IHRvZG9zIHRoYXQgbWF0Y2hlZCwgY2FuIGkgaGVscCB5b3Ugd2l0aCBzb21ldGhpbmcgZWxzZT9gLFxyXG4gICAgICAgICAgICAgICAgYFlvdXIgd2lzaGVzIGFyZSBvcmRlcnMsICR7Y2FudGlkYWR9IHRvZG9zIHJlbW92ZWRgLFxyXG4gICAgICAgICAgICAgICAgYCR7Y2FudGlkYWR9IHRvZG9zIGZpbmlzaGVkIHRoZWlyIGV4aXN0ZW5jZSwgY2FuIGkgZG8gYW55dGhpbmcgZWxzZSBmb3IgeW91P2AsXHJcbiAgICAgICAgICAgICAgICBgRG9uZSwgJHtjYW50aWRhZH0gdG9kb3Mgd2VyZSBkZWxldGVkLCBjYW4gaSBkbyBhbnkgbW9yZSB0aGluZ3MgZm9yIHlvdT9gLFxyXG4gICAgICAgICAgICAgICAgYEltIGhhcHB5IHRvIGFubm91Y2UgeW91IHRoYXQgJHtjYW50aWRhZH0gdG9kb3Mgd2VyZSBraWNrZWQgZnJvbSB5b3VyIGxpc3QsIGlmIHlvdSBuZWVkIGFueXRoaW5nIGVsc2UuLi5gXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIGxldCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUFuc3dlcnMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJhbmRvbSB2YWx1ZTogXCIsIHJhbmRvbSk7XHJcbiAgICAgICAgICAgICAgbGV0IHNwZWVjaCA9IHBvc3NpYmxlQW5zd2Vyc1tyYW5kb21dO1xyXG4gICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBzcGVlY2g6IHNwZWVjaCxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgcG9zc2libGVBbnN3ZXJzID0gW1xyXG4gICAgICAgICAgICAgICAgYFNvcnJ5LCBidXQgaSBjb3VsZCBub3QgZmluZCBhbnkgdG9kbyBtYXRjaGluZyB0aGF0IGNyaXRlcmlhLmAsXHJcbiAgICAgICAgICAgICAgICBgSSd2ZSBqdXN0IHJlbW92ZWQuLi4gT29wcywgMCB0b2RvcyBtYXRjaCB0aG9zZSB3b3Jkcy4uLiBtYXliZSB0cnkgYSBkaWZmZXJlbnQgdGVybWAsXHJcbiAgICAgICAgICAgICAgICBgWW91ciB3aXNoZXMgYXJlIG9yZGVycywgYW5kIGkgd2lzaCBpIGNvdWxkIGZpbmQgYW55IHRvZG8sIGJ1dCB3aXRoIHRob3NlIHdvcmRzIHRoZXJlIGFyIDBgLFxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICBsZXQgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVBbnN3ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgbGV0IHNwZWVjaCA9IHBvc3NpYmxlQW5zd2Vyc1tyYW5kb21dO1xyXG4gICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBzcGVlY2g6IHNwZWVjaCxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24gPT0gXCJpbnB1dC51bmtub3duXCIpIHtcclxuICAgICAgICAgIC8vc3BlZWNoICs9ICdhY3Rpb246ICcgKyByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uO1xyXG4gICAgICAgICAgbGV0IGlucHV0ID0gcmVxdWVzdEJvZHkucmVzdWx0LnJlc29sdmVkUXVlcnk7XHJcbiAgICAgICAgICBsZXQgbGFuZ3VhZ2VDbGllbnQgPSBsYW5ndWFnZSh7XHJcbiAgICAgICAgICAgIHByb2plY3RJZDogJ3RvZG9zYXNzaXN0YW50QHRvZG9zYXNzaXN0YW50LTE2NDkxOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbScsXHJcbiAgICAgICAgICAgIGtleUZpbGVuYW1lOiBgJHtfX2Rpcm5hbWV9Ly4uL2djbG91ZGNvbmZpZy5qc29uYFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBsZXQgZG9jdW1lbnQgPSBsYW5ndWFnZUNsaWVudC5kb2N1bWVudChpbnB1dCk7XHJcbiAgICAgICAgICBkb2N1bWVudC5kZXRlY3RTZW50aW1lbnQoZnVuY3Rpb24gKGVyciwgc2VudGltZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyOiBcIiwgZXJyKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZW50aW1lbnQ6IFwiLCBzZW50aW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbnRpbWVudCBpcyBwb3NpdGl2ZTogXCIsIHNlbnRpbWVudC5zY29yZSA+IDAuMyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VudGltZW50IGlzIG5lZ2F0aXZlOiBcIiwgc2VudGltZW50LnNjb3JlIDw9IC0wLjMpO1xyXG4gICAgICAgICAgICBpZiAoc2VudGltZW50KSB7XHJcbiAgICAgICAgICAgICAgaWYgKHNlbnRpbWVudC5zY29yZSA8PSAtMC4zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICBzcGVlY2g6IFwiV2hvYWFhIHRha2UgaXQgZWFzeSBtYW4sIGltIGp1c3QgYSBwb29yIGJvdFwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogXCJXaG9hYWEgdGFrZSBpdCBlYXN5IG1hbiwgaW0ganVzdCBhIHBvb3IgYm90XCIsXHJcbiAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZW50aW1lbnQuc2NvcmUgPiAwLjMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgIHNwZWVjaDogXCJJdHMgYWx3YXlzIGdyZWF0IHRvIHRhbGsgd2l0aCBuaWNlIHBlb3BsZVwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogXCJJdHMgYWx3YXlzIGdyZWF0IHRvIHRhbGsgd2l0aCBuaWNlIHBlb3BsZVwiLFxyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICBzcGVlY2g6IFwiU29ycnksIGkgZG9udCB1bmRlcnN0YW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIlNvcnJ5LCBpIGRvbnQgdW5kZXJzdGFuZFwiLFxyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIHNwZWVjaDogXCJTb3JyeSwgaSBkb250IHVuZGVyc3RhbmRcIixcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIlNvcnJ5LCBpIGRvbnQgdW5kZXJzdGFuZFwiLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENSRUFURSBuZXcgVG9kby5cclxuICAgKi9cclxuICBwdWJsaWMgY3JlYXRlT25lKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykuaW5zZXJ0KHJlcS5ib2R5LCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgfVxyXG4gICAgICByZXMuc2VuZChyZXN1bHQub3BzWzBdKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2UgZWFjaCBoYW5kbGVyLCBhbmQgYXR0YWNoIHRvIG9uZSBvZiB0aGUgRXhwcmVzcy5Sb3V0ZXInc1xyXG4gICAqIGVuZHBvaW50cy5cclxuICAgKi9cclxuICBpbml0KCkge1xyXG5cclxuICAgIHRoaXMucm91dGVyLmdldCgnLycsIHRoaXMuZ2V0QWxsKTtcclxuICAgIHRoaXMucm91dGVyLnBvc3QoJy8nLCB0aGlzLmNyZWF0ZU9uZSk7XHJcbiAgICB0aGlzLnJvdXRlci5wb3N0KCcvaG9vaycsIHRoaXMuYXBpYWlIb29rKTtcclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxuLy8gQ3JlYXRlIHRoZSBUb2Rvc1JvdXRlciwgYW5kIGV4cG9ydCBpdHMgY29uZmlndXJlZCBFeHByZXNzLlJvdXRlclxyXG5jb25zdCB0b2Rvc1JvdXRlciA9IG5ldyBUb2RvUm91dGVyKCk7XHJcbnRvZG9zUm91dGVyLmluaXQoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRvZG9zUm91dGVyLnJvdXRlcjsiXSwic291cmNlUm9vdCI6Ii4uIn0=
