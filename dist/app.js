"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
//Database related stuff
var database = require("./database/database");
//Routers
var todos_route_1 = require("./routes/todos.route");
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
        this.express.use('/api/v1/todos', todos_route_1.default);
    };
    return App;
}());
exports.default = new App().express;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBbUM7QUFDbkMsK0JBQWlDO0FBQ2pDLHdDQUEwQztBQUMxQywyQkFBNkI7QUFFN0Isd0JBQXdCO0FBQ3hCLDhDQUFpRDtBQUlqRCxTQUFTO0FBQ1Qsb0RBQThDO0FBRzlDLGtEQUFrRDtBQUNsRDtJQUtJLG9EQUFvRDtJQUNwRDtRQUNJLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELGdDQUFnQztJQUN4Qix3QkFBVSxHQUFsQjtRQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFFN0IsQ0FBQztJQUVELGdDQUFnQztJQUN4QiwyQkFBYSxHQUFyQjtRQUNJLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUUvQixDQUFDO0lBRUQsMkJBQTJCO0lBQ25CLG9CQUFNLEdBQWQ7UUFDSTs7MkJBRW1CO1FBQ25CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM5Qiw0QkFBNEI7UUFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7WUFFM0IsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDTCxPQUFPLEVBQUUsY0FBYztnQkFDdkIsS0FBSyxFQUFDLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFDLElBQUksRUFBQyxVQUFVLEVBQUMsQ0FBQzthQUNsQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUNILDBDQUEwQztRQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLHFCQUFVLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUwsVUFBQztBQUFELENBL0NBLEFBK0NDLElBQUE7QUFFRCxrQkFBZSxJQUFJLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0ICogYXMgbG9nZ2VyIGZyb20gJ21vcmdhbic7XHJcbmltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xyXG5pbXBvcnQgKiBhcyBjb3JzIGZyb20gJ2NvcnMnO1xyXG5cclxuLy9EYXRhYmFzZSByZWxhdGVkIHN0dWZmXHJcbmltcG9ydCAqIGFzIGRhdGFiYXNlIGZyb20gIFwiLi9kYXRhYmFzZS9kYXRhYmFzZVwiO1xyXG5cclxuXHJcblxyXG4vL1JvdXRlcnNcclxuaW1wb3J0IFRvZG9Sb3V0ZXIgZnJvbSBcIi4vcm91dGVzL3RvZG9zLnJvdXRlXCI7XHJcblxyXG5cclxuLy8gQ3JlYXRlcyBhbmQgY29uZmlndXJlcyBhbiBFeHByZXNzSlMgd2ViIHNlcnZlci5cclxuY2xhc3MgQXBwIHtcclxuXHJcbiAgICAvLyByZWYgdG8gRXhwcmVzcyBpbnN0YW5jZVxyXG4gICAgcHVibGljIGV4cHJlc3M6IGV4cHJlc3MuQXBwbGljYXRpb247XHJcblxyXG4gICAgLy9SdW4gY29uZmlndXJhdGlvbiBtZXRob2RzIG9uIHRoZSBFeHByZXNzIGluc3RhbmNlLlxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5leHByZXNzID0gZXhwcmVzcygpO1xyXG4gICAgICAgIHRoaXMubWlkZGxld2FyZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0dXBEYXRhYmFzZSgpO1xyXG4gICAgICAgIHRoaXMucm91dGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ29uZmlndXJlIEV4cHJlc3MgbWlkZGxld2FyZS5cclxuICAgIHByaXZhdGUgbWlkZGxld2FyZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmV4cHJlc3MudXNlKGxvZ2dlcignZGV2JykpO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzcy51c2UoYm9keVBhcnNlci5qc29uKCkpO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzcy51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKTtcclxuICAgICAgICB0aGlzLmV4cHJlc3MudXNlKGNvcnMoKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbmZpZ3VyZSBFeHByZXNzIG1pZGRsZXdhcmUuXHJcbiAgICBwcml2YXRlIHNldHVwRGF0YWJhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgZGF0YWJhc2UuY29ubmVjdFRvU2VydmVyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbmZpZ3VyZSBBUEkgZW5kcG9pbnRzLlxyXG4gICAgcHJpdmF0ZSByb3V0ZXMoKTogdm9pZCB7XHJcbiAgICAgICAgLyogVGhpcyBpcyBqdXN0IHRvIGdldCB1cCBhbmQgcnVubmluZywgYW5kIHRvIG1ha2Ugc3VyZSB3aGF0IHdlJ3ZlIGdvdCBpc1xyXG4gICAgICAgICAqIHdvcmtpbmcgc28gZmFyLiBUaGlzIGZ1bmN0aW9uIHdpbGwgY2hhbmdlIHdoZW4gd2Ugc3RhcnQgdG8gYWRkIG1vcmVcclxuICAgICAgICAgKiBBUEkgZW5kcG9pbnRzICovXHJcbiAgICAgICAgbGV0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcbiAgICAgICAgLy8gcGxhY2Vob2xkZXIgcm91dGUgaGFuZGxlclxyXG4gICAgICAgIHJvdXRlci5nZXQoJy8nLCAocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdIZWxsbyBXb3JsZCEnLFxyXG4gICAgICAgICAgICAgICAgYXJyYXk6WzEyLDEzLHtob2xhOlwibXVuZG8gdjNcIn1dXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vQWNhIHlvIHBvbmRyaWEgdG9kYXMgbGFzIHJ1dGFzIGRlIG1pIGFwcFxyXG4gICAgICAgIHRoaXMuZXhwcmVzcy51c2UoJy8nLCByb3V0ZXIpO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzcy51c2UoJy9hcGkvdjEvdG9kb3MnLCBUb2RvUm91dGVyKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBBcHAoKS5leHByZXNzOyJdLCJzb3VyY2VSb290IjoiIn0=
