"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
//Database related stuff
var database = require("./database/database");
//Routers
var medicos_route_1 = require("./routes/medicos.route");
// Creates and configures an ExpressJS web server.
var App = (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.express = express();
        this.middleware();
        this.setupDatabase();
        this.routes();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors());
    };
    // Configure Express middleware.
    App.prototype.setupDatabase = function () {
        database.connectToServer();
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        var router = express.Router();
        // placeholder route handler
        router.get('/', function (req, res, next) {
            res.json({
                message: 'Hello World!',
                array: [12, 13, { hola: "mundo v3" }]
            });
        });
        //Aca yo pondria todas las rutas de mi app
        this.express.use('/', router);
        this.express.use('/api/v1/medicos', medicos_route_1.default);
    };
    return App;
}());
exports.default = new App().express;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBbUM7QUFDbkMsK0JBQWlDO0FBQ2pDLHdDQUEwQztBQUMxQywyQkFBNkI7QUFFN0Isd0JBQXdCO0FBQ3hCLDhDQUFpRDtBQUlqRCxTQUFTO0FBQ1Qsd0RBQW1EO0FBR25ELGtEQUFrRDtBQUNsRDtJQUtJLG9EQUFvRDtJQUNwRDtRQUNJLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELGdDQUFnQztJQUN4Qix3QkFBVSxHQUFsQjtRQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFFN0IsQ0FBQztJQUVELGdDQUFnQztJQUN4QiwyQkFBYSxHQUFyQjtRQUNJLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUUvQixDQUFDO0lBRUQsMkJBQTJCO0lBQ25CLG9CQUFNLEdBQWQ7UUFDSTs7MkJBRW1CO1FBQ25CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM5Qiw0QkFBNEI7UUFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7WUFFM0IsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDTCxPQUFPLEVBQUUsY0FBYztnQkFDdkIsS0FBSyxFQUFDLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsQ0FBQzthQUNsQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUNILDBDQUEwQztRQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsdUJBQWEsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTCxVQUFDO0FBQUQsQ0EvQ0EsQUErQ0MsSUFBQTtBQUVELGtCQUFlLElBQUksR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgKiBhcyBsb2dnZXIgZnJvbSAnbW9yZ2FuJztcclxuaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XHJcbmltcG9ydCAqIGFzIGNvcnMgZnJvbSAnY29ycyc7XHJcblxyXG4vL0RhdGFiYXNlIHJlbGF0ZWQgc3R1ZmZcclxuaW1wb3J0ICogYXMgZGF0YWJhc2UgZnJvbSAgXCIuL2RhdGFiYXNlL2RhdGFiYXNlXCI7XHJcblxyXG5cclxuXHJcbi8vUm91dGVyc1xyXG5pbXBvcnQgTWVkaWNvc1JvdXRlciBmcm9tIFwiLi9yb3V0ZXMvbWVkaWNvcy5yb3V0ZVwiO1xyXG5cclxuXHJcbi8vIENyZWF0ZXMgYW5kIGNvbmZpZ3VyZXMgYW4gRXhwcmVzc0pTIHdlYiBzZXJ2ZXIuXHJcbmNsYXNzIEFwcCB7XHJcblxyXG4gICAgLy8gcmVmIHRvIEV4cHJlc3MgaW5zdGFuY2VcclxuICAgIHB1YmxpYyBleHByZXNzOiBleHByZXNzLkFwcGxpY2F0aW9uO1xyXG5cclxuICAgIC8vUnVuIGNvbmZpZ3VyYXRpb24gbWV0aG9kcyBvbiB0aGUgRXhwcmVzcyBpbnN0YW5jZS5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZXhwcmVzcyA9IGV4cHJlc3MoKTtcclxuICAgICAgICB0aGlzLm1pZGRsZXdhcmUoKTtcclxuICAgICAgICB0aGlzLnNldHVwRGF0YWJhc2UoKTtcclxuICAgICAgICB0aGlzLnJvdXRlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbmZpZ3VyZSBFeHByZXNzIG1pZGRsZXdhcmUuXHJcbiAgICBwcml2YXRlIG1pZGRsZXdhcmUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5leHByZXNzLnVzZShsb2dnZXIoJ2RldicpKTtcclxuICAgICAgICB0aGlzLmV4cHJlc3MudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcclxuICAgICAgICB0aGlzLmV4cHJlc3MudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiBmYWxzZSB9KSk7XHJcbiAgICAgICAgdGhpcy5leHByZXNzLnVzZShjb3JzKCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyBDb25maWd1cmUgRXhwcmVzcyBtaWRkbGV3YXJlLlxyXG4gICAgcHJpdmF0ZSBzZXR1cERhdGFiYXNlKCk6IHZvaWQge1xyXG4gICAgICAgIGRhdGFiYXNlLmNvbm5lY3RUb1NlcnZlcigpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyBDb25maWd1cmUgQVBJIGVuZHBvaW50cy5cclxuICAgIHByaXZhdGUgcm91dGVzKCk6IHZvaWQge1xyXG4gICAgICAgIC8qIFRoaXMgaXMganVzdCB0byBnZXQgdXAgYW5kIHJ1bm5pbmcsIGFuZCB0byBtYWtlIHN1cmUgd2hhdCB3ZSd2ZSBnb3QgaXNcclxuICAgICAgICAgKiB3b3JraW5nIHNvIGZhci4gVGhpcyBmdW5jdGlvbiB3aWxsIGNoYW5nZSB3aGVuIHdlIHN0YXJ0IHRvIGFkZCBtb3JlXHJcbiAgICAgICAgICogQVBJIGVuZHBvaW50cyAqL1xyXG4gICAgICAgIGxldCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG4gICAgICAgIC8vIHBsYWNlaG9sZGVyIHJvdXRlIGhhbmRsZXJcclxuICAgICAgICByb3V0ZXIuZ2V0KCcvJywgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnSGVsbG8gV29ybGQhJyxcclxuICAgICAgICAgICAgICAgIGFycmF5OlsxMiwxMyx7aG9sYTpcIm11bmRvIHYzXCJ9XVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL0FjYSB5byBwb25kcmlhIHRvZGFzIGxhcyBydXRhcyBkZSBtaSBhcHBcclxuICAgICAgICB0aGlzLmV4cHJlc3MudXNlKCcvJywgcm91dGVyKTtcclxuICAgICAgICB0aGlzLmV4cHJlc3MudXNlKCcvYXBpL3YxL21lZGljb3MnLCBNZWRpY29zUm91dGVyKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBBcHAoKS5leHByZXNzOyJdLCJzb3VyY2VSb290IjoiIn0=
