const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8000;
const cors = require("cors");
const path = require("path");
const Graph = require("./graph").Graph;
const Edge = require("./graph").Edge;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port);

app.get("/", function (req, res) {
  fs = require("fs");
  var parseString = require("xml2js").parseString;
  var json;
  fs.readFile("map.xml", function (err, buf) {
    xmlData = buf.toString();

    parseString(xmlData, async function (err, result) {
      json = result;
      var nodes = json.osm.node;
      var ways = json.osm.way;

      var g = new Graph("London");

      Object.keys(nodes).forEach(function (key) {
        var val = nodes[key];

        g.addNode(val.$.id, val.$.lon, val.$.lat);
      });
      Object.keys(ways).forEach(function (key) {
        var val = ways[key];

        for (var i = 0; i < val.nd.length - 1; i++) {
          g.addEdge(new Edge(val.nd[i].$.ref, val.nd[i + 1].$.ref, 0));
        }
      });
    });
  });
});

app.post("/", function (req, res) {
  let src_lat = req.body.node1.lat;
  let src_lon = req.body.node1.lng;
  let dest_lat = req.body.node2.lat;
  let dest_lon = req.body.node2.lng;

  fs = require("fs");
  var parseString = require("xml2js").parseString;
  var json;
  fs.readFile("map.xml", function (err, buf) {
    xmlData = buf.toString();
    parseString(xmlData, async function (err, result) {
      json = result;
      var nodes = json.osm.node;
      var ways = json.osm.way;

      var g = new Graph("London");

      Object.keys(nodes).forEach(function (key) {
        var val = nodes[key];
        g.addNode(val.$.id, val.$.lon, val.$.lat);
      });
      Object.keys(ways).forEach(function (key) {
        var val = ways[key];

        for (var i = 0; i < val.nd.length - 1; i++) {
          g.addEdge(new Edge(val.nd[i].$.ref, val.nd[i + 1].$.ref, 0));
        }
      });
      console.log(src_lat, src_lon, dest_lat, dest_lon);
      let src = g.getApproximate(src_lon, src_lat);
      let dest = g.getApproximate(dest_lon, dest_lat);
      console.log("src approximation: ", src);
      console.log("dest approximation: ", dest);
      let path = g.BFS(src, dest);
      res.send(path);
    });
  });
});

console.log("API server started on: " + port);
