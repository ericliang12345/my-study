var mqtt = require('mqtt');

var VGW_ID_PREFIX = '0000';
var CONN_ID_PREFIX = '0007';
var SENHUB_ID_PREFIX = '0017';

client  = mqtt.connect('mqtt://127.0.0.1');
client.queueQoSZero = false;

client.on('connect', function () {
  console.log('[wise_snail] mqtt connect !!!!');
})


client.on('message', function (topic, message) {
  // message is Buffer 
  console.log('--------------------------------------------------------------');
  console.log('topic=' + topic.toString() );
  console.log('msg=' + message.toString());
  
  try {
      var jsonObj = JSON.parse(message.toString());
  } catch (e) {
      console.error(e);
      return;
  }
  console.log('--------------------------------------------------------------');
  
})



function vgw_connect(dev_type, ver, vgw_mac, connected ){
  
  var msg='{\"susiCommData\":{\"devID\":\"0000000E4CABCD99\",\"parentID\":\"\",\
            \"hostname\":\"IotGW(CDEF)\",\"sn\":\"000E4CABCD99\",\"mac\":\"000E4CABCD99\",\
            \"version\":\"3.1.23\",\"type\":\"IoTGW\",\"product\":\"\",\
            \"manufacture\":\"\",\"account\":\"\",\"passwd\":\"\",\"status\":1,\"commCmd\":1,\
            \"requestID\":21,\"agentID\":\"0000000E4CABCD99\",\
            \"handlerName\":\"general\",\"sendTS\":{\"$date\":1469512074}}}';
   
  var msgObj = JSON.parse(msg);
 
  msgObj.susiCommData.type = dev_type;
  msgObj.susiCommData.version = ver;
  msgObj.susiCommData.mac = vgw_mac;
  msgObj.susiCommData.sn = vgw_mac;
  msgObj.susiCommData.hostname = dev_type + '('+ vgw_mac.substr(8,4) + ')';
  msgObj.susiCommData.devID = VGW_ID_PREFIX + vgw_mac;
  msgObj.susiCommData.agentID = VGW_ID_PREFIX + vgw_mac;
  msgObj.susiCommData.sendTS.$date = new Date().getTime();
  
  if ( connected === true ){
    msgObj.susiCommData.status = 1;
  }
  else{
    msgObj.susiCommData.status = 0;
  }
  
  var topic = '/cagent/admin/' + msgObj.susiCommData.devID + '/agentinfoack';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);
  
}

function vgw_send_os_info( dev_type, ver, vgw_mac, is_ip_base ){
  
  var msg='{\"susiCommData\":{\"osInfo\":{\"cagentVersion\":\"3.1.23\",\
  \"cagentType\":\"IoTGW\",\"osVersion\":\"SnailOS\",\"biosVersion\":\"\",\"platformName\":\"\",\"processorName\":\"SnailGW\",\
  \"osArch\":\"SnailX86\",\"totalPhysMemKB\":123,\"macs":"000E40ABCD99\",\"IP\":\"0.0.0.0\"},\"commCmd\":116,\"requestID\":109,\
  \"agentID\":\"0000000E40ABCD99\",\"handlerName\":\"general\",\"sendTS\":1466730390}}';
   
  var msgObj = JSON.parse(msg);
 
  msgObj.susiCommData.osInfo.cagentType = dev_type;
  msgObj.susiCommData.osInfo.cagentVersion = ver;
  msgObj.susiCommData.osInfo.macs= vgw_mac;
  msgObj.susiCommData.agentID = VGW_ID_PREFIX + vgw_mac;
  msgObj.susiCommData.sendTS = new Date().getTime();
  
  if ( is_ip_base === true ){
    msgObj.susiCommData.osInfo.IP = '0.0.0.0';
  }
  else{
    msgObj.susiCommData.osInfo.IP = '';
  }
  
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);
}

function vgw_send_info_spec( vgw_mac, msgObj ){
  //
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);
}

