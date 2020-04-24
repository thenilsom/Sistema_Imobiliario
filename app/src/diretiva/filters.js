var directives = angular.module('appFilters', []);

/**
 * Filtro Responsavel por Formatar CNPJ
 */
directives.filter('cpfcnpj', function() {
	return function(input) {
		if(input.replace(/\D/g, '').length < 12){
			return cpf(input); 
		}else{
			return cnpj(input);
		}
	};
	
	function cpf(valor){
		var str = valor + '';
	  	str = str.replace(/\D/g,'');
	  	str = str.replace(/(\d{3})(\d)/,"$1.$2");
	  	str = str.replace(/(\d{3})(\d)/,"$1.$2");
	  	str = str.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
		return str;
	}

	function cnpj(valor){
		var str = valor + '';
		str = str.replace(/\D/g, '');
		str = str.replace(/^(\d{2})(\d)/, '$1.$2');
		str = str.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
		str = str.replace(/\.(\d{3})(\d)/, '.$1/$2');
		str = str.replace(/(\d{4})(\d)/, '$1-$2');
		return str;
	}
	
});

/**
 * Filtro Responsavel por Formatar Telefone
 */
directives.filter('telefonefilter', function() {
	return function(tel) {

		//se o telefone tiver menos de 10 digitos nao faz a formatação
		if(!tel || tel.length < 10) return tel;
		
		var dig = tel.substring(0,2);
		var num = tel.substring(2, tel.length);
		var numFormat = "";
		
		if(num.length > 8){
			numFormat = num.substring(0, 5) + "-" + num.substring(5, 9);
		}else{
			numFormat = num.substring(0, 4) + "-" + num.substring(4, 8);
		}
		numFormat = "(" + dig + ") " + numFormat;
		return numFormat;
	};
	
});