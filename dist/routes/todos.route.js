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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvdG9kb3Mucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBa0U7QUFDbEUsK0NBQWlEO0FBQ2pELGlEQUFtRDtBQUduRDtJQUlFOztPQUVHO0lBQ0g7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLGdCQUFNLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFZCxDQUFDO0lBRUQ7O09BRUc7SUFDSSwyQkFBTSxHQUFiLFVBQWMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUMzRCxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSztZQUMvRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQ04sTUFBTSxHQUFHLENBQUM7WUFDWixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVEOztPQUVHO0lBQ0ksOEJBQVMsR0FBaEIsVUFBaUIsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQztRQUU1QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFM0IsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLGVBQWU7Z0JBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQ7OzttQkFHRztnQkFFSCxFQUFFLENB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Q0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gseUJBQUksR0FBSjtRQUVFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTVDLENBQUM7SUFFSCxpQkFBQztBQUFELENBNUlBLEFBNElDLElBQUE7QUE1SVksZ0NBQVU7QUE4SXZCLG1FQUFtRTtBQUNuRSxJQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ3JDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUVuQixrQkFBZSxXQUFXLENBQUMsTUFBTSxDQUFDIiwiZmlsZSI6InJvdXRlcy90b2Rvcy5yb3V0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlciwgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgKiBhcyBkYXRhYmFzZSBmcm9tIFwiLi4vZGF0YWJhc2UvZGF0YWJhc2VcIjtcclxuaW1wb3J0ICogYXMgbGFuZ3VhZ2UgZnJvbSAnQGdvb2dsZS1jbG91ZC9sYW5ndWFnZSc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFRvZG9Sb3V0ZXIge1xyXG4gIHJvdXRlcjogUm91dGVyXHJcbiAgbGFuZ3VhZ2VDbGllbnQ6IGFueTtcclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZSB0aGUgVG9kbyBSb3V0ZXJcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMucm91dGVyID0gUm91dGVyKCk7XHJcbiAgICB0aGlzLmluaXQoKTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHRVQgYWxsIFRvZG9zLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRBbGwocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5maW5kKHt9KS50b0FycmF5KChlcnIsIHRvZG9zKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpXHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICByZXMuanNvbih0b2Rvcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHRVQgYWxsIFRvZG9zLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBhcGlhaUhvb2socmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGNvbnNvbGUubG9nKFwiSG9vayBSZXF1ZXN0XCIpO1xyXG4gICAgdmFyIHNwZWVjaCA9ICdlbXB0eSBzcGVlY2gnO1xyXG5cclxuICAgIGlmIChyZXEuYm9keSkge1xyXG4gICAgICB2YXIgcmVxdWVzdEJvZHkgPSByZXEuYm9keTtcclxuXHJcbiAgICAgIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQpIHtcclxuICAgICAgICAvLyBzcGVlY2ggPSAnJztcclxuICAgICAgICBjb25zb2xlLmxvZyhcImFjdGlvbjogXCIsIHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24pO1xyXG4gICAgICAgIC8qaWYgKHJlcXVlc3RCb2R5LnJlc3VsdC5mdWxmaWxsbWVudCkge1xyXG4gICAgICAgICAgICBzcGVlY2ggKz0gcmVxdWVzdEJvZHkucmVzdWx0LmZ1bGZpbGxtZW50LnNwZWVjaDtcclxuICAgICAgICAgICAgc3BlZWNoICs9ICcgJztcclxuICAgICAgICB9Ki9cclxuXHJcbiAgICAgICAgaWYgKHJlcXVlc3RCb2R5LnJlc3VsdC5hY3Rpb24gPT0gXCJhZGRfdG9kb1wiKSB7XHJcbiAgICAgICAgICAvL3NwZWVjaCArPSAnYWN0aW9uOiAnICsgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWN0aW9uIGlzIFwiLCByZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiVG9kbyB0byBhZGQgaXMgXCIsIHJlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG8pO1xyXG4gICAgICAgICAgZGF0YWJhc2UuZ2V0REIoKS5jb2xsZWN0aW9uKCd0b2RvcycpLmluc2VydCh7IG5vbWJyZTogcmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kbywgY29tcGxldGFkYTogZmFsc2UgfSwgKGVyciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHBvc3NpYmxlQW5zd2VycyA9IFtgJHtyZXF1ZXN0Qm9keS5yZXN1bHQucGFyYW1ldGVycy50b2RvfSBhZGRlZCB0byB5b3VyIGxpc3QsIGFueXRoaW5nIGVsc2U/YCwgYEkndmUganVzdCBhZGRlZCAke3JlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG99IHRvIHlvdXIgbGlzdCwgY2FuIGkgaGVscCB5b3Ugd2l0aCBzb21ldGhpbmcgZWxzZT9gXVxyXG4gICAgICAgICAgICBsZXQgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcG9zc2libGVBbnN3ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmFuZG9tIHZhbHVlOiBcIiwgcmFuZG9tKTtcclxuICAgICAgICAgICAgbGV0IHNwZWVjaCA9IHBvc3NpYmxlQW5zd2Vyc1tyYW5kb21dO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgIHNwZWVjaDogc3BlZWNoLFxyXG4gICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBzcGVlY2gsXHJcbiAgICAgICAgICAgICAgc291cmNlOiAnYXBpYWktd2ViaG9vay1zYW1wbGUnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uID09IFwiaW5wdXQudW5rbm93blwiKSB7XHJcbiAgICAgICAgICAvL3NwZWVjaCArPSAnYWN0aW9uOiAnICsgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbjtcclxuICAgICAgICAgIGxldCBpbnB1dCA9IHJlcXVlc3RCb2R5LnJlc3VsdC5yZXNvbHZlZFF1ZXJ5O1xyXG4gICAgICAgICAgbGV0IGxhbmd1YWdlQ2xpZW50ID0gbGFuZ3VhZ2Uoe1xyXG4gICAgICAgICAgICBwcm9qZWN0SWQ6ICd0b2Rvc2Fzc2lzdGFudEB0b2Rvc2Fzc2lzdGFudC0xNjQ5MTkuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20nLFxyXG4gICAgICAgICAgICBrZXlGaWxlbmFtZTogYCR7X19kaXJuYW1lfS8uLi9nY2xvdWRjb25maWcuanNvbmBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgbGV0IGRvY3VtZW50ID0gbGFuZ3VhZ2VDbGllbnQuZG9jdW1lbnQoaW5wdXQpO1xyXG4gICAgICAgICAgZG9jdW1lbnQuZGV0ZWN0U2VudGltZW50KGZ1bmN0aW9uIChlcnIsIHNlbnRpbWVudCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVycjogXCIsZXJyKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZW50aW1lbnQ6IFwiLHNlbnRpbWVudCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VudGltZW50IGlzIHBvc2l0aXZlOiBcIixzZW50aW1lbnQuc2NvcmUgPiAwLjMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbnRpbWVudCBpcyBuZWdhdGl2ZTogXCIsc2VudGltZW50LnNjb3JlIDw9IC0wLjMpO1xyXG4gICAgICAgICAgICBpZiAoc2VudGltZW50KSB7XHJcbiAgICAgICAgICAgICAgaWYgKHNlbnRpbWVudC5zY29yZSA8PSAtMC4zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICBzcGVlY2g6IFwiV2hvYWFhIHRha2UgaXQgZWFzeSBtYW4sIGltIGp1c3QgYSBwb29yIGJvdFwiLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogXCJXaG9hYWEgdGFrZSBpdCBlYXN5IG1hbiwgaW0ganVzdCBhIHBvb3IgYm90XCIsXHJcbiAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfWVsc2UgaWYgKHNlbnRpbWVudC5zY29yZSA+IDAuMykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgc3BlZWNoOiBcIkl0cyBhbHdheXMgZ3JlYXQgdG8gdGFsayB3aXRoIG5pY2UgcGVvcGxlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBcIkl0cyBhbHdheXMgZ3JlYXQgdG8gdGFsayB3aXRoIG5pY2UgcGVvcGxlXCIsXHJcbiAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgIHNwZWVjaDogXCJTb3JyeSwgaSBkb250IHVuZGVyc3RhbmRcIixcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IFwiU29ycnksIGkgZG9udCB1bmRlcnN0YW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FwaWFpLXdlYmhvb2stc2FtcGxlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgc3BlZWNoOiBcIlNvcnJ5LCBpIGRvbnQgdW5kZXJzdGFuZFwiLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IFwiU29ycnksIGkgZG9udCB1bmRlcnN0YW5kXCIsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ1JFQVRFIG5ldyBUb2RvLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGVPbmUocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5pbnNlcnQocmVxLmJvZHksIChlcnIsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9XHJcbiAgICAgIHJlcy5zZW5kKHJlc3VsdC5vcHNbMF0pO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGFrZSBlYWNoIGhhbmRsZXIsIGFuZCBhdHRhY2ggdG8gb25lIG9mIHRoZSBFeHByZXNzLlJvdXRlcidzXHJcbiAgICogZW5kcG9pbnRzLlxyXG4gICAqL1xyXG4gIGluaXQoKSB7XHJcblxyXG4gICAgdGhpcy5yb3V0ZXIuZ2V0KCcvJywgdGhpcy5nZXRBbGwpO1xyXG4gICAgdGhpcy5yb3V0ZXIucG9zdCgnLycsIHRoaXMuY3JlYXRlT25lKTtcclxuICAgIHRoaXMucm91dGVyLnBvc3QoJy9ob29rJywgdGhpcy5hcGlhaUhvb2spO1xyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG4vLyBDcmVhdGUgdGhlIFRvZG9zUm91dGVyLCBhbmQgZXhwb3J0IGl0cyBjb25maWd1cmVkIEV4cHJlc3MuUm91dGVyXHJcbmNvbnN0IHRvZG9zUm91dGVyID0gbmV3IFRvZG9Sb3V0ZXIoKTtcclxudG9kb3NSb3V0ZXIuaW5pdCgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdG9kb3NSb3V0ZXIucm91dGVyOyJdLCJzb3VyY2VSb290IjoiLi4ifQ==
