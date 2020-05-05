var diretiva = angular.module('diretiva', []);

/**
 * Implementação de diretiva para chamar um tooltip
 */
diretiva.directive('tooltip', function () {
    return {
        restrinct: 'A',
        link: function (scope, element, attrs) {
            $(element).tooltip({
                trigger: 'hover',
                html: true,
                title: attrs.tooltip,
                placement: 'top'
            });
        }
    }
});

diretiva.directive(
		'ngTabindex',
		function() {
			return {
				restrinct : 'A',
				link : function(scope, element, attrs) {
					$(element).attr('tabindex', attrs.ngTabindex);
					$(element).keydown(
							function(event) {
								var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
								if (keyCode == 13) {
								var field = document.getElementById($(this).attr('id'));
								event.preventDefault();
								var isFocado = false;
								$($("form[name = '" + field.form.name +"']").prop('elements')).each(function(){
									
									if($(this).is(':enabled')){//verifica se o elemento esta habilitado
										var indexField = parseInt($(this).attr('tabindex'));
										var condicao = indexField > field.tabIndex;
										if(condicao){
											if(!isFocado){
												$(this).focus();
												$(this).select();
												isFocado = true;
											}
											
										}
									}
									
									
								});
									
						}

				});
				}
			}
		});

/**
 * Implementação de 'directive', para Abrir o Calendário.
 * 
 * O input que estiver com "datepicker", abre o calendário ao ser clicado.
 */
diretiva.directive('datepicker', function() {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, element, attrs, ctrl) {

			$(function() {

				$(element).datepicker({
					format : 'dd/mm/yyyy',
					language: 'pt-BR',
					autoclose : true,
					startDate : '01/01/1900',
					endDate : '31/12/2999',
					todayHighlight : true,
					clearBtn : true
				});
			});

			$(element).on('change', function () {
				scope.$apply(function(){
				ctrl.$setViewValue(element.val());
			});
      	});

		}
	}
});


/**
 * Implementação de 'mascaras', para formatar os Campos como Numerico
 * 
 * Adicione data-mascara-numero ao imput, 
 * 
 * PAra aceitar "0" a Esquerda use data-mascara-numero="0".
 */
diretiva.directive('mascaraNumero', function($parse) {

	var NUMBER_REGEXP = /^([\d\-\ \.\ \/]+)$/;

	function link(scope, el, attrs, ngModelCtrl) {
		var lastValidViewValue;
		var zeroEsquerda = $parse(attrs.mascaraNumero)(scope) == '0' ? true	: false;

		
		function atualizaValor() {
			var modelValue = String(ngModelCtrl.$modelValue);

			if (!zeroEsquerda) {
				modelValue = String(parseFloat(modelValue));
				if(modelValue === '0'){
					modelValue = '';
				}
			}
			if(isNaN(modelValue)){
				modelValue = '';
			}
			changeViewValue(modelValue);

			// Save the rounded view value
			lastValidViewValue = ngModelCtrl.$viewValue;
		
			return modelValue;
		}

		function changeViewValue(value) {

			ngModelCtrl.$viewValue = value;
			ngModelCtrl.$commitViewValue();
			ngModelCtrl.$render();
		}

		ngModelCtrl.$parsers.push(function(value) {
			if (ngModelCtrl.$isEmpty(value)) {
				lastValidViewValue = value;
				return null;
			}
			
			value = String(value);

			if (NUMBER_REGEXP.test(value)) {
				lastValidViewValue = value;
				if (!zeroEsquerda) {
					value = String(parseFloat(value));
				}
				return value;
			} else {
				changeViewValue(lastValidViewValue);
				return lastValidViewValue;
			}
		});
		
		ngModelCtrl.$formatters.push(function(valor) {
			if(valor){
				return atualizaValor(String(valor));
			}
		});
		
		// Auto-format precision on blur
		el.bind('blur', function() {
			atualizaValor();
			ngModelCtrl.$commitViewValue();
		});
	}

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});

/**
 * Implementação de 'mascaras', para Criação de Mascaras para CPF/CNPJ
 * 
 * Adicione data-mascara-cpfcnpj ao imput.
 * Faz a Conversão Automatica De Mascara De acordo com o Digitado
 *  
 */
diretiva.directive('mascaraCpfcnpj', function($filter) {

	function link(scope, el, attrs, ngModelCtrl) {
		var tokens = { '9' : { mascara: /(\d)$/ , caracter: /[^\d]/g } };

		var cpf ='999.999.999-99',
		cnpj    ='99.999.999\/9999-99',
		mascara = cpf;
		
		function atualizaValor(valor){
			
			valor = aplicaMascara(valor , mascara);
			ngModelCtrl.$viewValue = valor;
			ngModelCtrl.$render();
			
			return valor;
			
		}

		ngModelCtrl.$parsers.push(function(valor) {
			if(valor){
				valor = atualizaValor(valor);
				return clear(valor,0);
			}
		});
		
		ngModelCtrl.$formatters.push(function(valor) {
			if(valor){
				return atualizaValor(String(valor));
			}
		});
		

		function clear(valor , ind){
			
			return valor.replace(/[^\d]/g,'');
						
		}
		
		function aplicaMascara(valor, mascara) {

            valor = clear(valor, 0);
			if(valor.length > 11){
				mascara = cnpj;
			}
			
			var formatted = '';
			var valuePos = 0;
			var tamanho = mascara.length < valor.length ? mascara.length : valor.length;
			
			
			function temTokens(pattern, pos, inc) {
				var pc = pattern.charAt(pos);
				var token = tokens[pc];
				if (pc === '') return false;
				return token ? true : temTokens(pattern, pos + inc, inc);
			}
			
			function continua() {
				if (temTokens(mascara, i, 1)) {
					return true;
				}
				return i < mascara.length && i >= 0;
			}

			
	
			for (var i = 0; continua() ; i++ ) {
				var pc = mascara.charAt(i);
				var vc = String(valor).charAt(valuePos);
				var token = tokens[pc];
				
				if(token){
					if (token.mascara.test(vc)) {
						formatted += vc;
						valuePos++;
					}
					if(vc === '') break;
				}else{
					formatted += pc;
				}
				
			}
	
			return formatted;
	
		}
		
		// Auto-format on blur
		el.bind('blur', function() {
			var valor = ngModelCtrl.$viewValue;
			if(valor){
				if(valor.length < mascara.length){
					valor = "";
					ngModelCtrl.$modelValue = valor;
				}
				atualizaValor(valor);
				ngModelCtrl.$commitViewValue();
			}
		});
	
	}

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
	
});

/*Exibi um asterisco vermelho na label do input*/
diretiva.directive('requerido', function($parse) {

	function link(scope, element, attrs, ngModelCtrl) {
		var label = $("label[for='"+element.attr('id')+"']");
		$(label).prepend('<span style="color:red">*</span>');

		/*ao ganhar o foco remove a classe errorAtribute*/
		$(element).on('focus', function(){
			$(element).removeClass('errorAttribute');
		})

		/*ao perder o foco se o valor for vazio adiciona a classe errorAtribute*/
		$(element).on('blur', function(){
			if(!$(element).val())
				$(element).addClass('errorAttribute');
		});
		
	}
	

	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});


diretiva.directive('mascaraFixa', function() {
	function link(scope, element, attrs, ngModelCtrl) {
		$(element).mask(attrs.mascaraFixa);
	}
	
	return {
		restrict : 'A',
		require : 'ngModel',
		link : link
	};
});