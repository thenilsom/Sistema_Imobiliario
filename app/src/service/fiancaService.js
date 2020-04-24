(function() {
    angular
        .module("adminManagerMain")
        .factory('fiancaService', function($http, $routeParams) {
            var baseUrl = "api/admin/fianca/";

            var getFianca = function() {
                return $http({
                            method: 'GET',
                            url: baseUrl + 'getFianca.php'
                        }).then(successFn, errorFn);
            };

            var getVariaveisSessao = function() {
                return $http({
                            method: 'GET',
                            url: baseUrl + 'getVariaveisSessao.php'
                        }).then(successFn, errorFn);
            };

            var successFn = function(response) {
                return response.data;
            }
            var errorFn = function(error) {
                console.warn("Error in GET or POST",error);
                return error.data;
            }

            var criptografar = function(val){
                if(val){
                    val = val.replace(new RegExp('0', 'g'), 'a');
                    val = val.replace(new RegExp('1', 'g'), '@');
                    val = val.replace(new RegExp('2', 'g'), 'm');
                    val = val.replace(new RegExp('3', 'g'), 's');
                    val = val.replace(new RegExp('4', 'g'), 'x');
                    val = val.replace(new RegExp('5', 'g'), '!');
                    val = val.replace(new RegExp('6', 'g'), 'v');
                    val = val.replace(new RegExp('7', 'g'), ',');
                    val = val.replace(new RegExp('8', 'g'), ';');
                    val = val.replace(new RegExp('9', 'g'), 'i');
                }
        
                return val;
            }

             var apenasNumeros = function (string) {
                 return string.replace(/[^0-9]/g, '');
            }

            return {
                getFianca: getFianca,
                getVariaveisSessao : getVariaveisSessao,
                criptografar : criptografar,
                apenasNumeros : apenasNumeros
            };
        });
}());