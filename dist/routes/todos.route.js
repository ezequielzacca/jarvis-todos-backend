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
                        var possibleAnswers = [requestBody.result.parameters.todo + " added to your list, anything else?", "I've just added " + requestBody.result.parameters.todo + " to your list, can i help you with something else?"];
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
                        if (sentiment) {
                            if (sentiment.score < 0.3) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvdG9kb3Mucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBa0U7QUFDbEUsK0NBQWlEO0FBQ2pELGlEQUFtRDtBQUduRDtJQUlFOztPQUVHO0lBQ0g7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFZCxDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQkFBTSxHQUFiLFVBQWMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUMzRCxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSztZQUMvRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQ04sTUFBTSxHQUFHLENBQUM7WUFDWixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVEOztPQUVHO0lBQ0ksOEJBQVMsR0FBaEIsVUFBaUIsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQztRQUU1QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLGVBQWU7Z0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQ7OzttQkFHRztnQkFFSCxFQUFFLENB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LEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUU1QyxDQUFDO0lBRUgsaUJBQUM7QUFBRCxDQTFJQSxBQTBJQyxJQUFBO0FBMUlZLGdDQUFVO0FBNEl2QixtRUFBbUU7QUFDbkUsSUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNyQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFbkIsa0JBQWUsV0FBVyxDQUFDLE1BQU0sQ0FBQyIsImZpbGUiOiJyb3V0ZXMvdG9kb3Mucm91dGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIsIFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb24gfSBmcm9tICdleHByZXNzJztcclxuaW1wb3J0ICogYXMgZGF0YWJhc2UgZnJvbSBcIi4uL2RhdGFiYXNlL2RhdGFiYXNlXCI7XHJcbmltcG9ydCAqIGFzIGxhbmd1YWdlIGZyb20gJ0Bnb29nbGUtY2xvdWQvbGFuZ3VhZ2UnO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2RvUm91dGVyIHtcclxuICByb3V0ZXI6IFJvdXRlclxyXG4gIGxhbmd1YWdlQ2xpZW50OiBhbnk7XHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWxpemUgdGhlIFRvZG8gUm91dGVyXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnJvdXRlciA9IFJvdXRlcigpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR0VUIGFsbCBUb2Rvcy5cclxuICAgKi9cclxuICBwdWJsaWMgZ2V0QWxsKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykuZmluZCh7fSkudG9BcnJheSgoZXJyLCB0b2RvcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKVxyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgcmVzLmpzb24odG9kb3MpO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR0VUIGFsbCBUb2Rvcy5cclxuICAgKi9cclxuICBwdWJsaWMgYXBpYWlIb29rKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkhvb2sgUmVxdWVzdFwiKTtcclxuICAgIHZhciBzcGVlY2ggPSAnZW1wdHkgc3BlZWNoJztcclxuXHJcbiAgICBpZiAocmVxLmJvZHkpIHtcclxuICAgICAgdmFyIHJlcXVlc3RCb2R5ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgICBpZiAocmVxdWVzdEJvZHkucmVzdWx0KSB7XHJcbiAgICAgICAgLy8gc3BlZWNoID0gJyc7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpb246IFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uKTtcclxuICAgICAgICAvKmlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuZnVsZmlsbG1lbnQpIHtcclxuICAgICAgICAgICAgc3BlZWNoICs9IHJlcXVlc3RCb2R5LnJlc3VsdC5mdWxmaWxsbWVudC5zcGVlY2g7XHJcbiAgICAgICAgICAgIHNwZWVjaCArPSAnICc7XHJcbiAgICAgICAgfSovXHJcblxyXG4gICAgICAgIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uID09IFwiYWRkX3RvZG9cIikge1xyXG4gICAgICAgICAgLy9zcGVlY2ggKz0gJ2FjdGlvbjogJyArIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb247XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGlvbiBpcyBcIiwgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbik7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvZG8gdG8gYWRkIGlzIFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvKTtcclxuICAgICAgICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5pbnNlcnQoeyBub21icmU6IHJlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG8sIGNvbXBsZXRhZGE6IGZhbHNlIH0sIChlcnIsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZUFuc3dlcnMgPSBbYCR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gYWRkZWQgdG8geW91ciBsaXN0LCBhbnl0aGluZyBlbHNlP2AsIGBJJ3ZlIGp1c3QgYWRkZWQgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSB0byB5b3VyIGxpc3QsIGNhbiBpIGhlbHAgeW91IHdpdGggc29tZXRoaW5nIGVsc2U/YF1cclxuICAgICAgICAgICAgbGV0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlQW5zd2Vycy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJhbmRvbSB2YWx1ZTogXCIsIHJhbmRvbSk7XHJcbiAgICAgICAgICAgIGxldCBzcGVlY2ggPSBwb3NzaWJsZUFuc3dlcnNbcmFuZG9tXTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICBzcGVlY2g6IHNwZWVjaCxcclxuICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbiA9PSBcImlucHV0LnVua25vd25cIikge1xyXG4gICAgICAgICAgLy9zcGVlY2ggKz0gJ2FjdGlvbjogJyArIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb247XHJcbiAgICAgICAgICBsZXQgaW5wdXQgPSByZXF1ZXN0Qm9keS5yZXN1bHQucmVzb2x2ZWRRdWVyeTtcclxuICAgICAgICAgIGxldCBsYW5ndWFnZUNsaWVudCA9IGxhbmd1YWdlKHtcclxuICAgICAgICAgICAgcHJvamVjdElkOiAndG9kb3Nhc3Npc3RhbnRAdG9kb3Nhc3Npc3RhbnQtMTY0OTE5LmlhbS5nc2VydmljZWFjY291bnQuY29tJyxcclxuICAgICAgICAgICAga2V5RmlsZW5hbWU6IGAke19fZGlybmFtZX0vLi4vZ2Nsb3VkY29uZmlnLmpzb25gXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGxldCBkb2N1bWVudCA9IGxhbmd1YWdlQ2xpZW50LmRvY3VtZW50KGlucHV0KTtcclxuICAgICAgICAgIGRvY3VtZW50LmRldGVjdFNlbnRpbWVudChmdW5jdGlvbiAoZXJyLCBzZW50aW1lbnQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlcnI6IFwiLGVycik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VudGltZW50OiBcIixzZW50aW1lbnQpO1xyXG4gICAgICAgICAgICBpZiAoc2VudGltZW50KSB7XHJcbiAgICAgICAgICAgICAgaWYgKHNlbnRpbWVudC5zY29yZSA8IDAuMykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgc3BlZWNoOiBcIldob2FhYSB0YWtlIGl0IGVhc3kgbWFuLCBpbSBqdXN0IGEgcG9vciBib3RcIixcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IFwiV2hvYWFhIHRha2UgaXQgZWFzeSBtYW4sIGltIGp1c3QgYSBwb29yIGJvdFwiLFxyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1lbHNlIGlmIChzZW50aW1lbnQuc2NvcmUgPiAwLjMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgIHNwZWVjaDogXCJJdHMgYWx3YXlzIGdyZWF0IHRvIHRhbGsgd2l0aCBuaWNlIHBlb3BsZVwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogXCJJdHMgYWx3YXlzIGdyZWF0IHRvIHRhbGsgd2l0aCBuaWNlIHBlb3BsZVwiLFxyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICBzcGVlY2g6IFwiU29ycnksIGkgZG9udCB1bmRlcnN0YW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIlNvcnJ5LCBpIGRvbnQgdW5kZXJzdGFuZFwiLFxyXG4gICAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIHNwZWVjaDogXCJTb3JyeSwgaSBkb250IHVuZGVyc3RhbmRcIixcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIlNvcnJ5LCBpIGRvbnQgdW5kZXJzdGFuZFwiLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENSRUFURSBuZXcgVG9kby5cclxuICAgKi9cclxuICBwdWJsaWMgY3JlYXRlT25lKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykuaW5zZXJ0KHJlcS5ib2R5LCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgfVxyXG4gICAgICByZXMuc2VuZChyZXN1bHQub3BzWzBdKTtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2UgZWFjaCBoYW5kbGVyLCBhbmQgYXR0YWNoIHRvIG9uZSBvZiB0aGUgRXhwcmVzcy5Sb3V0ZXInc1xyXG4gICAqIGVuZHBvaW50cy5cclxuICAgKi9cclxuICBpbml0KCkge1xyXG5cclxuICAgIHRoaXMucm91dGVyLmdldCgnLycsIHRoaXMuZ2V0QWxsKTtcclxuICAgIHRoaXMucm91dGVyLnBvc3QoJy8nLCB0aGlzLmNyZWF0ZU9uZSk7XHJcbiAgICB0aGlzLnJvdXRlci5wb3N0KCcvaG9vaycsIHRoaXMuYXBpYWlIb29rKTtcclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxuLy8gQ3JlYXRlIHRoZSBUb2Rvc1JvdXRlciwgYW5kIGV4cG9ydCBpdHMgY29uZmlndXJlZCBFeHByZXNzLlJvdXRlclxyXG5jb25zdCB0b2Rvc1JvdXRlciA9IG5ldyBUb2RvUm91dGVyKCk7XHJcbnRvZG9zUm91dGVyLmluaXQoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRvZG9zUm91dGVyLnJvdXRlcjsiXSwic291cmNlUm9vdCI6Ii4uIn0=
