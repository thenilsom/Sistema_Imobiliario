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
        
        vm.listarEDetalharRegistro = function(codigo){
        	$('#modalConfirmacao').modal('hide');
        	fiancaService.getFianca().then(function(response) {
        		vm.fiancas = response;
        		vm.detalhar(response.filter(res=> res.codigo === codigo)[0]);
            });
        }
        
        var listarSeguradoras = function(){
        	 fiancaService.getSeguradoras().then(function(response) {
                 vm.seguradoras = response;
             });
        }
        
        /* Helper function to clear search query input string */
        vm.clearSearch = function() {
            vm.searchText = "";
        }

        vm.detalhar = function(reg){
             vm.registro = angular.copy(reg);
             listarSeguradoras();
             
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
        	vm.errors = [];
        	validarFormularioContrato();
        	if(vm.errors.length == 0){
        		if(vm.regContrato.CPF_proprietario){
        			vm.regContrato.CPF_proprietario = fiancaService.formatCnpjCpf(vm.regContrato.CPF_proprietario);
        		}
        		
        		if(vm.regContrato.CPF_resp_proprietario){
        			vm.regContrato.CPF_resp_proprietario = fiancaService.formatCnpjCpf(vm.regContrato.CPF_resp_proprietario);
        		}
        		
        		fiancaService.postFormulario(vm.regContrato).then(function(response) {
        			vm.response = response.success ? response.success : response.critical;
        			$('#modalConfirmacao').modal();
        		});
        		
        	}
        }
        
        var validarFormularioContrato = function(){
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
    	   var seguradora = vm.seguradoras.filter(i=> i.sigla == registro.seguradora)[0];
       		if(seguradora){
       			return seguradora.nome_abrev;
       		}
       		return registro.seguradora;;
       }
       
       vm.obterIndeceReajustePorCodigo = function(codigo){
    	   switch (codigo) {
		case '1': return 'IGP - M (FGV)';
		case '2': return ' IGP - DI (FGV)';
		case '3': return 'IPC - (FIPE)';
		case '4': return 'IPCA - (IBGE)';
		case '5': return ' INPC - (IBGE)';
		case '6': return 'ICV - (DIEESE)';
		case '7': return 'INCC';
		case '8': return 'IPC - FGV';
		case '9': return 'Maior Índice';
		default: return '';
		}
       }
       
       vm.calcularPeriodo = function(){
    	   if(vm.registro.inicio && vm.registro.fim_contrato){
    		   var dias = fiancaService.difEntreDatasEmDias(vm.registro.inicio, vm.registro.fim_contrato);
    		   var periodoEmMeses = dias/30;
    		   var regex = new RegExp('^-?\\d+(?:\.\\d{0,' + (0 || -1) + '})?');
    		   var resultado = periodoEmMeses.toString().match(regex)[0];
    		   var diasRestantes = dias - (parseInt(resultado) * 30);
    		   var retorno = parseInt(resultado) > 1 ?  (resultado + ' Meses ') : (resultado + ' Mes ');
    		   if(diasRestantes > 0){
    			   retorno += 'e ' + diasRestantes > 1 ? (diasRestantes + ' dias') : (diasRestantes + ' dia');
    		   }
    		   return retorno;
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