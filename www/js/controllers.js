angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
}
)
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($ionicPlatform, $ionicPopup,$scope,$cordovaBLE,$timeout) {
  
    var service_uuid = '1810';
    var characteristic_uuid = '2a35';
    var foundHeartRateMonitor = false;
    $scope.data = [];
    $scope.flag = 0;


    var onData = function(buffer) {
        alert(buffer);
        $scope.data = new Uint16Array(buffer);
        alert($scope.data);
        $scope.flag = 1;
        alert("flag a 1");
    }

    var failureConnect = function(reason) {
        alert("No conectado por "+ reason);
    }

    var onConnect = function(peripheral) {
        alert("Connected to " + peripheral.id);
        ble.startNotification(peripheral.id, service_uuid, characteristic_uuid, onData, failureConnect)
    }

    var onScan = function(peripheral) {
        // this is demo code, assume there is only one heart rate monitor
        alert("Found " + JSON.stringify(peripheral));
        foundHeartRateMonitor = true;

        ble.connect(peripheral.id, onConnect, onDisconnect);
    }

    var onDisconnect = function(reason) {
        alert("Disconnected " + reason);
    }

    var failureScan = function() {
        alert("No encuentra nada en el scan.");
    }

    ble.isEnabled( function() {
        alert("Bluetooth is enabled");
    },function() {
        alert("Bluetooth is *not* enabled");
      }
    );

    ble.scan([service_uuid], 15, onScan, failureScan );

    alert("Todo acabado");
  
})

    // var service_uuid = '1810';
    // var characteristic_uuid = '2a35';
    // var dispositivo = {};
    // dispositivo.id = '78:A5:04:8E:C8:20';

    // var onData = function(buffer) {
    //     var data = new Uint16Array(buffer);
    //     alert(data[0]);
    // }

    // var failure = function() {

    //     alert("Imposible leer datos");

    // };

    // var Connect = function(dispositivo) {
    //     alert("Conectado a: ",dispositivo.id);
    //     ble.startNotification('78:A5:04:8E:C8:20', '1810', '2a35', onData, failure);
    // };

    // var Disconnect = function(reason) {
    //     alert("Imposible conectar: ",reason);
    // };

    // alert("Intento de conexión");
        
    // ble.connect('78:A5:04:8E:C8:20', Connect, Disconnect);

    // alert("Probamos de otra manera");

    // ble.startNotification('78:A5:04:8E:C8:20', '1810', '2a35', onData, failure);
      
    

  // });


      // ble.isEnabled(
    //   function() {
    //       alert("Bluetooth is enabled");
    //   },
    //   function() {
    //       alert("Bluetooth is *not* enabled");
    //   }
    // );

    // ble.startScan([], function(device) {
    //     alert(JSON.stringify(device));
    // });


    // ble.read(macAddress, service_uuid, characteristic_uuid,  function(buffer) {
    //     var data = new Uint8Array(buffer);
    //     alert(JSON.stringify(data));
    // });


    // setTimeout(ble.stopScan,
    //     25000,
    //     function() { alert("Scan complete"); },
    //     function() { alert("stopScan failed"); }
    // );
    

    // $scope.conectoYleo = function() {

    //   bluetoothSerial.isEnabled(
    //   function() {
    //     alert("Bluetooth is enabled");
    //   },
    //   function() {
    //     alert("Bluetooth is *not* enabled");
    //   }
    // );

    // bluetoothSerial.discoverUnpaired(function(devices) {
    //   devices.forEach(function(device) {
    //     encontrados[i] = device ;
    //     // showAlert();
    //       // An alert dialog
    //      // $scope.showAlert = function() {
    //      //   var alertPopup = $ionicPopup.alert({
    //      //     title: encontrados[i].name,
    //      //     template: encontrados[i].id
    //      //   });
    //      // };
    //     alert(encontrados[i].name +" "+ encontrados[i].id);
    //     i++;
    //   })

    // flag = 1;
 

    //   });

    // };


// var app = {
//     initialize: function() {
//         this.bindEvents();
//     },
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//     },
//     onDeviceReady: function() {
//         app.scan();
//     },
//     scan: function() {
//         app.status("Scanning for Heart Rate Monitor");

//         var foundHeartRateMonitor = false;

//         function onScan(peripheral) {
//             // this is demo code, assume there is only one heart rate monitor
//             console.log("Found " + JSON.stringify(peripheral));
//             foundHeartRateMonitor = true;

//             ble.connect(peripheral.id, app.onConnect, app.onDisconnect);
//         }

//         function scanFailure(reason) {
//             alert("BLE Scan Failed");
//         }

//         ble.scan([service_uuid], 5, onScan, scanFailure);

//         setTimeout(function() {
//             if (!foundHeartRateMonitor) {
//                 app.status("Did not find a heart rate monitor.");
//             }
//         }, 5000);
//     },
//     onConnect: function(peripheral) {
//         app.status("Connected to " + peripheral.id);
//         ble.notify(peripheral.id, service_uuid, characteristic_uuid, app.onData, app.onError);
//     },
//     onDisconnect: function(reason) {
//         alert("Disconnected " + reason);
//         beatsPerMinute.innerHTML = "...";
//         app.status("Disconnected");
//     },
//     onData: function(buffer) {
//         // assuming heart rate measurement is Uint8 format, real code should check the flags
//         // See the characteristic specs http://goo.gl/N7S5ZS
//         var data = new Uint8Array(buffer);
//         beatsPerMinute.innerHTML = data[1];
//     },
//     onError: function(reason) {
//         alert("There was an error " + reason);
//     },
//     status: function(message) {
//         alert(message);
//         statusDiv.innerHTML = message;
//     }
//     };

//   $ionicPlatform.ready(function(){
    
//     // app.scan();


//     $scope.conectar = function (){

//         alert(JSON.stringify(device));
//         // ble.connect(device.id, app.onConnect, app.onDisconnect);

//     };
    
//     ble.isEnabled(
//       function() {
//           alert("Bluetooth is enabled");
//       },
//       function() {
//           alert("Bluetooth is *not* enabled");
//       }
//     );

//     ble.startScan([], conectar());

//     ble.startNotification(deviceId, '1810', '2a35', onData, failure)