function vgw_send_info( vgw_mac, connObj ){
  
  /*
  var msg='{\"susiCommData\":{\"infoSpec\":{\"IoTGW\":{\"Ethernet\":{\"Ethernet\":{\"Info\":{\"e\":[{\"n\":\"SenHubList\",\
            \"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Name\",\"sv\":\"Ethernet\",\"asm\":\"r\"},\
            {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
            {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\"bn\":\"Info\"},\"bn\":\"0007000E40ABCDEF\",\"ver\":1},\
            \"bn\":\"Ethernet\",\"ver\":1},\"ver\":1}},\"commCmd\":2052,\"requestID\":2001,\"agentID\":\"0000000E40ABCDEF\",\
            \"handlerName\":\"general\",\"sendTS\":160081020}}';

  var msgObj = JSON.parse(msg);

  msgObj.susiCommData.agentID = vgw_id_prefix + vgw_mac;
  msgObj.susiCommData.sendTS = new Date().getTime();
  //create connectivity and assigne InfoMsg
  msgObj.susiCommData.infoSpec.IoTGW = {};
  for (key in connObj) {
      if (connObj.hasOwnProperty(key)) {
        //console.log( key + ', keyVal=======>' + connObj[key]);
        //console.log( 'type=======>' + connObj[key]['type']);
        //console.log( 'bnName=======>' + connObj[key]['bnName']);
        var conn_type= connObj[key]['type'];
        var conn_bnName = connObj[key]['bnName'];
        var conn_info = connObj[key]['info'];
        
        if ( msgObj.susiCommData.infoSpec.IoTGW.hasOwnProperty(conn_type) === false ){
          //console.log( 'create type ========: ' + conn_type);
          msgObj.susiCommData.infoSpec.IoTGW[conn_type]={};
        }
        if ( msgObj.susiCommData.infoSpec.IoTGW.hasOwnProperty(conn_bnName) === false ){
          //console.log( 'create conn_bnName ========: ' + conn_bnName);
          msgObj.susiCommData.infoSpec.IoTGW[conn_type][conn_bnName]={};
        }
        //assign value
        msgObj.susiCommData.infoSpec.IoTGW['ver'] = 1;
        msgObj.susiCommData.infoSpec.IoTGW[conn_type]['bn'] = conn_type;
        msgObj.susiCommData.infoSpec.IoTGW[conn_type]['ver'] = 1;
        msgObj.susiCommData.infoSpec.IoTGW[conn_type][conn_bnName]['Info'] = conn_info;
        msgObj.susiCommData.infoSpec.IoTGW[conn_type][conn_bnName]['bn'] = conn_bnName;
        msgObj.susiCommData.infoSpec.IoTGW[conn_type][conn_bnName]['ver'] = 1;
      }
   }  
  //
  var topic = '/cagent/admin/' + msgObj.susiCommData.agentID + '/agentactionreq';
  var message = JSON.stringify(msgObj);
  client.publish(topic, message);
  */
}

function ttt(){
  
  console.log('tttttttttttttttttttttttttttttttttttttttttt');
  
  var msg = '{\"susiCommData\":{\"infoSpec\":{\"IoTGW\":{\"Ethernet\":{\"Ethernet\":{\"Info\":{\"e\":[{\"n\":\"SenHubList\",\
            \"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Name\",\"sv\":\"Ethernet\",\"asm\":\"r\"},\
            {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
            {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\"bn\":\"Info\"},\"bn\":\"0007000E40ABCDEF\",\"ver\":1},\
            \"bn\":\"Ethernet\",\"ver\":1},\"ver\":1}},\"commCmd\":2052,\"requestID\":2001,\"agentID\":\"0000000E40ABCDEF\",\
            \"handlerName\":\"general\",\"sendTS\":160081020}}';
   try {
      var jsonObj = JSON.parse(msg.toString());
  } catch (e) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.error(e);
      return;
  }
}

