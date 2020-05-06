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
        
        var listarEDetalharRegistro = function(codigo){
        	fiancaService.getFianca().then(function(response) {
        		vm.fiancas = response;
        		vm.detalhar(response.filter(res=> res.codigo === codigo)[0]);
            });
        }
        
        /* Helper function to clear search query input string */
        vm.clearSearch = function() {
            vm.searchText = "";
        }

        vm.detalhar = function(reg){
             vm.registro = angular.copy(reg);
         
//            for (var key in vm.registro) {
//              if(!vm.registro[key])
//                vm.registro[key] = '--';
//            }

            setTimeout(function(){
                $("#accordion a:first").trigger("click");
            },500);

            vm.acao = 'detalhar';
        }

        vm.voltarParaListagem = function(){
            vm.acao = 'listar';
        }
        
        vm.voltarParaDetalhamento = function(){
        	vm.acao = 'detalhar';
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
        
        
        vm.iniciarFormularioContrato = function(tipo){
        	vm.regContrato =  angular.copy(vm.registro);
        	vm.regContrato.seguradora = tipo;
        	vm.acao = 'incluir';
        }
        
        vm.enviarFormularioContrato = function(){
        	validarFormularioContrato();
        	if(vm.errors.length == 0){
        		if(vm.regContrato.CPF_proprietario){
        			vm.regContrato.CPF_proprietario = fiancaService.formatCnpjCpf(vm.regContrato.CPF_proprietario);
        		}
        		
        		if(vm.regContrato.CPF_resp_proprietario){
        			vm.regContrato.CPF_resp_proprietario = fiancaService.formatCnpjCpf(vm.regContrato.CPF_resp_proprietario);
        		}
        		
        		fiancaService.postFormulario(vm.regContrato).then(function(response) {
        			alert(response.success ? response.success : response.critical);
        			listarEDetalharRegistro(vm.regContrato.codigo);
        		});
        	}
        }
        
        var validarFormularioContrato = function(){
        	vm.errors = [];
        	fiancaService.validarCamposObrigatorios('formContrato', vm.errors);
        	if(vm.regContrato.tipo_proprietario == 'F' && !fiancaService.validarCpf(vm.regContrato.CPF_proprietario)){
        		vm.errors.push('CPF inválido');
        		
        	}else if(vm.regContrato.tipo_proprietario == 'J' && !fiancaService.validarCNPJ(vm.regContrato.CPF_proprietario)){
        		vm.errors.push('CNPJ inválido');
        	}
        	
        	if(vm.regContrato.CPF_resp_proprietario && !fiancaService.validarCpf(vm.regContrato.CPF_resp_proprietario)){
        		vm.errors.push('CPF Responsável Empresa inválido');
        	}
        }
        
       vm.select2Load = function(){

			$('#profissao').change(function(){
				codigo = $(this).val();
				vm.regContrato.profissao_resp_proprietario = codigo;
				descricao = $("#profissao option:selected").text();
				vm.regContrato.profissao_resp_descricao = descricao;
			}); 
  			
		    $("#profissao").select2({
				ajax: {
					url: "https://www.segurosja.com.br/gerenciador/fianca/app/php/cb_autocomplete_profissoes.php",
					type: "post",
					dataType: 'json',
					data: function (params) {
						return {
							searchTerm: params.term
						};
					},
					processResults: function (response) {
						return {
							results: response
						};
					},
					cache: true
				} 
				
			}); 
		}
       
       vm.select2EditaCombo = function(){
			if((vm.regContrato.profissao_resp_descricao != undefined) || (vm.regContrato.profissao_resp_descricao != '')){
				$('#select2-profissao-container').html(vm.regContrato.profissao_resp_descricao);
			}else{
				$('#select2-profissao-container').html('Digite uma profissao para a pesquisa');
			}
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