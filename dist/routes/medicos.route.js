"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var database = require("../database/database");
var MEDICOS = [];
var MedicosRouter = (function () {
    /**
     * Initialize the MedicosRouter
     */
    function MedicosRouter() {
        this.router = express_1.Router();
        this.init();
    }
    /**
     * GET all Medicos.
     */
    MedicosRouter.prototype.getAll = function (req, res, next) {
        database.getDB().collection('medicos').find({}).toArray(function (err, medicos) {
            if (err)
                throw err;
            res.json(medicos);
        });
    };
    /**
     * GET all Medicos.
     */
    MedicosRouter.prototype.createOne = function (req, res, next) {
        database.getDB().collection('medicos').insert(req.body, function (err, result) {
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
    MedicosRouter.prototype.init = function () {
        this.router.get('/', this.getAll);
        this.router.post('/', this.createOne);
    };
    return MedicosRouter;
}());
exports.MedicosRouter = MedicosRouter;
// Create the HeroRouter, and export its configured Express.Router
var medicosRouter = new MedicosRouter();
medicosRouter.init();
exports.default = medicosRouter.router;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvbWVkaWNvcy5yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFnRTtBQUNoRSwrQ0FBaUQ7QUFDakQsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBRW5CO0lBR0U7O09BRUc7SUFDSDtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsZ0JBQU0sRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRDs7T0FFRztJQUNJLDhCQUFNLEdBQWIsVUFBYyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQzNELFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBQyxPQUFPO1lBQ2xFLEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQztnQkFDTCxNQUFNLEdBQUcsQ0FBQztZQUNaLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxpQ0FBUyxHQUFoQixVQUFpQixHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQzlELFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUMsVUFBQyxHQUFHLEVBQUMsTUFBTTtZQUM5RCxFQUFFLENBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQSxDQUFDO2dCQUNKLE1BQU0sR0FBRyxDQUFDO1lBQ2QsQ0FBQztZQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVEOzs7T0FHRztJQUNILDRCQUFJLEdBQUo7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFeEMsQ0FBQztJQUVILG9CQUFDO0FBQUQsQ0E5Q0EsQUE4Q0MsSUFBQTtBQTlDWSxzQ0FBYTtBQWdEMUIsa0VBQWtFO0FBQ2xFLElBQU0sYUFBYSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7QUFDMUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO0FBRXJCLGtCQUFlLGFBQWEsQ0FBQyxNQUFNLENBQUMiLCJmaWxlIjoicm91dGVzL21lZGljb3Mucm91dGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JvdXRlciwgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbn0gZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCAqIGFzIGRhdGFiYXNlIGZyb20gXCIuLi9kYXRhYmFzZS9kYXRhYmFzZVwiO1xyXG5jb25zdCBNRURJQ09TID0gW107XHJcblxyXG5leHBvcnQgY2xhc3MgTWVkaWNvc1JvdXRlciB7XHJcbiAgcm91dGVyOiBSb3V0ZXJcclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZSB0aGUgTWVkaWNvc1JvdXRlclxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5yb3V0ZXIgPSBSb3V0ZXIoKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR0VUIGFsbCBNZWRpY29zLlxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRBbGwocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pIHtcclxuICAgIGRhdGFiYXNlLmdldERCKCkuY29sbGVjdGlvbignbWVkaWNvcycpLmZpbmQoe30pLnRvQXJyYXkoKGVycixtZWRpY29zKT0+e1xyXG4gICAgICBpZihlcnIpXHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICByZXMuanNvbihtZWRpY29zKTtcclxuICAgIH0pOyAgXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdFVCBhbGwgTWVkaWNvcy5cclxuICAgKi9cclxuICBwdWJsaWMgY3JlYXRlT25lKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICBkYXRhYmFzZS5nZXREQigpLmNvbGxlY3Rpb24oJ21lZGljb3MnKS5pbnNlcnQocmVxLmJvZHksKGVycixyZXN1bHQpPT57XHJcbiAgICAgICAgaWYoZXJyKXtcclxuICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXMuc2VuZChyZXN1bHQub3BzWzBdKTtcclxuICAgIH0pOyAgXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRha2UgZWFjaCBoYW5kbGVyLCBhbmQgYXR0YWNoIHRvIG9uZSBvZiB0aGUgRXhwcmVzcy5Sb3V0ZXInc1xyXG4gICAqIGVuZHBvaW50cy5cclxuICAgKi9cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5yb3V0ZXIuZ2V0KCcvJywgdGhpcy5nZXRBbGwpO1xyXG4gICAgdGhpcy5yb3V0ZXIucG9zdCgnLycsIHRoaXMuY3JlYXRlT25lKTtcclxuICAgIFxyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8vIENyZWF0ZSB0aGUgSGVyb1JvdXRlciwgYW5kIGV4cG9ydCBpdHMgY29uZmlndXJlZCBFeHByZXNzLlJvdXRlclxyXG5jb25zdCBtZWRpY29zUm91dGVyID0gbmV3IE1lZGljb3NSb3V0ZXIoKTtcclxubWVkaWNvc1JvdXRlci5pbml0KCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtZWRpY29zUm91dGVyLnJvdXRlcjsiXSwic291cmNlUm9vdCI6Ii4uIn0=
