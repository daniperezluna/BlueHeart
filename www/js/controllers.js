angular.module('starter.controllers', ['ionic', 'ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, $ionicPopup, envioFactory, $timeout) {
    
    var monthList = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];
    var weekDaysList = ['S', 'D', 'L', 'M', 'X', 'J', 'V'];
    $scope.flag = 0;
    $scope.mensaje = false;
    $scope.botonA = false;
    $scope.data = [];
    $scope.dataRec = [];
    $scope.labels = [];
    $scope.series = ['Sistole', 'Diastole', 'Pulso'];
    $scope.contador = 0;

    $scope.datepickerObject = {};
    $scope.datepickerObject.inputDate = new Date();

    $scope.datepickerObjectTo = {};
    $scope.datepickerObjectTo.inputDate = new Date();

    $scope.datepickerObjectPopup = {
      titleLabel: 'Escoja su fecha, no puede ser anterior a 01-01-2015', //Optional
      todayLabel: 'Hoy', //closeLabel
      Optional: 'Cerrar', //Optional
      setLabel: 'OK', //Optional
      errorMsgLabel : 'Please select time.', //Optional
      setButtonType : 'button-assertive', //Optional
      modalHeaderColor:'bar-positive', //Optional
      modalFooterColor:'bar-positive', //Optional
      templateType:'popup', //Optional
      inputDate: $scope.datepickerObject.inputDate, //Optional
      mondayFirst: true, //Optional
      weekDaysList: weekDaysList,
      monthList:monthList, //Optional
      from: new Date(2015, 1, 1), //Optional
      to: new Date(), //Optional
      callback: function (val) { //Optional
        datePickerCallbackPopup(val);
      }
    };

    var datePickerCallbackPopup = function (val) {
      if (typeof(val) === 'undefined') {
        console.log('No date selected');
      } else {
        $scope.datepickerObjectPopup.inputDate = val;
        console.log('Selected date is : ', val);
      }
    };

    $scope.datepickerObjectPopupTo = {
      titleLabel: 'Escoja su fecha, no puede ser anterior a 01-01-2015', //Optional
      todayLabel: 'Hoy', //closeLabel
      Optional: 'Cerrar', //Optional
      setLabel: 'OK', //Optional
      errorMsgLabel : 'Please select time.', //Optional
      setButtonType : 'button-assertive', //Optional
      modalHeaderColor:'bar-positive', //Optional
      modalFooterColor:'bar-positive', //Optional
      templateType:'popup', //Optional
      inputDate: $scope.datepickerObjectTo.inputDate, //Optional
      mondayFirst: true, //Optional
      weekDaysList: weekDaysList,
      monthList:monthList, //Optional
      from: new Date(2015,1,1), //Optional
      to: new Date(), //Optional
      callback: function (val) { //Optional
        datePickerCallbackPopupTo(val);
      }
    };

    var datePickerCallbackPopupTo = function (val) {
      if (typeof(val) === 'undefined') {
        console.log('No date selected');
      } else {
        $scope.datepickerObjectPopupTo.inputDate = val;
        console.log('Selected date is : ', val)
      }
    };

    $scope.resultadoParcial = function (fechaInicio, fechaFin) {
        
        $scope.datosRepar = [];
        $scope.labels = [];

        var datosSistole = [];
        var datosDiastole = [];
        var datosPulso = [];
        var datosFecha = [];

        if (fechaInicio > fechaFin){
            alert("La Fecha Fin no puede ser anterior a la Fecha Inicio");
        } else {
            
            envioFactory.leerDatos()
            .success(function (data){
                $scope.datosRec = data.resultado;
                $scope.flag = 2;
                $scope.botonA = true;
            });
            
            $timeout( function(){

                for(var i = 0; i < $scope.datosRec.length; i++) {

                    var fechaAux2 = new Date($scope.datosRec[i].fecha);

                    console.log("vuelta" + i + 'de' + $scope.datosRec.length);
                    console.log($scope.datosRec[i]);

                    if(fechaAux2 >= fechaInicio && fechaAux2 <= fechaFin ) {
                        datosSistole[i] = $scope.datosRec[i].sistole;
                        datosDiastole[i] = $scope.datosRec[i].diastole;
                        datosPulso[i] = $scope.datosRec[i].pulso;
                        $scope.labels.push($scope.datosRec[i].fecha);
                        $scope.datosRepar[i] = $scope.datosRec[i];

                        console.log(i + "dat0 -> " + datosSistole[i]);
                        console.log(i + "dat1 -> " + datosDiastole[i]);
                        console.log(i + "dat2 -> " + datosPulso[i]);
                        console.log(i + "dat3 -> " + $scope.labels[i]);
                        console.log(i + "dat4 -> " + $scope.datosRepar[i]);
                    }
                }

                console.log(datosSistole);

                if(datosSistole[0] == undefined) {

                for(var k = 0; k < $scope.datosRec.length; k++) {

                    if(datosSistole[k] == undefined)
                        $scope.contador++;

                }

                    console.log("contador -> " + $scope.contador);
                    datosSistole.splice(0,$scope.contador);
                    datosDiastole.splice(0,$scope.contador);
                    datosPulso.splice(0,$scope.contador);

                    $scope.data[0] = datosSistole;
                    $scope.data[1] = datosDiastole;
                    $scope.data[2] = datosPulso;                    

                } else{

                    $scope.data[0] = datosSistole;
                    $scope.data[1] = datosDiastole;
                    $scope.data[2] = datosPulso;

                }

                if($scope.data[0].length == 0) {
                    $scope.mensaje = true;
                }

                for(var j = 0; j < $scope.data[0].length; j++) {
                    
                    console.log($scope.data[0][j]);
                    console.log($scope.data[1][j]);
                    console.log($scope.data[2][j]);
                
                }
                
                console.log($scope.labels);

                console.log($scope.data[0].length);
                console.log($scope.data[1].length);
                console.log($scope.data[2].length);
                console.log($scope.labels.length);

            },750);
            

        }
    };

    $scope.resultadoHistorico = function () {
        envioFactory.leerDatos()
        .success(function (data){
            $scope.datosRec = data.resultado;
            $scope.flag = 1;
            $scope.botonA = true;
        });

        $timeout( function(){

            var datosSistole = [];
            var datosDiastole = [];
            var datosPulso = [];
            var datosFecha = [];

            for(var i = 0; i < $scope.datosRec.length; i++) {
                datosSistole[i] = $scope.datosRec[i].sistole;
                datosDiastole[i] = $scope.datosRec[i].diastole;
                datosPulso[i] = $scope.datosRec[i].pulso;
                $scope.labels.push($scope.datosRec[i].fecha);
            }

            $scope.dataRec[0] = datosSistole;
            $scope.dataRec[1] = datosDiastole;
            $scope.dataRec[2] = datosPulso;

            if($scope.dataRec[0].length == 0) {
                $scope.mensaje = true;
            }

        },500);

    };

    $scope.volverAtras = function () {

        $scope.flag = 0;
        $scope.mensaje = false;
        $scope.botonA = false;
        $scope.data = [];
        $scope.labels = [];
        $scope.datosRec = [];
        $scope.dataRec = [];
        $scope.datosRepar = [];

        $scope.datepickerObject = {};
        $scope.datepickerObjectTo = {};

        $scope.datepickerObjectPopup.inputDate = new Date();
        $scope.datepickerObjectPopupTo.inputDate = new Date();
    };
})

