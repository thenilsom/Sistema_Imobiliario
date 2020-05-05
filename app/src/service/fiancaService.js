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
            
            var isNull = function(obj){
    			return obj === undefined || obj === null;
    		}
            
            var isNullOrEmpty = function(obj){
    			return isNull(obj) || obj.trim().length === 0;
    		}
            
            var validarCpf = function(cpf){
       		 // Remove caracteres inválidos do valor
       	    cpf = !isNull(cpf) ? cpf.replace(/[^0-9]/g, '') : '';
       	    
       		if(isNullOrEmpty(cpf)) return true;
       		// Garante que o valor é uma string
       	    cpf = cpf.toString();
       	    
       	    var numeros, digitos, soma, i, resultado, digitos_iguais;
       	    digitos_iguais = 1;
       	    if (cpf.length < 11)
       	          return false;
       	    for (i = 0; i < cpf.length - 1; i++)
       	          if (cpf.charAt(i) != cpf.charAt(i + 1))
       	                {
       	                digitos_iguais = 0;
       	                break;
       	                }
       	    if (!digitos_iguais)
       	          {
       	          numeros = cpf.substring(0,9);
       	          digitos = cpf.substring(9);
       	          soma = 0;
       	          for (i = 10; i > 1; i--)
       	                soma += numeros.charAt(10 - i) * i;
       	          resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
       	          if (resultado != digitos.charAt(0))
       	                return false;
       	          numeros = cpf.substring(0,10);
       	          soma = 0;
       	          for (i = 11; i > 1; i--)
       	                soma += numeros.charAt(11 - i) * i;
       	          resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
       	          if (resultado != digitos.charAt(1))
       	                return false;
       	          return true;
       	          }
       	    else
       	        return false;
         }

         var validarCNPJ = function(cnpj) {
        
           cnpj = cnpj.replace(/[^\d]+/g,'');
        
           if(cnpj == '') return false;
            
           if (cnpj.length != 14)
               return false;
        
           // Elimina CNPJs invalidos conhecidos
           if (cnpj == "00000000000000" || 
               cnpj == "11111111111111" || 
               cnpj == "22222222222222" || 
               cnpj == "33333333333333" || 
               cnpj == "44444444444444" || 
               cnpj == "55555555555555" || 
               cnpj == "66666666666666" || 
               cnpj == "77777777777777" || 
               cnpj == "88888888888888" || 
               cnpj == "99999999999999")
               return false;
                
           // Valida DVs
           tamanho = cnpj.length - 2
           numeros = cnpj.substring(0,tamanho);
           digitos = cnpj.substring(tamanho);
           soma = 0;
           pos = tamanho - 7;
           for (i = tamanho; i >= 1; i--) {
             soma += numeros.charAt(tamanho - i) * pos--;
             if (pos < 2)
                   pos = 9;
           }
           resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
           if (resultado != digitos.charAt(0))
               return false;
                
           tamanho = tamanho + 1;
           numeros = cnpj.substring(0,tamanho);
           soma = 0;
           pos = tamanho - 7;
           for (i = tamanho; i >= 1; i--) {
             soma += numeros.charAt(tamanho - i) * pos--;
             if (pos < 2)
                   pos = 9;
           }
           resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
           if (resultado != digitos.charAt(1))
                 return false;
                  
           return true;
           
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
                validarCamposObrigatorios : validarCamposObrigatorios,
                validarCpf : validarCpf,
                validarCNPJ : validarCNPJ
            };
        });
}());