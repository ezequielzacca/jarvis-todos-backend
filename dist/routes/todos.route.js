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
                else if (requestBody.result.action == "delete_todo") {
                    //speech += 'action: ' + requestBody.result.action;
                    console.log("Action is ", requestBody.result.action);
                    console.log("Todo to delete is ", requestBody.result.parameters.todo);
                    database.getDB().collection('todos').remove({ $text: { $search: requestBody.result.parameters.todo } }, function (err, removed) {
                        if (err) {
                            throw err;
                        }
                        console.log(removed.result.n);
                        var cantidad = removed.result.n;
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
                            var speech_1 = possibleAnswers[random];
                            return res.json({
                                speech: speech_1,
                                displayText: speech_1,
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
                            var speech_2 = possibleAnswers[random];
                            return res.json({
                                speech: speech_2,
                                displayText: speech_2,
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvdG9kb3Mucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBa0U7QUFDbEUsK0NBQWlEO0FBQ2pELGlEQUFtRDtBQUduRDtJQUlFOztPQUVHO0lBQ0g7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFZCxDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQkFBTSxHQUFiLFVBQWMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUMzRCxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSztZQUMvRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQ04sTUFBTSxHQUFHLENBQUM7WUFDWixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVEOztPQUVHO0lBQ0ksOEJBQVMsR0FBaEIsVUFBaUIsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFXLGNBQWMsQ0FBQztRQUVwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLGVBQWU7Z0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQ7OzttQkFHRztnQkFFSCxFQUFFLENB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Ozs7T0FHRztJQUNILHlCQUFJLEdBQUo7UUFFRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUU1QyxDQUFDO0lBRUgsaUJBQUM7QUFBRCxDQS9MQSxBQStMQyxJQUFBO0FBL0xZLGdDQUFVO0FBaU12QixtRUFBbUU7QUFDbkUsSUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNyQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFbkIsa0JBQWUsV0FBVyxDQUFDLE1BQU0sQ0FBQyIsImZpbGUiOiJyb3V0ZXMvdG9kb3Mucm91dGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIsIFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJztcclxuaW1wb3J0ICogYXMgZGF0YWJhc2UgZnJvbSBcIi4uL2RhdGFiYXNlL2RhdGFiYXNlXCI7XHJcbmltcG9ydCAqIGFzIGxhbmd1YWdlIGZyb20gJ0Bnb29nbGUtY2xvdWQvbGFuZ3VhZ2UnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2RvUm91dGVyIHtcclxuICByb3V0ZXI6IFJvdXRlclxyXG4gIGxhbmd1YWdlQ2xpZW50OiBhbnk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWxpemUgdGhlIFRvZG8gUm91dGVyXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnJvdXRlciA9IFJvdXRlcigpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR0VUIGFsbCBUb2Rvcy5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0QWxsKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykuZmluZCh7fSkudG9BcnJheSgoZXJyLCB0b2RvcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKVxyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgcmVzLmpzb24odG9kb3MpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR0VUIGFsbCBUb2Rvcy5cclxuICAgKi9cclxuICBwdWJsaWMgYXBpYWlIb29rKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkhvb2sgUmVxdWVzdFwiKTtcclxuICAgIGxldCBzcGVlY2g6IHN0cmluZyA9ICdlbXB0eSBzcGVlY2gnO1xyXG5cclxuICAgIGlmIChyZXEuYm9keSkge1xyXG4gICAgICB2YXIgcmVxdWVzdEJvZHkgPSByZXEuYm9keTtcclxuXHJcbiAgICAgIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQpIHtcclxuICAgICAgICAvLyBzcGVlY2ggPSAnJztcclxuICAgICAgICBjb25zb2xlLmxvZyhcImFjdGlvbjogXCIsIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24pO1xyXG4gICAgICAgIC8qaWYgKHJlcXVlc3RCb2R5LnJlc3VsdC5mdWxmaWxsbWVudCkge1xyXG4gICAgICAgICAgICBzcGVlY2ggKz0gcmVxdWVzdEJvZHkucmVzdWx0LmZ1bGZpbGxtZW50LnNwZWVjaDtcclxuICAgICAgICAgICAgc3BlZWNoICs9ICcgJztcclxuICAgICAgICB9Ki9cclxuXHJcbiAgICAgICAgaWYgKHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24gPT0gXCJhZGRfdG9kb1wiKSB7XHJcbiAgICAgICAgICAvL3NwZWVjaCArPSAnYWN0aW9uOiAnICsgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0aW9uIGlzIFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiVG9kbyB0byBhZGQgaXMgXCIsIHJlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG8pO1xyXG4gICAgICAgICAgZGF0YWJhc2UuZ2V0REIoKS5jb2xsZWN0aW9uKCd0b2RvcycpLmluc2VydCh7IG5vbWJyZTogcmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kbywgY29tcGxldGFkYTogZmFsc2UgfSwgKGVyciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHBvc3NpYmxlQW5zd2VycyA9IFtcclxuICAgICAgICAgICAgICBgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSBhZGRlZCB0byB5b3VyIGxpc3QsIGFueXRoaW5nIGVsc2U/YCxcclxuICAgICAgICAgICAgICBgSSd2ZSBqdXN0IGFkZGVkICR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gdG8geW91ciBsaXN0LCBjYW4gaSBoZWxwIHlvdSB3aXRoIHNvbWV0aGluZyBlbHNlP2AsXHJcbiAgICAgICAgICAgICAgYFlvdXIgd2lzaGVzIGFyZSBvcmRlcnMsICR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gYWRkZWQsIGFueSBvdGhlciBUb2RvP2AsXHJcbiAgICAgICAgICAgICAgYCR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gc2hpcHBlZCByaWdodCBvbnRvIHRoZSBsaXN0LCBjYW4gaSBkbyBhbnl0aGluZyBlbHNlIGZvciB5b3U/YCxcclxuICAgICAgICAgICAgICBgRG9uZSwgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSB3YXMgYWRkZWQsIGNhbiBpIGRvIGFueSBtb3JlIHRoaW5ncyBmb3IgeW91P2AsXHJcbiAgICAgICAgICAgICAgYEltIGhhcHB5IHRvIGFubm91Y2UgeW91IHRoYXQgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSB3YXMgYWRkZWQsIGlmIHlvdSBuZWVkIGFueXRoaW5nIGVsc2UuLi5gXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgbGV0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQW5zd2Vycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJhbmRvbSB2YWx1ZTogXCIsIHJhbmRvbSk7XHJcbiAgICAgICAgICAgIGxldCBzcGVlY2ggPSBwb3NzaWJsZUFuc3dlcnNbcmFuZG9tXTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICBzcGVlY2g6IHNwZWVjaCxcclxuICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbiA9PSBcImRlbGV0ZV90b2RvXCIpIHtcclxuICAgICAgICAgIC8vc3BlZWNoICs9ICdhY3Rpb246ICcgKyByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJBY3Rpb24gaXMgXCIsIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24pO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJUb2RvIHRvIGRlbGV0ZSBpcyBcIiwgcmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kbyk7XHJcbiAgICAgICAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykucmVtb3ZlKHsgJHRleHQ6IHsgJHNlYXJjaDogcmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kbyB9IH0sIChlcnIsIHJlbW92ZWQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZW1vdmVkLnJlc3VsdC5uKTtcclxuICAgICAgICAgICAgbGV0IGNhbnRpZGFkID0gcmVtb3ZlZC5yZXN1bHQubjtcclxuICAgICAgICAgICAgaWYgKGNhbnRpZGFkID4gMCkge1xyXG4gICAgICAgICAgICAgIGxldCBwb3NzaWJsZUFuc3dlcnMgPSBbXHJcbiAgICAgICAgICAgICAgICBgJHtjYW50aWRhZH0gdG9kb3MgbWF0Y2hlZCBhbmQgcmVtb3ZlZCBmcm9tIHlvdXIgbGlzdCwgYW55dGhpbmcgZWxzZT9gLFxyXG4gICAgICAgICAgICAgICAgYEkndmUganVzdCByZW1vdmVkICR7Y2FudGlkYWR9IHRvZG9zIHRoYXQgbWF0Y2hlZCwgY2FuIGkgaGVscCB5b3Ugd2l0aCBzb21ldGhpbmcgZWxzZT9gLFxyXG4gICAgICAgICAgICAgICAgYFlvdXIgd2lzaGVzIGFyZSBvcmRlcnMsICR7Y2FudGlkYWR9IHRvZG9zIHJlbW92ZWRgLFxyXG4gICAgICAgICAgICAgICAgYCR7Y2FudGlkYWR9IHRvZG9zIGZpbmlzaGVkIHRoZWlyIGV4aXN0ZW5jZSwgY2FuIGkgZG8gYW55dGhpbmcgZWxzZSBmb3IgeW91P2AsXHJcbiAgICAgICAgICAgICAgICBgRG9uZSwgJHtjYW50aWRhZH0gdG9kb3Mgd2VyZSBkZWxldGVkLCBjYW4gaSBkbyBhbnkgbW9yZSB0aGluZ3MgZm9yIHlvdT9gLFxyXG4gICAgICAgICAgICAgICAgYEltIGhhcHB5IHRvIGFubm91Y2UgeW91IHRoYXQgJHtjYW50aWRhZH0gdG9kb3Mgd2VyZSBraWNrZWQgZnJvbSB5b3VyIGxpc3QsIGlmIHlvdSBuZWVkIGFueXRoaW5nIGVsc2UuLi5gXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgIGxldCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUFuc3dlcnMubGVuZ3RoKTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJhbmRvbSB2YWx1ZTogXCIsIHJhbmRvbSk7XHJcbiAgICAgICAgICAgICAgbGV0IHNwZWVjaCA9IHBvc3NpYmxlQW5zd2Vyc1tyYW5kb21dO1xyXG4gICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBzcGVlY2g6IHNwZWVjaCxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgcG9zc2libGVBbnN3ZXJzID0gW1xyXG4gICAgICAgICAgICAgICAgYFNvcnJ5LCBidXQgaSBjb3VsZCBub3QgZmluZCBhbnkgdG9kbyBtYXRjaGluZyB0aGF0IGNyaXRlcmlhLmAsXHJcbiAgICAgICAgICAgICAgICBgSSd2ZSBqdXN0IHJlbW92ZWQuLi4gT29wcywgMCB0b2RvcyBtYXRjaCB0aG9zZSB3b3Jkcy4uLiBtYXliZSB0cnkgYSBkaWZmZXJlbnQgdGVybWAsXHJcbiAgICAgICAgICAgICAgICBgWW91ciB3aXNoZXMgYXJlIG9yZGVycywgYW5kIGkgd2lzaCBpIGNvdWxkIGZpbmQgYW55IHRvZG8sIGJ1dCB3aXRoIHRob3NlIHdvcmRzIHRoZXJlIGFyIDBgLFxyXG4gICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICBsZXQgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVBbnN3ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgbGV0IHNwZWVjaCA9IHBvc3NpYmxlQW5zd2Vyc1tyYW5kb21dO1xyXG4gICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBzcGVlY2g6IHNwZWVjaCxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24gPT0gXCJpbnB1dC51bmtub3duXCIpIHtcclxuICAgICAgICAgIC8vc3BlZWNoICs9ICdhY3Rpb246ICcgKyByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uO1xyXG4gICAgICAgICAgbGV0IGlucHV0ID0gcmVxdWVzdEJvZHkucmVzdWx0LnJlc29sdmVkUXVlcnk7XHJcbiAgICAgICAgICBsZXQgbGFuZ3VhZ2VDbGllbnQgPSBsYW5ndWFnZSh7XHJcbiAgICAgICAgICAgIHByb2plY3RJZDogJ3RvZG9zYXNzaXN0YW50QHRvZG9zYXNzaXN0YW50LTE2NDkxOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbScsXHJcbiAgICAgICAgICAgIGtleUZpbGVuYW1lOiBgJHtfX2Rpcm5hbWV9Ly4uL2djbG91ZGNvbmZpZy5qc29uYFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBsZXQgZG9jdW1lbnQgPSBsYW5ndWFnZUNsaWVudC5kb2N1bWVudChpbnB1dCk7XHJcbiAgICAgICAgICBkb2N1bWVudC5kZXRlY3RTZW50aW1lbnQoZnVuY3Rpb24gKGVyciwgc2VudGltZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyOiBcIiwgZXJyKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZW50aW1lbnQ6IFwiLCBzZW50aW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbnRpbWVudCBpcyBwb3NpdGl2ZTogXCIsIHNlbnRpbWVudC5zY29yZSA+IDAuMyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VudGltZW50IGlzIG5lZ2F0aXZlOiBcIiwgc2VudGltZW50LnNjb3JlIDw9IC0wLjMpO1xyXG4gICAgICAgICAgICBpZiAoc2VudGltZW50KSB7XHJcbiAgICAgICAgICAgICAgaWYgKHNlbnRpbWVudC5zY29yZSA8PSAtMC4zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICBzcGVlY2g6IFwiV2hvYWFhIHRha2UgaXQgZWFzeSBtYW4sIGltIGp1c3QgYSBwb29yIGJvdFwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogXCJXaG9hYWEgdGFrZSBpdCBlYXN5IG1hbiwgaW0ganVzdCBhIHBvb3IgYm90XCIsXHJcbiAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZW50aW1lbnQuc2NvcmUgPiAwLjMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgIHNwZWVjaDogXCJJdHMgYWx3YXlzIGdyZWF0IHRvIHRhbGsgd2l0aCBuaWNlIHBlb3BsZVwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogXCJJdHMgYWx3YXlzIGdyZWF0IHRvIHRhbGsgd2l0aCBuaWNlIHBlb3BsZVwiLFxyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICBzcGVlY2g6IFwiU29ycnksIGkgZG9udCB1bmRlcnN0YW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIlNvcnJ5LCBpIGRvbnQgdW5kZXJzdGFuZFwiLFxyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIHNwZWVjaDogXCJTb3JyeSwgaSBkb250IHVuZGVyc3RhbmRcIixcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIlNvcnJ5LCBpIGRvbnQgdW5kZXJzdGFuZFwiLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENSRUFURSBuZXcgVG9kby5cclxuICAgKi9cclxuICBwdWJsaWMgY3JlYXRlT25lKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykuaW5zZXJ0KHJlcS5ib2R5LCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgfVxyXG4gICAgICByZXMuc2VuZChyZXN1bHQub3BzWzBdKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2UgZWFjaCBoYW5kbGVyLCBhbmQgYXR0YWNoIHRvIG9uZSBvZiB0aGUgRXhwcmVzcy5Sb3V0ZXInc1xyXG4gICAqIGVuZHBvaW50cy5cclxuICAgKi9cclxuICBpbml0KCkge1xyXG5cclxuICAgIHRoaXMucm91dGVyLmdldCgnLycsIHRoaXMuZ2V0QWxsKTtcclxuICAgIHRoaXMucm91dGVyLnBvc3QoJy8nLCB0aGlzLmNyZWF0ZU9uZSk7XHJcbiAgICB0aGlzLnJvdXRlci5wb3N0KCcvaG9vaycsIHRoaXMuYXBpYWlIb29rKTtcclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxuLy8gQ3JlYXRlIHRoZSBUb2Rvc1JvdXRlciwgYW5kIGV4cG9ydCBpdHMgY29uZmlndXJlZCBFeHByZXNzLlJvdXRlclxyXG5jb25zdCB0b2Rvc1JvdXRlciA9IG5ldyBUb2RvUm91dGVyKCk7XHJcbnRvZG9zUm91dGVyLmluaXQoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRvZG9zUm91dGVyLnJvdXRlcjsiXSwic291cmNlUm9vdCI6Ii4uIn0=
