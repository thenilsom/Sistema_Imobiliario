(function() {
    angular
        .module("adminManagerMain")
        .controller("FiancaController", ["fiancaService", "$window", "$routeParams", FiancaController]);

    function FiancaController(fiancaService, $window, $routeParams) {
        var vm = this;
        vm.acao = 'listar';
        fiancaService.getFianca().then(function(response) {
            checkAuthAccess(response);
            vm.fiancas = response;
        });
        
        /* Helper function to clear search query input string */
        vm.clearSearch = function() {
            vm.searchText = "";
        }

        vm.detalhar = function(reg){
             vm.registro = angular.copy(reg);
         
            for (var key in vm.registro) {
              if(!vm.registro[key])
                vm.registro[key] = '--';
            }

            setTimeout(function(){
                $("#accordion a:first").trigger("click");
            },500);

            vm.acao = 'detalhar';
        }

        vm.voltarParaListagem = function(){
            vm.acao = 'listar';
        }

        vm.enviarAnalise = function(){
           fiancaService.getVariaveisSessao().then(function(response) {
             var url = 'https://www.segurosja.com.br/gerenciador/fianca/app/index.php?var1=' 
                              + fiancaService.criptografar(fiancaService.apenasNumeros(response.CGC_imob))
                              + '&var8=' + response.codigo_user
                              + '&var12=' + response.nivel_acesso;

            window.open(url, '_blank');
          });
        }

        //retorna o nome da seguradora pelo código
       vm.getNomeSeguradora = function(registro){
        switch(registro.seguradora){
          case 'BKY': return 'Berkley';
          case 'BRA': return 'Bradesco';
          case 'CDF': return 'Cardif';
          case 'FFX': return 'Fairfax';
          case 'LIB': return 'Liberty';
          case 'POR': return 'Porto Seguro';
          case 'PTC': return 'Pottencial';
          case 'TOK': return 'Tokio Marine';
          case 'TOO': return 'Too';
          default: return registro.seguradora;
        }
       }

        /* Check for authenticity of user - logged not logged in */
        var checkAuthAccess = function(response) {
            if(response.error) {
                toastr.options = {
                            "preventDuplicates": true,
                            "preventOpenDuplicates": true,
                            "newestOnTop": false
                        };
                toastr.error(response.error, "Critical Error");
                var redirectPath = 
                        $window.location.origin
                        + $window.location.pathname.substring(0, $window.location.pathname.lastIndexOf("/"))
                        + "/index.html";
                toastr.info("Voce sera redirecionado em 5 segundos.", "INFORMACAO", { onHidden: function() { $window.location.href = redirectPath; }});
                return ;
            }
        }

    }
}());