function create_connMsg( vgw_mac, connObj, callback ){

  var msg='{\"susiCommData\":{\"infoSpec\":{\"IoTGW\":{\"Ethernet\":{\"Ethernet\":{\"Info\":{\"e\":[{\"n\":\"SenHubList\",\
            \"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},{\"n\":\"Name\",\"sv\":\"Ethernet\",\"asm\":\"r\"},\
            {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},{\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
            {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\"bn\":\"Info\"},\"bn\":\"0007000E40ABCDEF\",\"ver\":1},\
            \"bn\":\"Ethernet\",\"ver\":1},\"ver\":1}},\"commCmd\":2052,\"requestID\":2001,\"agentID\":\"0000000E40ABCDEF\",\
            \"handlerName\":\"general\",\"sendTS\":160081020}}';

  var msgObj = JSON.parse(msg);

  msgObj.susiCommData.agentID = VGW_ID_PREFIX + vgw_mac;
  msgObj.susiCommData.sendTS = new Date().getTime();
  //create connectivity and assigne InfoMsg
  msgObj.susiCommData.infoSpec.IoTGW = {};
  for (key in connObj) {
      if (connObj.hasOwnProperty(key)) {
        //console.log( key + ', keyVal=======>' + connObj[key]);
        //console.log( 'type=======>' + connObj[key]['type']);
        //console.log( 'bnName=======>' + connObj[key]['bnName']);
        var conn_type= connObj[key]['type'];
        var conn_bnName = connObj[key]['bnName'];
        var conn_info = connObj[key]['info'];
        
        if ( msgObj.susiCommData.infoSpec.IoTGW.hasOwnProperty(conn_type) === false ){
          //console.log( 'create type ========: ' + conn_type);
          msgObj.susiCommData.infoSpec.IoTGW[conn_type]={};
        }
        if ( msgObj.susiCommData.infoSpec.IoTGW.hasOwnProperty(conn_bnName) === false ){
          //console.log( 'create conn_bnName ========: ' + conn_bnName);
          msgObj.susiCommData.infoSpec.IoTGW[conn_type][conn_bnName]={};
        }
        //assign value
        msgObj.susiCommData.infoSpec.IoTGW['ver'] = 1;
        msgObj.susiCommData.infoSpec.IoTGW[conn_type]['bn'] = conn_type;
        msgObj.susiCommData.infoSpec.IoTGW[conn_type]['ver'] = 1;
        msgObj.susiCommData.infoSpec.IoTGW[conn_type][conn_bnName]['Info'] = conn_info;
        msgObj.susiCommData.infoSpec.IoTGW[conn_type][conn_bnName]['bn'] = conn_bnName;
        msgObj.susiCommData.infoSpec.IoTGW[conn_type][conn_bnName]['ver'] = 1;
      }
   }    
  
  callback( msgObj );
}

function create_connObj_info( connObj, callback ){
  
  //var connObjInfo;
  //console.log('*****************************************');
  //console.log(JSON.stringify(connObj));
  
  for (key in connObj) {
      if (connObj.hasOwnProperty(key)) {
        //console.log('***************************************** key=' + key);
        if ( key === 'asm'){ 
          delete connObj['asm'];
        }
      }
   }
  
  for (key in connObj) {
      if (connObj.hasOwnProperty(key)) {
          //console.log(key + " ===> " + jsonObj[key] + " ,type = " + typeof jsonObj[key]);
          if (typeof connObj[key] === 'object' ){
              create_connObj_info( connObj[key], '' );
          }
      }
   }   
 
  if ( typeof callback === 'function'){
    callback( connObj );
  }
}

module.exports = {
  test: function() {
    console.log('[wise_snail] test');
    var mac='000E4CABCD77';
    var dev_type='IoTGW';
    var ver = '3.1.23';
    var infoSpec1 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Name\",\"sv\":\"BLE\",\"asm\":\"r\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
                       {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\
               \"bn\":\"Info\"}';
  
    var infoSpec2 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Name\",\"sv\":\"BLE\",\"asm\":\"r\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
                       {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\
               \"bn\":\"Info\"}';
  
    var infoSpec3 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"\",\"asm\":\"r\"},\
                       {\"n\":\"Name\",\"sv\":\"WSN\",\"asm\":\"r\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\",\"asm\":\"r\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\",\"asm\":\"r\"},\
                       {\"n\":\"reset\",\"bv\":\"0\",\"asm\":\"rw\"}],\
               \"bn\":\"Info\"}';
   
    var infoSpecObj={conn1:{ type: 'BLE', bnName: CONN_ID_PREFIX + '000E40ABCD31', info: JSON.parse(infoSpec1)},
               conn2:{ type: 'BLE', bnName: CONN_ID_PREFIX + '000E40ABCD32', info: JSON.parse(infoSpec2) },
               conn3:{ type: 'WSN', bnName: CONN_ID_PREFIX + '000E40ABCD33', info: JSON.parse(infoSpec3) }
              }; 
    
    var info1 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"0017000E40000000,0017000E40000001\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"0017000E40000000,0017000E40000001\"},\
                       {\"n\":\"Name\",\"sv\":\"BLE\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\"},\
                       {\"n\":\"reset\",\"bv\":\"0\"}],\
               \"bn\":\"Info\"}';
  
    var info2 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"\"},\
                       {\"n\":\"Name\",\"sv\":\"BLE\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\"},\
                       {\"n\":\"reset\",\"bv\":\"0\"}],\
               \"bn\":\"Info\"}';
  
    var info3 = '{\"e\":[{\"n\":\"SenHubList\",\"sv\":\"\"},\
                       {\"n\":\"Neighbor\",\"sv\":\"\"},\
                       {\"n\":\"Name\",\"sv\":\"WSN\"},\
                       {\"n\":\"Health\",\"v\":\"100.000000\"},\
                       {\"n\":\"sw\",\"sv\":\"1.2.1.12\"},\
                       {\"n\":\"reset\",\"bv\":\"0\"}],\
               \"bn\":\"Info\"}';
   
    var infoObj={conn1:{ type: 'BLE', bnName: CONN_ID_PREFIX + '000E40ABCD31', info: JSON.parse(info1)},
               conn2:{ type: 'BLE', bnName: CONN_ID_PREFIX + '000E40ABCD32', info: JSON.parse(info2) },
               conn3:{ type: 'WSN', bnName: CONN_ID_PREFIX + '000E40ABCD33', info: JSON.parse(info3) }
              };    
    
    //-----------------------------------------------
    vgw_connect(dev_type, ver, mac, true);
    vgw_send_os_info(dev_type, ver,  mac, false);   
    var infoSpecMsgObj;
    var infoMsgObj;
    create_connMsg(mac, infoSpecObj, function( msgObj ){
      console.log('create connectivity InfoSpec message object'); 
      console.log('================================================');
      infoSpecMsgObj = msgObj;
      console.log(JSON.stringify(infoSpecMsgObj));
    });
    vgw_send_info_spec(mac, infoSpecMsgObj);
    //
    create_connMsg(mac, infoObj, function( msgObj ){
      console.log('create connectivity Info message object'); 
      console.log('================================================');
      infoMsgObj = msgObj;
      console.log(JSON.stringify(infoMsgObj));
    });    
    /*
    create_connObj_info(connectivityObj, function( connObjInfo){
      console.log('create connectivity object Info'); 
      console.log('================================================');
      connectivityObjInfo = connObjInfo;
      //console.log(JSON.stringify(connectivityObjInfo));
    });
    */
    
    return;
  },
};
