"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var _db;
function connectToServer() {
    console.log("Connect to server called");
    MongoClient.connect("mongodb://localhost/jarvis_todos", function (err, db) {
        if (err) {
            console.log(err);
        }
        _db = db;
        console.log("Database started");
    });
}
exports.connectToServer = connectToServer;
;
function getDB() {
    return _db;
}
exports.getDB = getDB;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kYXRhYmFzZS9kYXRhYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlDQUFtQztBQUNuQyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBRXRDLElBQUksR0FBRyxDQUFDO0FBSU47SUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUE7SUFDdkMsV0FBVyxDQUFDLE9BQU8sQ0FBRSxrQ0FBa0MsRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUFFO1FBQ3RFLEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUM7UUFDSCxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRWxDLENBQUMsQ0FBRSxDQUFDO0FBQ04sQ0FBQztBQVZELDBDQVVDO0FBQUEsQ0FBQztBQUVGO0lBQ0UsTUFBTSxDQUFDLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFGRCxzQkFFQyIsImZpbGUiOiJkYXRhYmFzZS9kYXRhYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgKiBhcyBtb25nb2RiIGZyb20gXCJtb25nb2RiXCI7XHJcbmxldCBNb25nb0NsaWVudCA9IG1vbmdvZGIuTW9uZ29DbGllbnQ7XHJcblxyXG5sZXQgX2RiO1xyXG5cclxuXHJcblxyXG4gIGV4cG9ydCBmdW5jdGlvbiBjb25uZWN0VG9TZXJ2ZXIoKXtcclxuICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdCB0byBzZXJ2ZXIgY2FsbGVkXCIpXHJcbiAgICBNb25nb0NsaWVudC5jb25uZWN0KCBcIm1vbmdvZGI6Ly9sb2NhbGhvc3QvamFydmlzX3RvZG9zXCIsIGZ1bmN0aW9uKCBlcnIsIGRiICkge1xyXG4gICAgICAgIGlmKGVycil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICBfZGIgPSBkYjtcclxuICAgICAgY29uc29sZS5sb2coXCJEYXRhYmFzZSBzdGFydGVkXCIpO1xyXG4gICAgICBcclxuICAgIH0gKTtcclxuICB9O1xyXG5cclxuICBleHBvcnQgZnVuY3Rpb24gZ2V0REIoKSB7XHJcbiAgICByZXR1cm4gX2RiO1xyXG4gIH1cclxuIl0sInNvdXJjZVJvb3QiOiIuLiJ9