.controller('AccountCtrl', function($ionicPlatform, $ionicPopup,$scope,$cordovaBLE,$timeout,$http,$sce,envioFactory) {
  
    var service_uuid = '1810';
    var characteristic_uuid = '2a35';
    var foundHeartRateMonitor = false;
    $scope.datosLeidos = null;

    $scope.enviarDatos = function () {
        console.log($scope.datosLeidos);
        envioFactory.enviarDatos($scope.datosLeidos);
    };

    function semaforoTension(sistole, diastole) {

        var colorT = null;

        alert("dentro de semaforo-> "+sistole);
        alert("dentro de semaforo d-> "+diastole);

        if (sistole < 120 && diastole < 80){
            return 'verde';
        }
        else if((sistole >= 120 && sistole < 129) && (diastole >= 80 && diastole < 84)){ 
            return 'verdeClaro';
        }
        else if((sistole >= 120 && sistole < 129) || (diastole >= 80 && diastole < 84)){
            return 'verdeClaro';
        }
        else if((sistole >= 130 && sistole < 139) && (diastole >= 85 && diastole < 89)){
            return 'amarillo';
        }
        else if((sistole >= 130 && sistole < 139) || (diastole >= 85 && diastole < 89)){
            return 'amarillo';
        }
        else if((sistole >= 140 && sistole < 159) && (diastole >= 90 && diastole < 99)){
            return 'amarilloNaranja';
        }
        else if((sistole >= 140 && sistole < 159) || (diastole >= 90 && diastole < 99)){
            return 'amarilloNaranja';
        }
        else if((sistole >= 160 && sistole < 179) && (diastole >= 100 && diastole < 109)){
            return 'naranja';
        }
        else if((sistole >= 160 && sistole < 179) || (diastole >= 100 && diastole < 109)){
            return 'naranja';
        }
        else if(sistole >= 180 && diastole >= 110){
            return 'rojo';
        }
        else if(sistole >= 140 && diastole < 90){
            return 'azul';
        }
    }
        
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
        
        alert("byte1 "+ uint8Array[offset]);
        alert("byte2 "+ uint8Array[offset+1]);

        alert("byte cambiados "+  (uint8Array[offset+1] << 8) | uint8Array[offset]);

        var anyo = (uint8Array[offset+1] << 8) | uint8Array[offset];
        var mes = uint8Array[offset+2];
        var dia = uint8Array[offset+3];
        var hora = uint8Array[offset+4];
        var minuto = uint8Array[offset+5];
        var fechaToma = new Date(anyo+'-'+[mes]+'-'+dia);

        alert("fecha ->"+fechaToma);
        
        return fechaToma;
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
        this.colorTension = semaforoTension(this.sistole,this.diastole);
        
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

        // $scope.datosLeidos.colorTension = semaforoTension($scope.datosLeidos.sistole,$scope.datosLeidos.diastole);

        alert($scope.datosLeidos.colorTension);
        
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
