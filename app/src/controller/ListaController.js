 angular
       .module('app')
       .controller('ListaController', ['$scope', '$http', 'serviceUtil','$timeout', 'validaService','dataUtil',
        function($scope, $http, service, $timeout, validador, dataUtil){

    	var url = service.getUrl();
    		
    	var title = 'Seguros Já! - Fiança Locatícia';
        var qtdRegistros = 0;
        var TEMPO_REFRESH = 60;
        $scope.contador = TEMPO_REFRESH;
        $scope.promise;

        //obtem os parametros na url se existir
        var codigoParam = null;
        var paramUrl = service.extraiParamUrl(location.search.slice(1));
        if(paramUrl)
          codigoParam = service.decriptografar(paramUrl['var']);

     
       $scope.listaTabela = [];

       /**
       * thread para ficar verificando se existe um novo atendimento,
       * se existir atualiza a listagem
       */
      var ativarRefresh = function(){
        $scope.contador--;
        if($scope.contador === 0){
          $(".loader").addClass('hidden');// parar a execução do popUp de carregamento
          listar();
          $scope.contador = TEMPO_REFRESH;
        }
        
        $scope.promise = $timeout(ativarRefresh, 1000);
      }

       $scope.detalhar = function(registro){
        $http.post(url + 'php/consulta.php/fezUploadArquivos', {pasta: $scope.gerarLinkPastaUpload(registro)}).then(function(data){ 
             $scope.registro = angular.copy(registro);
         
//            for (var key in $scope.registro) {
//              if(!$scope.registro[key])
//                $scope.registro[key] = '--';
//            }

            $scope.registro.fezUpload = data.data.qtd > 0;

            $timeout(function(){
              $("#accordion a:first").trigger("click");
            });

            $scope.acao = 'detalhar'; 

            }, function(erro){
             service.alertarErro(erro.statusText);
            });

       }

       $scope.irParaListagem = function(){
        $scope.acao = 'listar';
       }
       
       $scope.filtroLista = function (input, search_param) {
    	   return !search_param || (input && input.toLocaleLowerCase().includes(search_param.toLocaleLowerCase()));
    	 }

       var listar = function(){
         $http.post(url + 'php/consulta.php/listar', {codigo: codigoParam}).then(function(data){
            $(".loader").removeClass('hidden');
            $scope.listaTabela = data.data;
            montarArrayImobiliarias($scope.listaTabela);
            alertarQtdRegPendenteNoTitle();
            
            if(qtdRegistros > 0 && qtdRegistros < $scope.listaTabela.length){
              $('#notificacao').trigger('play');
            }

            qtdRegistros = $scope.listaTabela.length;
            
            }, function(erro){
              $(".loader").removeClass('hidden');
             // service.alertarErro(erro.statusText);
            });
       }
       
       /**
        * Monta o array de lista das imobiliárias
        */
       var montarArrayImobiliarias = function(lista){
    	   $scope.listaImobiliarias = [...new Set(lista.filter(l=> l.fantasia).map(v=> v.fantasia))].sort();
       }
       
       /**
        * Redireciona para o formulario
        */
       $scope.enviarAnalise = function(){
    	   window.location.href = url + 'index.php?var1=' + service.criptografar(service.apenasNumeros($scope.novoReg.cgcImob.cpf))
    	   											+ '&var9=' + $scope.novoReg.inquilino
    	   											+ '&var10=' + service.criptografar($scope.novoReg.cpfInquilino)
    	   											+ '&var11=' + $scope.novoReg.tipoInquilino;
       }

       $scope.incluirRegistro = function(){
         $http.get(url + 'php/consulta.php/dataServidor').then(function(data){
             $scope.errors = [];
             $scope.novoReg = {};
             $scope.novoReg.data = dataUtil.formatarDataServidor(data.data.data);
             $scope.novoReg.hora = data.data.hora;
             listarCGC_Imob();
             $scope.acao = 'incluir';
        }, function(erro){
         service.alertarErro(erro.statusText);
        });
       }

        var validarDadosRegistro = function(form){
             $scope.errors = [];
             validador.validarCamposObrigatorios(form, $scope.errors);

             var isCpf = $scope.novoReg.cpfInquilino.length <= 11;

              if(isCpf){
            	  if(angular.equals($scope.novoReg.tipoInquilino, 'J')){
                      $scope.errors.push("Para pessoa jurídica deve ser informado um CNPJ");

                    }else if(!validador.validarCpf($scope.novoReg.cpfInquilino)){
            		  $scope.errors.push("CPF inválido");
            	  }
              }

              if(!isCpf){
                if(angular.equals($scope.novoReg.tipoInquilino, 'F')){
                  $scope.errors.push("Para pessoa física deve ser informado um CPF");

                }else if(!validador.validarCNPJ($scope.novoReg.cpfInquilino)){
                  $scope.errors.push("CNPJ inválido");
                }
                
              }

              return $scope.errors.length == 0;
          }
        
        //valida os dados da apolice
        var validarDadosApolice = function(){
        	 $scope.errors = [];
             validador.validarCamposObrigatorios('formApolice', $scope.errors);
             
             return $scope.errors.length == 0;
        }
        
      //valida os dados da analise
        var validarDadosAnalise = function(){
        	 $scope.errors = [];
             validador.validarCamposObrigatorios('formAnalise', $scope.errors);
             
        if(!$scope.primeiraOpSituacao.includes($scope.dadosAnalise.situacao)){
        	$scope.dadosAnalise.dataAprovacao = null;
        }
             
             return $scope.errors.length == 0;
        }


       $scope.gravarRegistro = function(){
        if(validarDadosRegistro('formIncluirRegistro')){
          tratarDadosRegistro()

          $http.post(url + 'php/gravar.php/gravarRegInquilino', $scope.novoReg).then(function(data){
           service.alertar('Registro incluido com sucesso!');
            $scope.irParaListagem();
            listar();
          }, function(erro){
            service.alertarErro(erro.statusText);
          });
        }
         
       }
       
       //grava os dados da apolice
       $scope.gravarDadosApolice = function(){
    	   if(validarDadosApolice()){
    		   $http.post(url + 'php/gravar.php/gravarDadosApolice', $scope.dadosAplice).then(function(data){
    			   $('#modalDadosApolice').modal('hide');
    			   service.alertar('Dados da apólice atualizado com sucesso!');
    			   $scope.registro.apolice = $scope.dadosAplice.numApolice;
    			   $scope.registro.seguradora = $scope.dadosAplice.codSeguradora;
    		   }, function(erro){
    			   service.alertarErro(erro.statusText);
    		   });
    	   }
          }
       
     //grava os dados da analise
       $scope.gravarDadosAnalise= function(){
    	   if(validarDadosAnalise()){
    		   $http.post(url + 'php/gravar.php/alterarDadosAnalise', $scope.dadosAnalise).then(function(data){
    			   
    			   $http.post(url + 'php/consulta.php/consultarPorCodigoRegistro', {codigo: $scope.dadosAnalise.codigoCadastro}).then(function(data){
    				   		$scope.detalhar(data.data[0]);
    				   		$('#modalDadosAnalise').modal('hide');
    		    			 service.alertar('Dados da análise atualizado com sucesso!');
    		            }, function(erro){
    		              service.alertarErro(erro.statusText);
    		            });
    			   
    		   }, function(erro){
    			   service.alertarErro(erro.statusText);
    		   });
    	   }
          }

       //trata os dados do registro que será enviado ao servidor
       var tratarDadosRegistro = function(){
         $scope.novoReg.cpfInquilino = service.formatarCpfCnpj($scope.novoReg.cpfInquilino);
         $scope.novoReg.codCorretor = getCodCorretor();
         $scope.novoReg.data = dataUtil.formatarParaDataServidor($scope.novoReg.data);
       }

       //retorna o codigo do corretor
       var getCodCorretor = function(){
        return $("input[name='codigo_corretor']").val();
       }
       
       /**
        * Alerta a qtd de registros pendentes no title da aba do navegador
        */
       var alertarQtdRegPendenteNoTitle = function(){
    	   var qtdRegPendente = $scope.listaTabela.filter(reg=> reg.data_aceite_analise == '0000-00-00 00:00:00').length;
    	   if(qtdRegPendente > 0){
    		   document.title = '(' + qtdRegPendente + ') ' + title; 
    		   
    	   }else{
    		   document.title = title;
    	   }
       }
       
       //registra o atendimento para o usuário
       $scope.registrarAtendimento = function(registro){
    	   service.showConfirm('Confirma registrar o atendimento ?',function(){
	    	  var codUser = $("input[name='codigo_usuario']").val();
	    	  if(!codUser){
	    		  service.alertarErro('Usuário não identificado.');
	    		  
	    	  }else{
	    		  var atendimento = {codigoUsuario : codUser, codigoCadastro: registro.codigo};
	    		  $http.post(url + 'php/gravar.php/registrarAtendimento', atendimento).then(function(data){    
	    			  alert('atendimento registrado');
	    			  listar();
	    		  }, function(erro){
	    			  service.alertarErro(erro.statusText);
	    		  });
	    	  }
    	   });
       }
       
       $scope.isRegPendenteMais30Minutos = function(reg){
    	   return dataUtil.isDifHoraMais30minutos(dataUtil.criarDataHora(reg.data_transm, reg.hora_transm));
       }

       //formata o nome para o link de uploads
       $scope.gerarLinkPastaUpload = function(registro){
        return service.gerarLinkPastaUpload(registro.codigo, registro.inquilino);
       }

       //traz a lista de cgc imob
       var listarCGC_Imob = function(){
         $http.post(url + 'php/consulta.php/listarCGC_Imob', {codCorretor: getCodCorretor()}).then(function(data){
            $scope.listaCGC_Imob = data.data;
            
            }, function(erro){
              service.alertarErro(erro.statusText);
            });
       }
       
       /**
        * Inicia os dados da aplice
        */
       $scope.iniciarDadosAplice = function(){
    	   $scope.dadosAplice = {
    			   codigoCadastro : $scope.registro.codigo,
    			   numApolice : $scope.registro.apolice, 
    			   codSeguradora : $scope.registro.seguradora};
       }
       
       /**
        * Inicia os dados da analise
        */
       $scope.iniciarDadosAnalise = function(registro, tipo){
    	   if(angular.equals(tipo, 'liberty')){
    		   $scope.dadosAnalise = {analise: registro.processo_liberty, 
    				   								situacao: registro.situacao_analise_liberty,
    				   								dataAprovacao : dataUtil.isDataValida(registro.data_aprovacao_liberty) ? dataUtil.formatarData(registro.data_aprovacao_liberty) : dataUtil.getDataAtual()};
    		   
    		   $scope.listaOpAnalise = ['Análise cadastral aprovada', 'Em Análise Pela Companhia', 'Análise Cadastral Reprovada', 'Pendente'];
    		   
    	   }else if(angular.equals(tipo, 'porto')){
    		   $scope.dadosAnalise = {analise: registro.processo_porto, 
													situacao: registro.situacao_analise_porto,
													dataAprovacao : dataUtil.isDataValida(registro.data_aprovacao_porto) ? dataUtil.formatarData(registro.data_aprovacao_porto) : dataUtil.getDataAtual()};
    		   
    		   $scope.listaOpAnalise = ['Aprovado - Finalizado', 'Em analise - Em analise', 'Recusado pela Analise de Risco - Finalizado', 'Pendente'];
    		   
    	   } else if(angular.equals(tipo, 'too')){
    		   $scope.dadosAnalise = {analise: registro.processo_too, 
													situacao: registro.situacao_analise_too,
													dataAprovacao : dataUtil.isDataValida(registro.data_aprovacao_too) ? dataUtil.formatarData(registro.data_aprovacao_too) : dataUtil.getDataAtual()};
    		   
    		   $scope.listaOpAnalise = ['Análise cadastral aprovada', 'Em Análise Pela Companhia', 'Análise cadastral reprovada', 'Pendente'];
    	   }
    	   
    	   $scope.dadosAnalise.codigoCadastro = registro.codigo;
    	   $scope.dadosAnalise.tipoSeg = tipo;
    	   
    	   $scope.primeiraOpSituacao = ['Análise cadastral aprovada', 'Aprovado - Finalizado'];
    	      
       }

       //retorna o nome da seguradora pelo código
       $scope.getNomeSeguradora = function(registro){
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
       

       $scope.irParaListagem();
       listar();
       ativarRefresh();
    }]);