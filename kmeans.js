//
//
var clusterMaker = require('clusters');
var http = require('http');

var fs = require('fs');
http.createServer(function (req, res) {
  fs.readFile('coords.csv', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    data=String(data);

    coordsRaw=data.split("\n");
    coords=new Array();

    // console.log(coordsRaw);
    for(var i=0;i<coordsRaw.length-1;i++)
    {
      temp=coordsRaw[i].split(",");
      temp.map(function(y,i,arr){arr[i]=parseFloat(y)})

      coords.push(temp);
    }
    // console.log(coords);
    // number of clusters, defaults to undefined
    // x.map(function(y,i,arr){arr[i]=parseFloat(y)})

    clusterMaker.k(3);

    //number of iterations (higher number gives more time to converge), defaults to 1000
    console.log(temp)
    clusterMaker.iterations(750);
    x=[[1.5,2],[2.5,3],[1.32,2.34],[1.345,345],[2.43,3.54]];
    console.log(typeof(coords[0][0]),typeof(x[0][0]));
    console.log(coords);
    //data from which to identify clusters, defaults to []
    clusterMaker.data(coords);
    console.log(clusterMaker.clusters());
    // for(var i=0;i<5;i++)
    //   console.log(  kmeans(coords, 5, "euclidean",10000)[1][i].length);
    res.end();
  });
}).listen(8080);


var distances = {
  euclidean: function(v1, v2) {
      var total = 0;
      for (var i = 0; i < v1.length; i++) {

         total += Math.pow(v2[i] - v1[i], 2);
      }
      return Math.sqrt(total);
   },
   manhattan: function(v1, v2) {
     var total = 0;
     for (var i = 0; i < v1.length ; i++) {
        total += Math.abs(v2[i] - v1[i]);
     }
     return total;
   },
   max: function(v1, v2) {
     var max = 0;
     for (var i = 0; i < v1.length; i++) {
        max = Math.max(max , Math.abs(v2[i] - v1[i]));
     }
     return max;
   }
};

function randomCentroids(points, k) {
   var centroids = points.slice(0); // copy
   centroids.sort(function() {
      return (Math.round(Math.random()) - 0.5);
   });
   return centroids.slice(0, k);
}

function closestCentroid(point, centroids, distance) {
   var min = Infinity,
       index = 0;
   for (var i = 0; i < centroids.length; i++) {
      var dist = distance(point, centroids[i]);
      if (dist < min) {
         min = dist;
         index = i;
      }
   }
   return index;
}

function kmeans(points, k, distance,iter) {
   k = k || Math.max(2, Math.ceil(Math.sqrt(points.length / 2)));

   distance = distance || "euclidean";
   if (typeof distance == "string") {
      distance = distances[distance];
   }

   var centroids = randomCentroids(points, k);
   var assignment = new Array(points.length);
   var clusters = new Array(k);

   var iterations = 0;
   var movement = true;
   var x=0;
   while (movement && x<iter) {
      // update point-to-centroid assignments
      x+=1;
      for (var i = 0; i < points.length; i++) {
         assignment[i] = closestCentroid(points[i], centroids, distance);
      }

      // update location of each centroid
      movement = false;
      for (var j = 0; j < k; j++) {
         var assigned = [];
         for (var i = 0; i < assignment.length; i++) {
            if (assignment[i] == j) {
               assigned.push(points[i]);
            }
         }

         if (!assigned.length) {
            continue;
         }
         var centroid = centroids[j];
         var newCentroid = new Array(centroid.length);

         for (var g = 0; g < centroid.length; g++) {
            var sum = 0;
            for (var i = 0; i < assigned.length; i++) {
               sum += assigned[i][g];
            }
            newCentroid[g] = sum / assigned.length;

            if (newCentroid[g] != centroid[g]) {
               movement = true;
            }
         }
         centroids[j] = newCentroid;
         clusters[j] = assigned;
      }

      // if (snapshotCb && (iterations++ % snapshotPeriod == 0)) {
      //    snapshotCb(clusters);
      // }
   }

   centClust=new Array(2);
   centClust[0]=centroids
   centClust[1]=clusters

   return centClust ;
}
