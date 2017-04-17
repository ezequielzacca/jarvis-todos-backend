
import * as mongodb from "mongodb";
let MongoClient = mongodb.MongoClient;

let _db;



  export function connectToServer(){
    console.log("Connect to server called")
    MongoClient.connect( "mongodb://heroku_knvtm4lh:8tdual8pdrgn2g0v99ta8qpbch@ds161960.mlab.com:61960/heroku_knvtm4lh", function( err, db ) {
        if(err){
            console.log(err);
        }
      _db = db;
      console.log("Database started");
      
    } );
  };

  export function getDB() {
    return _db;
  }
