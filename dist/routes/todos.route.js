"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var database = require("../database/database");
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
                        return res.json({
                            speech: requestBody.result.parameters.todo + " added to your list, anything else?",
                            displayText: speech,
                            source: 'apiai-webhook-sample'
                        });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvdG9kb3Mucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBZ0U7QUFDaEUsK0NBQWlEO0FBR2pEO0lBR0U7O09BRUc7SUFDSDtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsZ0JBQU0sRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRDs7T0FFRztJQUNJLDJCQUFNLEdBQWIsVUFBYyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQzNELFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBQyxLQUFLO1lBQzlELEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQztnQkFDTCxNQUFNLEdBQUcsQ0FBQztZQUNaLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSw4QkFBUyxHQUFoQixVQUFpQixHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEIsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDO1FBRTVCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1gsSUFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUUzQixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsZUFBZTtnQkFFZDs7O21CQUdHO2dCQUVILEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLG1EQUFtRDtvQkFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakUsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUMsRUFBQyxVQUFDLEdBQUcsRUFBQyxNQUFNO3dCQUNqSCxFQUFFLENBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDOzRCQUNKLE1BQU0sR0FBRyxDQUFDO3dCQUNkLENBQUM7d0JBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7NEJBQ2QsTUFBTSxFQUFLLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksd0NBQXFDOzRCQUNsRixXQUFXLEVBQUUsTUFBTTs0QkFDbkIsTUFBTSxFQUFFLHNCQUFzQjt5QkFDakMsQ0FBQyxDQUFDO29CQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztJQU1QLENBQUM7SUFFRDs7T0FFRztJQUNJLDhCQUFTLEdBQWhCLFVBQWlCLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7UUFDOUQsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxVQUFDLEdBQUcsRUFBQyxNQUFNO1lBQzVELEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUM7Z0JBQ0osTUFBTSxHQUFHLENBQUM7WUFDZCxDQUFDO1lBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gseUJBQUksR0FBSjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTVDLENBQUM7SUFFSCxpQkFBQztBQUFELENBekZBLEFBeUZDLElBQUE7QUF6RlksZ0NBQVU7QUEyRnZCLG1FQUFtRTtBQUNuRSxJQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQ3JDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUVuQixrQkFBZSxXQUFXLENBQUMsTUFBTSxDQUFDIiwiZmlsZSI6InJvdXRlcy90b2Rvcy5yb3V0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Um91dGVyLCBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9ufSBmcm9tICdleHByZXNzJztcclxuaW1wb3J0ICogYXMgZGF0YWJhc2UgZnJvbSBcIi4uL2RhdGFiYXNlL2RhdGFiYXNlXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFRvZG9Sb3V0ZXIge1xyXG4gIHJvdXRlcjogUm91dGVyXHJcblxyXG4gIC8qKlxyXG4gICAqIEluaXRpYWxpemUgdGhlIFRvZG8gUm91dGVyXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnJvdXRlciA9IFJvdXRlcigpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHRVQgYWxsIFRvZG9zLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRBbGwocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5maW5kKHt9KS50b0FycmF5KChlcnIsdG9kb3MpPT57XHJcbiAgICAgIGlmKGVycilcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIHJlcy5qc29uKHRvZG9zKTtcclxuICAgIH0pOyAgXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdFVCBhbGwgVG9kb3MuXHJcbiAgICovXHJcbiAgcHVibGljIGFwaWFpSG9vayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gICAgY29uc29sZS5sb2coXCJIb29rIFJlcXVlc3RcIik7ICAgXHJcbiAgICAgICAgdmFyIHNwZWVjaCA9ICdlbXB0eSBzcGVlY2gnO1xyXG5cclxuICAgICAgICBpZiAocmVxLmJvZHkpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3RCb2R5ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVxdWVzdEJvZHkucmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgIC8vIHNwZWVjaCA9ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qaWYgKHJlcXVlc3RCb2R5LnJlc3VsdC5mdWxmaWxsbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNwZWVjaCArPSByZXF1ZXN0Qm9keS5yZXN1bHQuZnVsZmlsbG1lbnQuc3BlZWNoO1xyXG4gICAgICAgICAgICAgICAgICAgIHNwZWVjaCArPSAnICc7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbiA9PSBcImFkZF90b2RvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3NwZWVjaCArPSAnYWN0aW9uOiAnICsgcmVxdWVzdEJvZHkucmVzdWx0LmFjdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFjdGlvbiBpcyBcIixyZXF1ZXN0Qm9keS5yZXN1bHQuYWN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRvZG8gdG8gYWRkIGlzIFwiLHJlcXVlc3RCb2R5LnJlc3VsdC5wYXJhbWV0ZXJzLnRvZG8pO1xyXG4gICAgICAgICAgICAgICAgICAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ3RvZG9zJykuaW5zZXJ0KHtub21icmU6cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kbyxjb21wbGV0YWRhOmZhbHNlfSwoZXJyLHJlc3VsdCk9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZXJyKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNwZWVjaDogYCR7cmVxdWVzdEJvZHkucmVzdWx0LnBhcmFtZXRlcnMudG9kb30gYWRkZWQgdG8geW91ciBsaXN0LCBhbnl0aGluZyBlbHNlP2AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheVRleHQ6IHNwZWVjaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6ICdhcGlhaS13ZWJob29rLXNhbXBsZSdcclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pOyAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ1JFQVRFIG5ldyBUb2RvLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGVPbmUocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5pbnNlcnQocmVxLmJvZHksKGVycixyZXN1bHQpPT57XHJcbiAgICAgICAgaWYoZXJyKXtcclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXMuc2VuZChyZXN1bHQub3BzWzBdKTtcclxuICAgIH0pOyAgXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2UgZWFjaCBoYW5kbGVyLCBhbmQgYXR0YWNoIHRvIG9uZSBvZiB0aGUgRXhwcmVzcy5Sb3V0ZXInc1xyXG4gICAqIGVuZHBvaW50cy5cclxuICAgKi9cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5yb3V0ZXIuZ2V0KCcvJywgdGhpcy5nZXRBbGwpO1xyXG4gICAgdGhpcy5yb3V0ZXIucG9zdCgnLycsIHRoaXMuY3JlYXRlT25lKTtcclxuICAgIHRoaXMucm91dGVyLnBvc3QoJy9ob29rJywgdGhpcy5hcGlhaUhvb2spO1xyXG4gICAgXHJcbiAgfVxyXG5cclxufVxyXG5cclxuLy8gQ3JlYXRlIHRoZSBUb2Rvc1JvdXRlciwgYW5kIGV4cG9ydCBpdHMgY29uZmlndXJlZCBFeHByZXNzLlJvdXRlclxyXG5jb25zdCB0b2Rvc1JvdXRlciA9IG5ldyBUb2RvUm91dGVyKCk7XHJcbnRvZG9zUm91dGVyLmluaXQoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRvZG9zUm91dGVyLnJvdXRlcjsiXSwic291cmNlUm9vdCI6Ii4uIn0=
