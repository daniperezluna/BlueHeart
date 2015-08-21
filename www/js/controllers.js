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

.controller('AccountCtrl', function($ionicPlatform, $ionicPopup,$scope,$cordovaBLE,$timeout,$http,$sce,envioFactory) {
  
    var service_uuid = '1810';
    var characteristic_uuid = '2a35';
    var foundHeartRateMonitor = false;
    $scope.datosLeidos = null;

    $scope.enviarDatos = function () {
        
        envioFactory.enviarDatos($scope.datosLeidos);
    };
        
    function bytesToFloat(b0, b1) {
        var mantissa = unsignedToSigned(unsignedByteToInt(b0)
            + ((unsignedByteToInt(b1) & 0x0F) << 8), 12);
            
        var exponent = unsignedToSigned(unsignedByteToInt(b1) >> 4, 4);
        
        return mantissa * Math.pow(10, exponent);
    }

    function unsignedByteToInt(b) {
        return b & 0xFF;
    }

    function unsignedToSigned(unsigned, size) {
        var signed = unsigned;
        
        if ((unsigned & (1 << size-1)) != 0) {
            unsigned = -1 * ((1 << size-1) - (unsigned & ((1 << size-1) - 1)));
        }
        return signed;
    }

    //Devuelve la fecha de la medición en formato h:m:s d/m/YYYY
    function obtenerFechaMedida(offset, uint8Array) {
        var anyo = (uint8Array[offset] << 8) | uint8Array[offset+1];
        var mes = uint8Array[offset+2];
        var dia = uint8Array[offset+3];
        var hora = uint8Array[offset+4];
        var minuto = uint8Array[offset+5];
        
        return hora+":"+minuto+" "+dia+"/"+mes+"/"+anyo;
    }

    var DatosDeLecturaProcesados = function DatosDeLecturaProcesados(uint8Array) {
        //Valores de configuración del dispositivo según los datos recibidos
        this.configFlags = uint8Array[0];   
            /*
            orden de bits y significado en configFlags: 
                0: unidad de la medida de presión arterial. Si 0, mmHg. Si 1, kPa.
                1: indica si está presente la marca de tiempo. Si 1, está presente.
                2: indica si se envía la lectura de pulso. Si 1, se envía.
                3: indica si se envía el id de usuario de la lectura. Si 1, se envía.
                4: indica si se envía el estado de la medición. Si 1, se envía.
                5-7: no se usan en la actualidad
            */
        
        //Variables de instancia
        this.unidadMedida = (this.configFlags & (1 << 7)) == 0 ? "mmHg": "kPa";
        // console.log("unidad de medida en "+this.unidadMedida);
        this.sistole = null;
        this.diastole = null;   
        this.presionMedia = null;
        this.fecha = null;
        this.pulso = null;
        this.idUsuario = null;
        //se obvia el estado de la medición por no tener uso en la actualidad.
        //this.estadoMedicion = null;
        
        var offset = 1;
        
        //Lectura sistole/diastole/presion media. Siempre vienen los valores a partir del primer byte
        //aunque dependiendo del bit 1 de configuración, los valores vienen expresados en mmHg o en kPa
        // console.log("leyendo datos de sístole, diástole y presión media");
        this.sistole = bytesToFloat(uint8Array[offset], uint8Array[offset+1]);
        this.diastole = bytesToFloat(uint8Array[offset+2], uint8Array[offset+3]);
        this.presionMedia = bytesToFloat(uint8Array[offset+4], uint8Array[offset+5]);
        
        offset += 6;
        
        //Lectura de la fecha, 7 bytes
        if( (this.configFlags & (1 << 6)) != 1 ) {
            console.log("la configuración indica que viene la fecha de la medida");
            this.fecha = obtenerFechaMedida(offset, uint8Array);
            
            // alert("la configuración indica que viene la fecha. offset: "+offset+"; fecha: "+this.fecha);
            
            offset += 7;
        }
        else alert("no lleva fecha");
        
        if( (this.configFlags & (1 << 5)) != 1 ) {
            console.log("la configuración indica que vienen las pulso del usuario");      
            this.pulso = bytesToFloat(uint8Array[offset], uint8Array[offset+1]);
            
            // alert("la configuración indica que vienen las pulso del usuario. offset: "+offset+"; pulso: "+this.pulso);
            
            offset += 2;
        }
        else alert("no lleva pulso");
        
        if( (this.configFlags &  (1 << 4)) != 0 ) {
            // console.log("la configuración indica que viene el identificador del usuario");

            this.idUsuario = uint8Array[offset];
            offset++;
        }
    }

    function onData(buffer) {

        var lectura = new Uint8Array(buffer);
        
        $scope.datosLeidos = new DatosDeLecturaProcesados(lectura);
        
        alert("sístole: "+ $scope.datosLeidos.sistole);
        alert("diástole: "+ $scope.datosLeidos.diastole );
        alert("unidad medida: "+ $scope.datosLeidos.unidadMedida );
        alert("pulso: "+ $scope.datosLeidos.pulso );
        
        alert("fecha medida: "+ $scope.datosLeidos.fecha );
    }


    var failureConnect = function(reason) {
        alert("No conectado por "+ reason);
    }

    var onConnect = function(peripheral) {
        alert("Connected to " + peripheral.id );
        ble.startNotification(peripheral.id, service_uuid, characteristic_uuid, onData, failureConnect);
    }

    var onScan = function(peripheral) {
       
        alert("Found " + JSON.stringify(peripheral));
               
        foundHeartRateMonitor = true;

        ble.connect(peripheral.id, onConnect, onDisconnect);
    }

    var onDisconnect = function(reason) {

        
        $timeout(function() {
            $scope.cambio = true;
            alert("Datos Recibidos Correctamente" );
        },500);
       
        
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
  
})
