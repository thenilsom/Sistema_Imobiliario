(function(){
  'use strict';

  // Prepare the 'users' module for subsequent registration of controllers and delegates
  angular.module('app', ['ngMaterial', 'diretiva', 'angularFileUpload', 'ngRoute', 'appFilters', 'angularUtils.directives.dirPagination'])
  /*.config(function($routeProvider, $locationProvider){
  	//$locationProvider.html5Mode(true);

  	$routeProvider
  	.when('/',{
  		templateUrl: 'src/view/formulario/principal.html',
  		controller: 'MainController'
  	})
  	.when('/lista',{
  		templateUrl: 'src/view/lista/principal.html',
  		controller: 'ListaController'
  	})
  	.otherwise({redirectTo: '/'});

  	
  })*/
  .run(function($mdDateLocale, $filter) {
        $mdDateLocale.formatDate = function(date) {
            return $filter('date')(date, "dd/MM/yyyy");
        };
    })


})();

