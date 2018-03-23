var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var http = require('http');
var url = "mongodb://localhost:27017/";

MongoClient.connect(url,(err, db) => {
  if (err) throw err;
  
  // Connect to the db
  var dbo = db.db("incidents");
  var col = dbo.collection("incidents");
  // Trouver le nombre de déraillements par anv
  var req1 = col.find({ "fields.type" : {$regex : /(D|d)éraillement/} }).sort({"fields.date" : 1}).toArray((err, res) => {
    if (err) throw err;

    var date = ["2014", "2015", "2016", "2017", "2018"];
    var datematches = [0,0,0,0,0];

    for (i = 0; i < res.length; i++) {
      for (u = 0; u < date.length; u++) {
        if (date[u] === res[i].fields.date.split('-')[0]) {
          datematches[u] = datematches[u] + 1;
          break;
        }
      }
    }
    var sum = datematches[0] + datematches[1] + datematches[2] + datematches[3] + datematches[4];
    for(i = 0; i < date.length; i++) {
      console.log("En " + date[i] + " : " + datematches[i] + " déraillements (" + Math.round((datematches[i] / sum)*100) + " %)");
    }
    db.close();
    return datematches;
  });
});
