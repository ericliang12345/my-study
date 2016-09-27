var express = require('express');
var greetings = require("./greetings.js");
var HashMap = require('hashmap').HashMap;
var map = new HashMap();
var app = express();

app.get('/', function (req, res) {
  // "Hello"
  greetings.sayHelloInEnglish();
  console.log('~~~~~~~~!!!!');
  // "Hola"  
  greetings.sayHelloInSpanish();  
  res.send('Hello World!');
});

app.get('/restapi/susiCommData/infoSpec/IoTGW', function (req, res) { 
  
  //
  console.log("original URL="+req.originalUrl);
  var arr = req.originalUrl.split("/");
  var cmdString;
  for (var i=0; i < arr.length ; i++){
      console.log("arr="+arr[i]);
      if ( i >=2 ){
          if ( i==2 ){
              cmdString=arr[2];
          }
          else{
              cmdString+=".";
              cmdString+=arr[i];
          }
      }
  }
  console.log("cmdString="+cmdString);
  //
  var jsonString = "{\"key\":\"value\"}";
  var jsonObj = JSON.parse(jsonString);
  console.log(jsonObj.key);
  //
  var susiString = "{\"susiCommData\":{\"infoSpec\":{\"IoTGW\":{\"WSN\":{\"WSN0\":{\"Info\":\
                    {\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},\
                    {\"n\":\"Name\",\"sv\":\"WSN0\",\"asm\":\"r\"},{\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},\
                    {\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},{\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\
                    \"bn\":\"Info\"},\"bn\":\"0007000E40ABCDEF\",\"ver\":1},\"bn\":\"WSN\",\"ver\":1},\"ver\":1}},\
                    \"commCmd\":2052,\"requestID\":2001,\"agentID\":\"0000000E40ABCDEF\",\"handlerName\":\"general\",\
                    \"sendTS\":160081020}}";
   var susiObj = JSON.parse(susiString);
   
   //
   for (key in susiObj) {
       if (susiObj.hasOwnProperty(key)) {
           console.log(key + " ===> " + susiObj[key]);
           for (key2 in susiObj[key]) {
               console.log(   key2 + " ======> " + susiObj[key][key2]);
           }
       }
   } 
   //
   console.log("Object.keys(susiObj)[0]="+Object.keys(susiObj)[0]); 
    Object.keys(susiObj).forEach(function(k) {
        console.log("k="+k); 
    });

   //
   var string = JSON.stringify(susiObj.susiCommData.infoSpec.IoTGW.WSN.WSN0.Info);
   console.log("string="+string); 
  
   var myStr="susiCommData.infoSpec.IoTGW.WSN.WSN0.Info.e";
   for (var i = 0; i < susiObj.susiCommData.infoSpec.IoTGW.WSN.WSN0.Info.e.length; i++) { 
       console.log(susiObj.susiCommData.infoSpec.IoTGW.WSN.WSN0.Info.e[i]); 
   }
   
   //   
  
   res.send(susiString);
  
});

app.get('/sethash', function (req, res) { 
  
  var cat1 = {colour: "red", name: "Spot1", size: 46};
  var cat2 = {colour: "blue", name: "Spot2", size: 36};
  var cat3 = {colour: "green", name: "Spot3", size: 26};
  //
  map.set("key1", cat1);
  map.set("key2", cat2);
  map.set("key3", cat3);
  
  res.send('/set/Hello World!');
});

app.get('/gethash', function (req, res) {
  
  var cat=map.get("key1");
  if (typeof cat != "undefined") {
      console.log('get cat.colour='+cat.colour);  
      cat.colour="gray";
  }
  //
  map.forEach(function(obj, key) {
      if (typeof obj != "undefined") {
          console.log(key + " : " + obj.colour);
      }
  });  
  res.send('/get/Hello World!');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!!!!');
});
