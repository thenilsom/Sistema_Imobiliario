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
            
            var postFormulario = function(obj) {
                return $http({
                            method: 'POST',
                            url: baseUrl + 'postFormularioContrato.php',
                            data: obj
                        }).then(successFn, errorFn);
            };


            var successFn = function(response) {
                return response.data;
            }
            var errorFn = function(error) {
                console.warn("Error in GET or POST",error);
                return error.data;
            }
            
            var validarCamposObrigatorios = function(formName, errors){
    			$("form[name = '"+formName+"'] [requerido]").each(function(){
    				if($(this).val() == undefined || $(this).val().trim().length == 0 || $(this).val().startsWith('?')){
    					var label = $("label[for='"+$(this).attr('id')+"']").text().replace('*', '');
    					var descErro = label + " obrigatório.";
    					
    					if(!errors.includes(descErro))
    						errors.push(descErro);
    				}
    			});
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
            
            var formatCnpjCpf = function(value){
              const cnpjCpf = value.replace(/\D/g, '');
              
              if (cnpjCpf.length === 11) {
                return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");
              } 
              
              return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3/\$4-\$5");
            }

             var apenasNumeros = function (string) {
                 return string.replace(/[^0-9]/g, '');
            }

            return {
                getFianca: getFianca,
                getVariaveisSessao : getVariaveisSessao,
                postFormulario : postFormulario,
                criptografar : criptografar,
                apenasNumeros : apenasNumeros,
                formatCnpjCpf : formatCnpjCpf,
                validarCamposObrigatorios : validarCamposObrigatorios
            };
        });
}());