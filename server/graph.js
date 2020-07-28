class Node {
  constructor(node_name, node_lon, node_lat) {
    this.node_name = node_name;
    this.node_lon = node_lon;
    this.node_lat = node_lat;
  }
  getName() {
    return this.node_name;
  }
}

class Edge {
  constructor(src, dest, weight) {
    this.src = src;
    this.dest = dest;
    this.weight = weight;
  }
  getSource() {
    return this.src;
  }
  getDestination() {
    return this.dest;
  }
  getWeight() {
    return this.weight;
  }
}

class Graph {
  constructor(graph_name) {
    this.graph_name = graph_name;
    this.nodes = [];
    this.nodes_hash = {};
    this.edges = {};
    this.weight = {};
  }
  getName() {
    return this.graph_name;
  }
  addNode(name, lon, lat) {
    let new_node = new Node(name, lon, lat);
    this.nodes.push(new_node);
    this.nodes_hash[name] = this.nodes.length - 1;
    this.edges[new_node.getName()] = [];
  }
  getApproximate(lon, lat) {
    var distance = Math.pow(10, 1000); // max positive number
    var estimate = null;
    for (var i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      let store = Math.sqrt(
        Math.pow(node.node_lon - lon, 2) + Math.pow(node.node_lat - lat, 2)
      );
      if (store < distance) {
        estimate = node;
        distance = store;
      }
    }
    return estimate;
  }
  getDistance(node1, node2) {
    return Math.sqrt(
      Math.pow(node1.node_lon - node2.node_lon, 2) +
        Math.pow(node1.node_lat - node2.node_lat, 2)
    );
  }
  addEdge(edge) {
    let src = edge.getSource();
    let dest = edge.getDestination();
    let weight = edge.getWeight();
    // you ought to check if the node exist
    let tempSrc = this.edges[src];
    tempSrc.push(dest);
    this.edges[src] = tempSrc;
    this.weight[src + "$" + dest] = 0;
  }
  childrenOf(node) {
    return this.edges[node.node_name];
  }

  printPath(nodes) {
    let store = "";
    for (var i = 0; i < nodes.length; i++) {
      store += nodes[i];
    }
    return store;
  }

  BFS(start, end) {
    var initPath = start;
    var tmpPath = [initPath];
    var start_name = start.node_name;
    let visited = {};
    visited[start_name] = true;

    var loop_counter = 0;

    while (true) {
      loop_counter += 1; //loop control
      var lastNode = tmpPath[tmpPath.length - 1];

      if (this.getDistance(lastNode, end) < 0.001 || loop_counter == 1000) {
        tmpPath.push(end);
        console.log("finished");
        return tmpPath;
      }
      let children = this.childrenOf(lastNode);
      var nearest_node = null;
      if (Array.isArray(children) && children.length != 0) {
        var distance = Math.pow(10, 1000); // max positive number

        for (var i = 0; i < children.length; i++) {
          let node = this.nodes[this.nodes_hash[children[i]]];
          let node_name = node.node_name;
          if (node_name in visited) continue;
          let distance_one = Math.sqrt(
            Math.pow(node.node_lon - lastNode.node_lon, 2) +
              Math.pow(node.node_lat - lastNode.node_lat, 2)
          );
          let distance_two = Math.sqrt(
            Math.pow(node.node_lon - end.node_lon, 2) +
              Math.pow(node.node_lat - end.node_lat, 2)
          );
          if (distance_one + distance_two < distance) {
            nearest_node = node;
            distance = distance_one + distance_two;
          }
        }
        if (nearest_node != null) {
          tmpPath.push(nearest_node);
          var nearest_node_name = nearest_node.node_name;
          visited[nearest_node_name] = true;
        }
      }
      if (nearest_node == null) {
        var distance = Math.pow(10, 1000); // max positive number
        for (var i = 0; i < this.nodes.length && i < 1000; i++) {
          let node = this.nodes[i];
          let distance_one = Math.sqrt(
            Math.pow(node.node_lon - lastNode.node_lon, 2) +
              Math.pow(node.node_lat - lastNode.node_lat, 2)
          );
          let distance_two = Math.sqrt(
            Math.pow(node.node_lon - end.node_lon, 2) +
              Math.pow(node.node_lat - end.node_lat, 2)
          );
          if (
            distance_one + distance_two < distance &&
            node != end &&
            node != lastNode
          ) {
            nearest_node = node;
            distance = distance_one + distance_two;
          }
        }
        if (nearest_node != null) {
          tmpPath.push(nearest_node);
          var nearest_node_name = nearest_node.node_name;
          visited[nearest_node_name] = true;
        }
      }
    }
  }
}

module.exports.Graph = Graph;
module.exports.Edge = Edge;
