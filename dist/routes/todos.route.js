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
    };
    return TodoRouter;
}());
exports.TodoRouter = TodoRouter;
// Create the TodosRouter, and export its configured Express.Router
var todosRouter = new TodoRouter();
todosRouter.init();
exports.default = todosRouter.router;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvdG9kb3Mucm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBZ0U7QUFDaEUsK0NBQWlEO0FBR2pEO0lBR0U7O09BRUc7SUFDSDtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsZ0JBQU0sRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRDs7T0FFRztJQUNJLDJCQUFNLEdBQWIsVUFBYyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQzNELFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBQyxLQUFLO1lBQzlELEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQztnQkFDTCxNQUFNLEdBQUcsQ0FBQztZQUNaLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSw4QkFBUyxHQUFoQixVQUFpQixHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQzlELFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsVUFBQyxHQUFHLEVBQUMsTUFBTTtZQUM1RCxFQUFFLENBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDO2dCQUNKLE1BQU0sR0FBRyxDQUFDO1lBQ2QsQ0FBQztZQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVEOzs7T0FHRztJQUNILHlCQUFJLEdBQUo7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFeEMsQ0FBQztJQUVILGlCQUFDO0FBQUQsQ0E5Q0EsQUE4Q0MsSUFBQTtBQTlDWSxnQ0FBVTtBQWdEdkIsbUVBQW1FO0FBQ25FLElBQU0sV0FBVyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDckMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0FBRW5CLGtCQUFlLFdBQVcsQ0FBQyxNQUFNLENBQUMiLCJmaWxlIjoicm91dGVzL3RvZG9zLnJvdXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtSb3V0ZXIsIFJlcXVlc3QsIFJlc3BvbnNlLCBOZXh0RnVuY3Rpb259IGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgKiBhcyBkYXRhYmFzZSBmcm9tIFwiLi4vZGF0YWJhc2UvZGF0YWJhc2VcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgVG9kb1JvdXRlciB7XHJcbiAgcm91dGVyOiBSb3V0ZXJcclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZSB0aGUgVG9kbyBSb3V0ZXJcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMucm91dGVyID0gUm91dGVyKCk7XHJcbiAgICB0aGlzLmluaXQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdFVCBhbGwgVG9kb3MuXHJcbiAgICovXHJcbiAgcHVibGljIGdldEFsbChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikge1xyXG4gICAgZGF0YWJhc2UuZ2V0REIoKS5jb2xsZWN0aW9uKCd0b2RvcycpLmZpbmQoe30pLnRvQXJyYXkoKGVycix0b2Rvcyk9PntcclxuICAgICAgaWYoZXJyKVxyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgICAgcmVzLmpzb24odG9kb3MpO1xyXG4gICAgfSk7ICBcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ1JFQVRFIG5ldyBUb2RvLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBjcmVhdGVPbmUocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbigndG9kb3MnKS5pbnNlcnQocmVxLmJvZHksKGVycixyZXN1bHQpPT57XHJcbiAgICAgICAgaWYoZXJyKXtcclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXMuc2VuZChyZXN1bHQub3BzWzBdKTtcclxuICAgIH0pOyAgXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2UgZWFjaCBoYW5kbGVyLCBhbmQgYXR0YWNoIHRvIG9uZSBvZiB0aGUgRXhwcmVzcy5Sb3V0ZXInc1xyXG4gICAqIGVuZHBvaW50cy5cclxuICAgKi9cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5yb3V0ZXIuZ2V0KCcvJywgdGhpcy5nZXRBbGwpO1xyXG4gICAgdGhpcy5yb3V0ZXIucG9zdCgnLycsIHRoaXMuY3JlYXRlT25lKTtcclxuICAgIFxyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8vIENyZWF0ZSB0aGUgVG9kb3NSb3V0ZXIsIGFuZCBleHBvcnQgaXRzIGNvbmZpZ3VyZWQgRXhwcmVzcy5Sb3V0ZXJcclxuY29uc3QgdG9kb3NSb3V0ZXIgPSBuZXcgVG9kb1JvdXRlcigpO1xyXG50b2Rvc1JvdXRlci5pbml0KCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0b2Rvc1JvdXRlci5yb3V0ZXI7Il0sInNvdXJjZVJvb3QiOiIuLiJ9
