angular.module('starter.services', [])

.factory('envioFactory', function ($http, $sce, URLServidor) {
  return {
    
    enviarDatos : function(datosTension) {

      var urlCompleta = URLServidor + 'guardarDatos.php';  
      var postUrl = $sce.trustAsResourceUrl(urlCompleta);
      $http.post(postUrl, datosTension)
      .then(
        function () {
          alert('Datos guardados en el servidor');
        },
        function () {
          alert('Error al guardar los datos');  
        }
      );
    },

    leerDatos : function(data) {

      return $http.get(URLServidor +'leerDatos.php',data);
      
    }
  };
})
