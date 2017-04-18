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
                            "Done, " + requestBody.result.parameters.todo + " was added, can i do any more things for you?"
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvdG9kb3Mucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBa0U7QUFDbEUsK0NBQWlEO0FBQ2pELGlEQUFtRDtBQUduRDtJQUlFOztPQUVHO0lBQ0g7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFZCxDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQkFBTSxHQUFiLFVBQWMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUMzRCxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSztZQUMvRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQ04sTUFBTSxHQUFHLENBQUM7WUFDWixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVEOztPQUVHO0lBQ0ksOEJBQVMsR0FBaEIsVUFBaUIsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQztRQUU1QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLGVBQWU7Z0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQ7OzttQkFHRztnQkFFSCxFQUFFLENB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VUFBQyxHQUFHLEVBQUUsTUFBTTtZQUNoRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE1BQU0sR0FBRyxDQUFDO1lBQ1osQ0FBQztZQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVEOzs7T0FHRztJQUNILHlCQUFJLEdBQUo7UUFFRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUU1QyxDQUFDO0lBRUgsaUJBQUM7QUFBRCxDQWxKQSxBQWtKQyxJQUFBO0FBbEpZLGdDQUFVO0FBb0p2QixtRUFBbUU7QUFDbkUsSUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNyQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFbkIsa0JBQWUsV0FBVyxDQUFDLE1BQU0sQ0FBQyIsImZpbGUiOiJyb3V0ZXMvdG9kb3Mucm91dGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIsIFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJztcclxuaW1wb3J0ICogYXMgZGF0YWJhc2UgZnJvbSBcIi4uL2RhdGFiYXNlL2RhdGFiYXNlXCI7XHJcbmltcG9ydCAqIGFzIGxhbmd1YWdlIGZyb20gJ0Bnb29nbGUtY2xvdWQvbGFuZ3VhZ2UnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2RvUm91dGVyIHtcclxuICByb3V0ZXI6IFJvdXRlclxyXG4gIGxhbmd1YWdlQ2xpZW50OiBhbnk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWxpemUgdGhlIFRvZG8gUm91dGVyXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnJvdXRlciA9IFJvdXRlcigpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR0VUIGFsbCBUb2Rvcy5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0QWxsKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykuZmluZCh7fSkudG9BcnJheSgoZXJyLCB0b2RvcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKVxyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgcmVzLmpzb24odG9kb3MpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR0VUIGFsbCBUb2Rvcy5cclxuICAgKi9cclxuICBwdWJsaWMgYXBpYWlIb29rKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkhvb2sgUmVxdWVzdFwiKTtcclxuICAgIHZhciBzcGVlY2ggPSAnZW1wdHkgc3BlZWNoJztcclxuXHJcbiAgICBpZiAocmVxLmJvZHkpIHtcclxuICAgICAgdmFyIHJlcXVlc3RCb2R5ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgICBpZiAocmVxdWVzdEJvZHkucmVzdWx0KSB7XHJcbiAgICAgICAgLy8gc3BlZWNoID0gJyc7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpb246IFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uKTtcclxuICAgICAgICAvKmlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuZnVsZmlsbG1lbnQpIHtcclxuICAgICAgICAgICAgc3BlZWNoICs9IHJlcXVlc3RCb2R5LnJlc3VsdC5mdWxmaWxsbWVudC5zcGVlY2g7XHJcbiAgICAgICAgICAgIHNwZWVjaCArPSAnICc7XHJcbiAgICAgICAgfSovXHJcblxyXG4gICAgICAgIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uID09IFwiYWRkX3RvZG9cIikge1xyXG4gICAgICAgICAgLy9zcGVlY2ggKz0gJ2FjdGlvbjogJyArIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb247XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGlvbiBpcyBcIiwgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbik7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvZG8gdG8gYWRkIGlzIFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvKTtcclxuICAgICAgICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5pbnNlcnQoeyBub21icmU6IHJlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG8sIGNvbXBsZXRhZGE6IGZhbHNlIH0sIChlcnIsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZUFuc3dlcnMgPSBbXHJcbiAgICAgICAgICAgICAgICBgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSBhZGRlZCB0byB5b3VyIGxpc3QsIGFueXRoaW5nIGVsc2U/YCxcclxuICAgICAgICAgICAgICAgIGBJJ3ZlIGp1c3QgYWRkZWQgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSB0byB5b3VyIGxpc3QsIGNhbiBpIGhlbHAgeW91IHdpdGggc29tZXRoaW5nIGVsc2U/YCxcclxuICAgICAgICAgICAgICAgIGBZb3VyIHdpc2hlcyBhcmUgb3JkZXJzLCAke3JlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG99IGFkZGVkLCBhbnkgb3RoZXIgVG9kbz9gLFxyXG4gICAgICAgICAgICAgICAgYCR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gc2hpcHBlZCByaWdodCBvbnRvIHRoZSBsaXN0LCBjYW4gaSBkbyBhbnl0aGluZyBlbHNlIGZvciB5b3U/YCxcclxuICAgICAgICAgICAgICAgIGBEb25lLCAke3JlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG99IHdhcyBhZGRlZCwgY2FuIGkgZG8gYW55IG1vcmUgdGhpbmdzIGZvciB5b3U/YFxyXG4gICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIGxldCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZUFuc3dlcnMubGVuZ3RoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyYW5kb20gdmFsdWU6IFwiLCByYW5kb20pO1xyXG4gICAgICAgICAgICBsZXQgc3BlZWNoID0gcG9zc2libGVBbnN3ZXJzW3JhbmRvbV07XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgc3BlZWNoOiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IHNwZWVjaCxcclxuICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24gPT0gXCJpbnB1dC51bmtub3duXCIpIHtcclxuICAgICAgICAgIC8vc3BlZWNoICs9ICdhY3Rpb246ICcgKyByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uO1xyXG4gICAgICAgICAgbGV0IGlucHV0ID0gcmVxdWVzdEJvZHkucmVzdWx0LnJlc29sdmVkUXVlcnk7XHJcbiAgICAgICAgICBsZXQgbGFuZ3VhZ2VDbGllbnQgPSBsYW5ndWFnZSh7XHJcbiAgICAgICAgICAgIHByb2plY3RJZDogJ3RvZG9zYXNzaXN0YW50QHRvZG9zYXNzaXN0YW50LTE2NDkxOS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbScsXHJcbiAgICAgICAgICAgIGtleUZpbGVuYW1lOiBgJHtfX2Rpcm5hbWV9Ly4uL2djbG91ZGNvbmZpZy5qc29uYFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBsZXQgZG9jdW1lbnQgPSBsYW5ndWFnZUNsaWVudC5kb2N1bWVudChpbnB1dCk7XHJcbiAgICAgICAgICBkb2N1bWVudC5kZXRlY3RTZW50aW1lbnQoZnVuY3Rpb24gKGVyciwgc2VudGltZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyOiBcIixlcnIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbnRpbWVudDogXCIsc2VudGltZW50KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZW50aW1lbnQgaXMgcG9zaXRpdmU6IFwiLHNlbnRpbWVudC5zY29yZSA+IDAuMyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VudGltZW50IGlzIG5lZ2F0aXZlOiBcIixzZW50aW1lbnQuc2NvcmUgPD0gLTAuMyk7XHJcbiAgICAgICAgICAgIGlmIChzZW50aW1lbnQpIHtcclxuICAgICAgICAgICAgICBpZiAoc2VudGltZW50LnNjb3JlIDw9IC0wLjMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgIHNwZWVjaDogXCJXaG9hYWEgdGFrZSBpdCBlYXN5IG1hbiwgaW0ganVzdCBhIHBvb3IgYm90XCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIldob2FhYSB0YWtlIGl0IGVhc3kgbWFuLCBpbSBqdXN0IGEgcG9vciBib3RcIixcclxuICAgICAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9ZWxzZSBpZiAoc2VudGltZW50LnNjb3JlID4gMC4zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICBzcGVlY2g6IFwiSXRzIGFsd2F5cyBncmVhdCB0byB0YWxrIHdpdGggbmljZSBwZW9wbGVcIixcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IFwiSXRzIGFsd2F5cyBncmVhdCB0byB0YWxrIHdpdGggbmljZSBwZW9wbGVcIixcclxuICAgICAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgc3BlZWNoOiBcIlNvcnJ5LCBpIGRvbnQgdW5kZXJzdGFuZFwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogXCJTb3JyeSwgaSBkb250IHVuZGVyc3RhbmRcIixcclxuICAgICAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBzcGVlY2g6IFwiU29ycnksIGkgZG9udCB1bmRlcnN0YW5kXCIsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogXCJTb3JyeSwgaSBkb250IHVuZGVyc3RhbmRcIixcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDUkVBVEUgbmV3IFRvZG8uXHJcbiAgICovXHJcbiAgcHVibGljIGNyZWF0ZU9uZShyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gICAgZGF0YWJhc2UuZ2V0REIoKS5jb2xsZWN0aW9uKCd0b2RvcycpLmluc2VydChyZXEuYm9keSwgKGVyciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIH1cclxuICAgICAgcmVzLnNlbmQocmVzdWx0Lm9wc1swXSk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUYWtlIGVhY2ggaGFuZGxlciwgYW5kIGF0dGFjaCB0byBvbmUgb2YgdGhlIEV4cHJlc3MuUm91dGVyJ3NcclxuICAgKiBlbmRwb2ludHMuXHJcbiAgICovXHJcbiAgaW5pdCgpIHtcclxuXHJcbiAgICB0aGlzLnJvdXRlci5nZXQoJy8nLCB0aGlzLmdldEFsbCk7XHJcbiAgICB0aGlzLnJvdXRlci5wb3N0KCcvJywgdGhpcy5jcmVhdGVPbmUpO1xyXG4gICAgdGhpcy5yb3V0ZXIucG9zdCgnL2hvb2snLCB0aGlzLmFwaWFpSG9vayk7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8vIENyZWF0ZSB0aGUgVG9kb3NSb3V0ZXIsIGFuZCBleHBvcnQgaXRzIGNvbmZpZ3VyZWQgRXhwcmVzcy5Sb3V0ZXJcclxuY29uc3QgdG9kb3NSb3V0ZXIgPSBuZXcgVG9kb1JvdXRlcigpO1xyXG50b2Rvc1JvdXRlci5pbml0KCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0b2Rvc1JvdXRlci5yb3V0ZXI7Il0sInNvdXJjZVJvb3QiOiIuLiJ9
