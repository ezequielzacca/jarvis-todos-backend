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
                            speech = possibleAnswers[random];
                        }
                        else {
                            var possibleAnswers = [
                                "Sorry, but i could not find any todo matching that criteria.",
                                "I've just removed... Oops, 0 todos match those words... maybe try a different term",
                                "Your wishes are orders, and i wish i could find any todo, but with those words there ar 0",
                            ];
                            var random = Math.floor(Math.random() * possibleAnswers.length);
                            speech = possibleAnswers[random];
                        }
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'apiai-webhook-sample'
                        });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvdG9kb3Mucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBa0U7QUFDbEUsK0NBQWlEO0FBQ2pELGlEQUFtRDtBQUduRDtJQUlFOztPQUVHO0lBQ0g7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFZCxDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQkFBTSxHQUFiLFVBQWMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUMzRCxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSztZQUMvRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQ04sTUFBTSxHQUFHLENBQUM7WUFDWixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVEOztPQUVHO0lBQ0ksOEJBQVMsR0FBaEIsVUFBaUIsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFVLGNBQWMsQ0FBQztRQUVuQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLGVBQWU7Z0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQ7OzttQkFHRztnQkFFSCxFQUFFLENB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QUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFNUMsQ0FBQztJQUVILGlCQUFDO0FBQUQsQ0F6TEEsQUF5TEMsSUFBQTtBQXpMWSxnQ0FBVTtBQTJMdkIsbUVBQW1FO0FBQ25FLElBQU0sV0FBVyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDckMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0FBRW5CLGtCQUFlLFdBQVcsQ0FBQyxNQUFNLENBQUMiLCJmaWxlIjoicm91dGVzL3RvZG9zLnJvdXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVyLCBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCAqIGFzIGRhdGFiYXNlIGZyb20gXCIuLi9kYXRhYmFzZS9kYXRhYmFzZVwiO1xyXG5pbXBvcnQgKiBhcyBsYW5ndWFnZSBmcm9tICdAZ29vZ2xlLWNsb3VkL2xhbmd1YWdlJztcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVG9kb1JvdXRlciB7XHJcbiAgcm91dGVyOiBSb3V0ZXJcclxuICBsYW5ndWFnZUNsaWVudDogYW55O1xyXG5cclxuICAvKipcclxuICAgKiBJbml0aWFsaXplIHRoZSBUb2RvIFJvdXRlclxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5yb3V0ZXIgPSBSb3V0ZXIoKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdFVCBhbGwgVG9kb3MuXHJcbiAgICovXHJcbiAgcHVibGljIGdldEFsbChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gICAgZGF0YWJhc2UuZ2V0REIoKS5jb2xsZWN0aW9uKCd0b2RvcycpLmZpbmQoe30pLnRvQXJyYXkoKGVyciwgdG9kb3MpID0+IHtcclxuICAgICAgaWYgKGVycilcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIHJlcy5qc29uKHRvZG9zKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdFVCBhbGwgVG9kb3MuXHJcbiAgICovXHJcbiAgcHVibGljIGFwaWFpSG9vayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gICAgY29uc29sZS5sb2coXCJIb29rIFJlcXVlc3RcIik7XHJcbiAgICBsZXQgc3BlZWNoOnN0cmluZyA9ICdlbXB0eSBzcGVlY2gnO1xyXG5cclxuICAgIGlmIChyZXEuYm9keSkge1xyXG4gICAgICB2YXIgcmVxdWVzdEJvZHkgPSByZXEuYm9keTtcclxuXHJcbiAgICAgIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQpIHtcclxuICAgICAgICAvLyBzcGVlY2ggPSAnJztcclxuICAgICAgICBjb25zb2xlLmxvZyhcImFjdGlvbjogXCIsIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24pO1xyXG4gICAgICAgIC8qaWYgKHJlcXVlc3RCb2R5LnJlc3VsdC5mdWxmaWxsbWVudCkge1xyXG4gICAgICAgICAgICBzcGVlY2ggKz0gcmVxdWVzdEJvZHkucmVzdWx0LmZ1bGZpbGxtZW50LnNwZWVjaDtcclxuICAgICAgICAgICAgc3BlZWNoICs9ICcgJztcclxuICAgICAgICB9Ki9cclxuXHJcbiAgICAgICAgaWYgKHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24gPT0gXCJhZGRfdG9kb1wiKSB7XHJcbiAgICAgICAgICAvL3NwZWVjaCArPSAnYWN0aW9uOiAnICsgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0aW9uIGlzIFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiVG9kbyB0byBhZGQgaXMgXCIsIHJlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG8pO1xyXG4gICAgICAgICAgZGF0YWJhc2UuZ2V0REIoKS5jb2xsZWN0aW9uKCd0b2RvcycpLmluc2VydCh7IG5vbWJyZTogcmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kbywgY29tcGxldGFkYTogZmFsc2UgfSwgKGVyciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHBvc3NpYmxlQW5zd2VycyA9IFtcclxuICAgICAgICAgICAgICAgIGAke3JlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG99IGFkZGVkIHRvIHlvdXIgbGlzdCwgYW55dGhpbmcgZWxzZT9gLFxyXG4gICAgICAgICAgICAgICAgYEkndmUganVzdCBhZGRlZCAke3JlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG99IHRvIHlvdXIgbGlzdCwgY2FuIGkgaGVscCB5b3Ugd2l0aCBzb21ldGhpbmcgZWxzZT9gLFxyXG4gICAgICAgICAgICAgICAgYFlvdXIgd2lzaGVzIGFyZSBvcmRlcnMsICR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gYWRkZWQsIGFueSBvdGhlciBUb2RvP2AsXHJcbiAgICAgICAgICAgICAgICBgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSBzaGlwcGVkIHJpZ2h0IG9udG8gdGhlIGxpc3QsIGNhbiBpIGRvIGFueXRoaW5nIGVsc2UgZm9yIHlvdT9gLFxyXG4gICAgICAgICAgICAgICAgYERvbmUsICR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gd2FzIGFkZGVkLCBjYW4gaSBkbyBhbnkgbW9yZSB0aGluZ3MgZm9yIHlvdT9gLFxyXG4gICAgICAgICAgICAgICAgYEltIGhhcHB5IHRvIGFubm91Y2UgeW91IHRoYXQgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSB3YXMgYWRkZWQsIGlmIHlvdSBuZWVkIGFueXRoaW5nIGVsc2UuLi5gXHJcbiAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgbGV0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQW5zd2Vycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJhbmRvbSB2YWx1ZTogXCIsIHJhbmRvbSk7XHJcbiAgICAgICAgICAgIGxldCBzcGVlY2ggPSBwb3NzaWJsZUFuc3dlcnNbcmFuZG9tXTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICBzcGVlY2g6IHNwZWVjaCxcclxuICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1lbHNlIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uID09IFwiZGVsZXRlX3RvZG9cIikge1xyXG4gICAgICAgICAgLy9zcGVlY2ggKz0gJ2FjdGlvbjogJyArIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb247XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGlvbiBpcyBcIiwgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbik7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvZG8gdG8gZGVsZXRlIGlzIFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvKTtcclxuICAgICAgICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5yZW1vdmUoeyR0ZXh0Onskc2VhcmNoOnJlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG99fSwgKGVyciwgcmVtb3ZlZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlbW92ZWQucmVzdWx0Lm4pO1xyXG4gICAgICAgICAgICBsZXQgY2FudGlkYWQgPSByZW1vdmVkLnJlc3VsdC5uO1xyXG4gICAgICAgICAgICBpZihjYW50aWRhZD4wKXtcclxuICAgICAgICAgICAgICBsZXQgcG9zc2libGVBbnN3ZXJzID0gW1xyXG4gICAgICAgICAgICAgICAgYCR7Y2FudGlkYWR9IHRvZG9zIG1hdGNoZWQgYW5kIHJlbW92ZWQgZnJvbSB5b3VyIGxpc3QsIGFueXRoaW5nIGVsc2U/YCxcclxuICAgICAgICAgICAgICAgIGBJJ3ZlIGp1c3QgcmVtb3ZlZCAke2NhbnRpZGFkfSB0b2RvcyB0aGF0IG1hdGNoZWQsIGNhbiBpIGhlbHAgeW91IHdpdGggc29tZXRoaW5nIGVsc2U/YCxcclxuICAgICAgICAgICAgICAgIGBZb3VyIHdpc2hlcyBhcmUgb3JkZXJzLCAke2NhbnRpZGFkfSB0b2RvcyByZW1vdmVkYCxcclxuICAgICAgICAgICAgICAgIGAke2NhbnRpZGFkfSB0b2RvcyBmaW5pc2hlZCB0aGVpciBleGlzdGVuY2UsIGNhbiBpIGRvIGFueXRoaW5nIGVsc2UgZm9yIHlvdT9gLFxyXG4gICAgICAgICAgICAgICAgYERvbmUsICR7Y2FudGlkYWR9IHRvZG9zIHdlcmUgZGVsZXRlZCwgY2FuIGkgZG8gYW55IG1vcmUgdGhpbmdzIGZvciB5b3U/YCxcclxuICAgICAgICAgICAgICAgIGBJbSBoYXBweSB0byBhbm5vdWNlIHlvdSB0aGF0ICR7Y2FudGlkYWR9IHRvZG9zIHdlcmUga2lja2VkIGZyb20geW91ciBsaXN0LCBpZiB5b3UgbmVlZCBhbnl0aGluZyBlbHNlLi4uYFxyXG4gICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIGxldCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUFuc3dlcnMubGVuZ3RoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyYW5kb20gdmFsdWU6IFwiLCByYW5kb20pO1xyXG4gICAgICAgICAgICBzcGVlY2ggPSBwb3NzaWJsZUFuc3dlcnNbcmFuZG9tXTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgbGV0IHBvc3NpYmxlQW5zd2VycyA9IFtcclxuICAgICAgICAgICAgICAgIGBTb3JyeSwgYnV0IGkgY291bGQgbm90IGZpbmQgYW55IHRvZG8gbWF0Y2hpbmcgdGhhdCBjcml0ZXJpYS5gLFxyXG4gICAgICAgICAgICAgICAgYEkndmUganVzdCByZW1vdmVkLi4uIE9vcHMsIDAgdG9kb3MgbWF0Y2ggdGhvc2Ugd29yZHMuLi4gbWF5YmUgdHJ5IGEgZGlmZmVyZW50IHRlcm1gLFxyXG4gICAgICAgICAgICAgICAgYFlvdXIgd2lzaGVzIGFyZSBvcmRlcnMsIGFuZCBpIHdpc2ggaSBjb3VsZCBmaW5kIGFueSB0b2RvLCBidXQgd2l0aCB0aG9zZSB3b3JkcyB0aGVyZSBhciAwYCxcclxuICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICBsZXQgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVBbnN3ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgIHNwZWVjaCA9IHBvc3NpYmxlQW5zd2Vyc1tyYW5kb21dO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgIHNwZWVjaDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uID09IFwiaW5wdXQudW5rbm93blwiKSB7XHJcbiAgICAgICAgICAvL3NwZWVjaCArPSAnYWN0aW9uOiAnICsgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbjtcclxuICAgICAgICAgIGxldCBpbnB1dCA9IHJlcXVlc3RCb2R5LnJlc3VsdC5yZXNvbHZlZFF1ZXJ5O1xyXG4gICAgICAgICAgbGV0IGxhbmd1YWdlQ2xpZW50ID0gbGFuZ3VhZ2Uoe1xyXG4gICAgICAgICAgICBwcm9qZWN0SWQ6ICd0b2Rvc2Fzc2lzdGFudEB0b2Rvc2Fzc2lzdGFudC0xNjQ5MTkuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20nLFxyXG4gICAgICAgICAgICBrZXlGaWxlbmFtZTogYCR7X19kaXJuYW1lfS8uLi9nY2xvdWRjb25maWcuanNvbmBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgbGV0IGRvY3VtZW50ID0gbGFuZ3VhZ2VDbGllbnQuZG9jdW1lbnQoaW5wdXQpO1xyXG4gICAgICAgICAgZG9jdW1lbnQuZGV0ZWN0U2VudGltZW50KGZ1bmN0aW9uIChlcnIsIHNlbnRpbWVudCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycjogXCIsZXJyKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZW50aW1lbnQ6IFwiLHNlbnRpbWVudCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VudGltZW50IGlzIHBvc2l0aXZlOiBcIixzZW50aW1lbnQuc2NvcmUgPiAwLjMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbnRpbWVudCBpcyBuZWdhdGl2ZTogXCIsc2VudGltZW50LnNjb3JlIDw9IC0wLjMpO1xyXG4gICAgICAgICAgICBpZiAoc2VudGltZW50KSB7XHJcbiAgICAgICAgICAgICAgaWYgKHNlbnRpbWVudC5zY29yZSA8PSAtMC4zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICBzcGVlY2g6IFwiV2hvYWFhIHRha2UgaXQgZWFzeSBtYW4sIGltIGp1c3QgYSBwb29yIGJvdFwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogXCJXaG9hYWEgdGFrZSBpdCBlYXN5IG1hbiwgaW0ganVzdCBhIHBvb3IgYm90XCIsXHJcbiAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfWVsc2UgaWYgKHNlbnRpbWVudC5zY29yZSA+IDAuMykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgc3BlZWNoOiBcIkl0cyBhbHdheXMgZ3JlYXQgdG8gdGFsayB3aXRoIG5pY2UgcGVvcGxlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIkl0cyBhbHdheXMgZ3JlYXQgdG8gdGFsayB3aXRoIG5pY2UgcGVvcGxlXCIsXHJcbiAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgIHNwZWVjaDogXCJTb3JyeSwgaSBkb250IHVuZGVyc3RhbmRcIixcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IFwiU29ycnksIGkgZG9udCB1bmRlcnN0YW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgc3BlZWNoOiBcIlNvcnJ5LCBpIGRvbnQgdW5kZXJzdGFuZFwiLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IFwiU29ycnksIGkgZG9udCB1bmRlcnN0YW5kXCIsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ1JFQVRFIG5ldyBUb2RvLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGVPbmUocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5pbnNlcnQocmVxLmJvZHksIChlcnIsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9XHJcbiAgICAgIHJlcy5zZW5kKHJlc3VsdC5vcHNbMF0pO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZSBlYWNoIGhhbmRsZXIsIGFuZCBhdHRhY2ggdG8gb25lIG9mIHRoZSBFeHByZXNzLlJvdXRlcidzXHJcbiAgICogZW5kcG9pbnRzLlxyXG4gICAqL1xyXG4gIGluaXQoKSB7XHJcblxyXG4gICAgdGhpcy5yb3V0ZXIuZ2V0KCcvJywgdGhpcy5nZXRBbGwpO1xyXG4gICAgdGhpcy5yb3V0ZXIucG9zdCgnLycsIHRoaXMuY3JlYXRlT25lKTtcclxuICAgIHRoaXMucm91dGVyLnBvc3QoJy9ob29rJywgdGhpcy5hcGlhaUhvb2spO1xyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG4vLyBDcmVhdGUgdGhlIFRvZG9zUm91dGVyLCBhbmQgZXhwb3J0IGl0cyBjb25maWd1cmVkIEV4cHJlc3MuUm91dGVyXHJcbmNvbnN0IHRvZG9zUm91dGVyID0gbmV3IFRvZG9Sb3V0ZXIoKTtcclxudG9kb3NSb3V0ZXIuaW5pdCgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdG9kb3NSb3V0ZXIucm91dGVyOyJdLCJzb3VyY2VSb290IjoiLi4ifQ==
