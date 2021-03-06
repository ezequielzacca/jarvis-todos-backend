"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var debug = require("debug");
var socketio = require("socket.io");
var app_1 = require("./app");
debug('ts-express:server');
var port = normalizePort(process.env.PORT || 3002);
app_1.default.set('port', port);
var server = http.createServer(app_1.default);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
var io = socketio(server);
io.on('connection', function (socket) {
    console.log('User connected');
});
function normalizePort(val) {
    var port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
}
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    var bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    var addr = server.address();
    var bind = (typeof addr === 'string') ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUE2QjtBQUM3Qiw2QkFBK0I7QUFDL0Isb0NBQXFDO0FBRXJDLDZCQUF3QjtBQUV4QixLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUUzQixJQUFNLElBQUksR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUM7QUFDckQsYUFBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFFdEIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFHLENBQUMsQ0FBQztBQUV0QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzVCLE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3BDLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQixFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFDLE1BQU07SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQyxDQUFDO0FBQ0gsdUJBQXVCLEdBQWtCO0lBQ3JDLElBQUksSUFBSSxHQUFXLENBQUMsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDdkUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUM1QixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEMsSUFBSTtRQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDdEIsQ0FBQztBQUVELGlCQUFpQixLQUE0QjtJQUN6QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQztRQUFDLE1BQU0sS0FBSyxDQUFDO0lBQzVDLElBQUksSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLEdBQUcsT0FBTyxHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3hFLE1BQU0sQ0FBQSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLEtBQUssUUFBUTtZQUNULE9BQU8sQ0FBQyxLQUFLLENBQUksSUFBSSxrQ0FBK0IsQ0FBQyxDQUFDO1lBQ3RELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEIsS0FBSyxDQUFDO1FBQ1YsS0FBSyxZQUFZO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBSSxJQUFJLHVCQUFvQixDQUFDLENBQUM7WUFDM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixLQUFLLENBQUM7UUFDVjtZQUNJLE1BQU0sS0FBSyxDQUFDO0lBQ3BCLENBQUM7QUFDTCxDQUFDO0FBRUQ7SUFDSSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDNUIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsR0FBRyxVQUFRLElBQU0sR0FBRyxVQUFRLElBQUksQ0FBQyxJQUFNLENBQUM7SUFDN0UsS0FBSyxDQUFDLGtCQUFnQixJQUFNLENBQUMsQ0FBQztBQUNsQyxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcclxuaW1wb3J0ICogYXMgZGVidWcgZnJvbSAnZGVidWcnO1xyXG5pbXBvcnQgKiBhcyBzb2NrZXRpbyBmcm9tICdzb2NrZXQuaW8nXHJcblxyXG5pbXBvcnQgQXBwIGZyb20gJy4vYXBwJztcclxuXHJcbmRlYnVnKCd0cy1leHByZXNzOnNlcnZlcicpO1xyXG5cclxuY29uc3QgcG9ydCA9IG5vcm1hbGl6ZVBvcnQocHJvY2Vzcy5lbnYuUE9SVCB8fCAzMDAyKTtcclxuQXBwLnNldCgncG9ydCcsIHBvcnQpO1xyXG5cclxuY29uc3Qgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoQXBwKTtcclxuXHJcbnNlcnZlci5saXN0ZW4ocG9ydCk7XHJcbnNlcnZlci5vbignZXJyb3InLCBvbkVycm9yKTtcclxuc2VydmVyLm9uKCdsaXN0ZW5pbmcnLCBvbkxpc3RlbmluZyk7XHJcbmxldCBpbyA9IHNvY2tldGlvKHNlcnZlcik7XHJcbmlvLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCk9PntcclxuICAgIGNvbnNvbGUubG9nKCdVc2VyIGNvbm5lY3RlZCcpO1xyXG59KTtcclxuZnVuY3Rpb24gbm9ybWFsaXplUG9ydCh2YWw6IG51bWJlcnxzdHJpbmcpOiBudW1iZXJ8c3RyaW5nfGJvb2xlYW4ge1xyXG4gICAgbGV0IHBvcnQ6IG51bWJlciA9ICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykgPyBwYXJzZUludCh2YWwsIDEwKSA6IHZhbDtcclxuICAgIGlmIChpc05hTihwb3J0KSkgcmV0dXJuIHZhbDtcclxuICAgIGVsc2UgaWYgKHBvcnQgPj0gMCkgcmV0dXJuIHBvcnQ7XHJcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25FcnJvcihlcnJvcjogTm9kZUpTLkVycm5vRXhjZXB0aW9uKTogdm9pZCB7XHJcbiAgICBpZiAoZXJyb3Iuc3lzY2FsbCAhPT0gJ2xpc3RlbicpIHRocm93IGVycm9yO1xyXG4gICAgbGV0IGJpbmQgPSAodHlwZW9mIHBvcnQgPT09ICdzdHJpbmcnKSA/ICdQaXBlICcgKyBwb3J0IDogJ1BvcnQgJyArIHBvcnQ7XHJcbiAgICBzd2l0Y2goZXJyb3IuY29kZSkge1xyXG4gICAgICAgIGNhc2UgJ0VBQ0NFUyc6XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYCR7YmluZH0gcmVxdWlyZXMgZWxldmF0ZWQgcHJpdmlsZWdlc2ApO1xyXG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0VBRERSSU5VU0UnOlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGAke2JpbmR9IGlzIGFscmVhZHkgaW4gdXNlYCk7XHJcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uTGlzdGVuaW5nKCk6IHZvaWQge1xyXG4gICAgbGV0IGFkZHIgPSBzZXJ2ZXIuYWRkcmVzcygpO1xyXG4gICAgbGV0IGJpbmQgPSAodHlwZW9mIGFkZHIgPT09ICdzdHJpbmcnKSA/IGBwaXBlICR7YWRkcn1gIDogYHBvcnQgJHthZGRyLnBvcnR9YDtcclxuICAgIGRlYnVnKGBMaXN0ZW5pbmcgb24gJHtiaW5kfWApO1xyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==
