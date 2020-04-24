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