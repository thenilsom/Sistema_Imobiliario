angular.module('app')
.factory('dataUtil', ['$filter', function($filter){

		var service = {};

	//recebe no padrao: 2019-10-18 retorna no padrão dd/MM/yyyy
	service.formatarDataServidor = function(dataServidor){
		var data = dataServidor.split('-');
		return data[2] + '/' + data[1] + '/' + data[0];
	}

	//recebe no padrao: dd/MM/yyyy retorna no padrão 2019-10-18 
	service.formatarParaDataServidor = function(dataParaServidor){
		var data = dataParaServidor.split('/');
		return data[2] + '-' + data[1] + '-' + data[0];
	}

	//retorna a data atual no padrão dd/MM/yyyy
	service.getDataAtual = function(){
		return service.formatarData(new Date());
	}

	service.formatarData = function(data){
	 return $filter('date')(data, 'dd/MM/yyyy', 'UTC');
	}

	service.getHoraAtual = function(){
		var agora = new Date();
		return agora.getHours() + ':' + agora.getMinutes();
	}
	
	service.isDataValida = function(data){
		return data && !angular.equals(data, '0000-00-00');
	}
		
	//cria uma data hora. os parametros deve ser no pardrão : '2019-09-20' '20:37:37'
	service.criarDataHora = function(data, hora){
		var dataArray = data.split('-');
		var horaArray = hora.split(':');

		return new Date(dataArray[0], parseInt(dataArray[1]) - 1, dataArray[2], horaArray[0], horaArray[1], horaArray[2]);
	}
	
	//retorna true se a data passada estiver a mais de 30 minutos da data atual
	service.isDifHoraMais30minutos = function(data){
		var agora = new Date();
	
		if(agora.getDate() > data.getDate() || agora.getMonth() > data.getMonth() || agora.getYear() > data.getYear())
			return true;
		
		var dif = ((agora.getHours() * 60) + agora.getMinutes()) - ((data.getHours() * 60) + data.getMinutes());
		
		return dif > 30;
		
	}

	return service;
}]);
