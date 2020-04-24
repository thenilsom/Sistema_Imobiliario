angular.module('app')
.factory('formularioService',function(){

		var service = {};

		service.preencherFormulario = function(dados){
			var cadastro = {};
			cadastro.codigo = dados.codigo;
			cadastro.pretendente = preencherDadosPretendente(dados);
			cadastro.imobiliaria = preencherDadosImobiliaria(dados);
			cadastro.residencia = preencherDadosResidenciaAtual(dados);
			cadastro.profissional = preencherDadosProfissionais(dados);
			cadastro.imovel = preencherDadosImovelPretendido(dados);
			cadastro.pessoal = preencherDadosComposicaoRenda(dados);

			return cadastro;
		}

		var preencherDadosPretendente = function(dados){
			var pretendente = {};
			pretendente.nome = dados.inquilino;
			pretendente.cpf = dados.CPF_inquilino;
			pretendente.tipoInquilino = dados.tipo_inquilino;
			pretendente.dataNascimento = dados.data_inquilino;
			pretendente.tipoDoc = dados.tipo_doc_inquilino;
			pretendente.numDoc = parseInt(dados.rg_inquilino);
			pretendente.orgaoExpedidor = dados.orgao_exp_inquilino;
			pretendente.dataEmissao = dados.data_exp_inquilino;
			pretendente.dataValidade = dados.data_validade_doc_inquilino;
			pretendente.sexo = dados.sexo_inquilino;
			pretendente.estadoCivil = dados.est_civil_inquilino;
			pretendente.cpfConjuge = dados.cpf_conjuge_inquilino;
			pretendente.nomeConjuge = dados.nome_conjuge_inquilino;
			pretendente.dataNascimentoConjuge = dados.data_conjuge_inquilno;
			pretendente.iraResidirImovelConjuge = dados.vai_residir_conjuge_inquilno;
			pretendente.iraComporRendaConjuge = dados.vai_compor_renda_conjuge_inquilno;
			pretendente.rendaConjuge = dados.renda_conjuge_inquilno;
			pretendente.numeroDependente = parseInt(dados.num_dependente_inquilino);
			pretendente.nomeMae = dados.nome_mae_inquilino;
			pretendente.nomePai = dados.nome_pai_inquilino;
			pretendente.nacionalidade = dados.nacionalidade_inquilino;
			pretendente.tempoPais = dados.tempo_pais_inquilino;
			pretendente.iraResidirImovel = dados.vai_residir_imov_inquilino;
			pretendente.telefone = dados.fone_inquilino;
			pretendente.celular = dados.cel_inquilino;
			pretendente.telefoneComercial = dados.fone_com_inquilino;
			pretendente.email = dados.email_inquilino;

			return pretendente;
		}

		var preencherDadosImobiliaria = function(dados){
			var imobiliaria = {};
			imobiliaria.cnpj = dados.CGC_imob;
			imobiliaria.fantasia = dados.fantasia;
			imobiliaria.corretor = dados.fantasia;
			return imobiliaria;
		}

		var preencherDadosResidenciaAtual = function(dados){
			var residencia = {};
			residencia.anterior = {};

			residencia.tempoResidencia = tratarTempoResidencia(dados.tempo_resid_inquilino);
			residencia.tipo = dados.tipo_resid_inquilino;
			residencia.emNome = dados.resid_emnomede_inquilino;
			residencia.arcaAluguel = dados.arca_com_aluguel_inquilino;
			residencia.nomeImobiliaria = dados.imob_prop_atual;
			residencia.telefoneImobiliaria = dados.fone_imob_prop_atual;

			residencia.anterior.cep = dados.cep_anterior_inquilino;
			residencia.anterior.estado = dados.uf_anterior_inquilino;
			residencia.anterior.cidade = dados.cidade_anterior_inquilino;
			residencia.anterior.endereco = dados.endereco_anterior_inquilino;
			residencia.anterior.complemento = dados.complemento_anterior_inquilino;
			residencia.anterior.bairro = dados.bairro_anterior_inquilino;
			residencia.anterior.numero = parseInt(dados.num_anterior_inquilino);

			return residencia;
		}

		var preencherDadosProfissionais = function(dados){
			var profissional = {};
			profissional.naturezaRenda = dados.natureza_renda_inquilino;
			profissional.profissao = dados.profissao_inquilino;
			profissional.profissao_descricao = dados.profissao_inquilino_descricao;
			profissional.dataAdmissao = dados.data_admissao_inquilino;
			profissional.salario = dados.salario_inquilino;
			profissional.outrosRendimentos = dados.outros_rendim_inquilino;
			profissional.totalRendimentos = dados.total_rendim_inquilino;
			profissional.empresa = dados.empresa_trab_inquilino;
			profissional.telefone = dados.fone_com_inquilino;
			profissional.ramal = dados.ramal_com_inquilino;
			profissional.empresaAnterior = dados.empresa_anterior_inquilino;
			profissional.possuiRefBancaria = dados.ref_bancaria_inquilino;
			profissional.banco = dados.banco_inquilino
			profissional.agencia = dados.agencia_inquilino;
			profissional.contaCorrente = dados.ccorrente_inquilino;
			profissional.gerente = dados.gerente_inquilino;
			profissional.telefoneGerente = dados.fone_gerente_inquilino;

			return profissional;
		}

		var preencherDadosImovelPretendido = function(dados){
			var imovel = {};
			imovel.finalidade = dados.ocupacao == 'C' ? 'C' : 'R';
			imovel.tipo = dados.imovel_tipo;
			imovel.imovelTipoDescricao = dados.imovel_tipo_descricao;
			imovel.motivoLocacao = dados.motivo_locacao;
			imovel.locacaoEmpresaConstituida = dados.empresa_constituida;
			imovel.cnpjEmpresaConstituida = dados.cnpj_empresa_constituida;
			imovel.ramoAtividadeEmpresa = dados.ramo_atividade_empresa;
			imovel.trataDeFranquia = dados.franquia_empresa;
			imovel.nomeFranqueadora = dados.franqueadora_empresa;
			imovel.produtosFabRevPrest = dados.produtos_servicos_empresa;
			imovel.experienciaNoRamo = dados.experiencia_ramo_empresa;
			imovel.faturamentoMensalEstimado = dados.faturam_estim_empresa;
			imovel.prazoRetCapitalInvest = dados.ret_cap_invest_empresa;
			imovel.cep = dados.cep;
			imovel.estado = dados.uf;
			imovel.cidade = dados.cidade;
			imovel.endereco = dados.endereco;
			imovel.bairro = dados.bairro;
			imovel.numero = parseInt(dados.numero);
			imovel.complemento = dados.complemento;
			imovel.aluguel = dados.aluguel;
			imovel.iptu = dados.iptu;
			imovel.condominio = dados.condominio;
			imovel.agua = dados.agua;
			imovel.luz = dados.energia;
			imovel.gas = dados.gas;

			return imovel;
		}

		var preencherDadosComposicaoRenda = function(dados){
			var pessoal = {};
			pessoal.solidario1 = {};
			pessoal.solidario2 = {};
			pessoal.solidario3 = {};

			pessoal.possuiRendaArcarLocacao = dados.tem_renda_arcar_loc_inquilino;
			pessoal.numSolidarios = dados.num_solidarios;

			pessoal.solidario1.nome = dados.solidario1;
			pessoal.solidario1.cpf = dados.solidario1_cpf;
			pessoal.solidario1.rendaMensalBruta = dados.solidario1_renda;
			pessoal.solidario1.telefone = dados.solidario1_fone;
			pessoal.solidario1.sexo = dados.solidario1_sexo;
			pessoal.solidario1.numDoc = parseInt(dados.solidario1_rg);
			pessoal.solidario1.orgaoExpedidor = dados.solidario1_orgao_rg;
			pessoal.solidario1.dataEmissao = dados.solidario1_data_emissao_rg;
			pessoal.solidario1.dataValidade = dados.solidario1_data_valid_doc;
			pessoal.solidario1.estadoCivil = dados.solidario1_estado_civil;
			pessoal.solidario1.dataNascimento = dados.solidario1_data_nascimento;
			pessoal.solidario1.grauParentesco = dados.solidario1_grau_parentesco;
			pessoal.solidario1.cep = dados.solidario1_cep;
			pessoal.solidario1.iraResidirImovel = dados.solidario1_ira_residir;
			pessoal.solidario1.naturezaRenda = dados.solidario1_natureza_renda;
			pessoal.solidario1.localTrabalhoTel = dados.solidario1_empresa_trabalho;
			pessoal.solidario1.dataAdmissao = dados.solidario1_data_admissao;
			pessoal.solidario1.cpfConjuge = dados.solidario1_conjuge_cpf;

			pessoal.solidario2.nome = dados.solidario2;
			pessoal.solidario2.cpf = dados.solidario2_cpf;
			pessoal.solidario2.rendaMensalBruta = dados.solidario2_renda;
			pessoal.solidario2.telefone = dados.solidario2_fone;
			pessoal.solidario2.sexo = dados.solidario2_sexo;
			pessoal.solidario2.numDoc = parseInt(dados.solidario2_rg);
			pessoal.solidario2.orgaoExpedidor = dados.solidario2_orgao_rg;
			pessoal.solidario2.dataEmissao = dados.solidario2_data_emissao_rg;
			pessoal.solidario2.dataValidade = dados.solidario2_data_valid_doc;
			pessoal.solidario2.estadoCivil = dados.solidario2_estado_civil;
			pessoal.solidario2.dataNascimento = dados.solidario2_data_nascimento;
			pessoal.solidario2.grauParentesco = dados.solidario2_grau_parentesco;
			pessoal.solidario2.cep = dados.solidario2_cep;
			pessoal.solidario2.iraResidirImovel = dados.solidario2_ira_residir;
			pessoal.solidario2.naturezaRenda = dados.solidario2_natureza_renda;
			pessoal.solidario2.localTrabalhoTel = dados.solidario2_empresa_trabalho;
			pessoal.solidario2.dataAdmissao = dados.solidario2_data_admissao;
			pessoal.solidario2.cpfConjuge = dados.solidario2_conjuge_cpf;

			pessoal.solidario3.nome = dados.solidario3;
			pessoal.solidario3.cpf = dados.solidario3_cpf;
			pessoal.solidario3.rendaMensalBruta = dados.solidario3_renda;
			pessoal.solidario3.telefone = dados.solidario3_fone;
			pessoal.solidario3.sexo = dados.solidario3_sexo;
			pessoal.solidario3.numDoc = parseInt(dados.solidario3_rg);
			pessoal.solidario3.orgaoExpedidor = dados.solidario3_orgao_rg;
			pessoal.solidario3.dataEmissao = dados.solidario3_data_emissao_rg;	
			pessoal.solidario3.dataValidade = dados.solidario3_data_valid_doc;
			pessoal.solidario3.estadoCivil = dados.solidario3_estado_civil;
			pessoal.solidario3.dataNascimento = dados.solidario3_data_nascimento;
			pessoal.solidario3.grauParentesco = dados.solidario3_grau_parentesco;
			pessoal.solidario3.cep = dados.solidario3_cep;
			pessoal.solidario3.iraResidirImovel = dados.solidario3_ira_residir;
			pessoal.solidario3.naturezaRenda = dados.solidario3_natureza_renda;
			pessoal.solidario3.localTrabalhoTel = dados.solidario3_empresa_trabalho;
			pessoal.solidario3.dataAdmissao = dados.solidario3_data_admissao;
			pessoal.solidario3.cpfConjuge = dados.solidario3_conjuge_cpf;

			return pessoal;
		}


		var tratarTempoResidencia = function(dados){
			if(dados.includes("MENOS DE"))
				return "MENOS DE 1 ANO";

			if(dados.includes("DE 1"))
				return "DE 1 A 2 ANOS";

			if(dados.includes("DE 3"))
				return "DE 3 A 4 ANOS";

			if(dados.includes("DE 5"))
				return "DE 5 A 10 ANOS";

			if(dados.includes("ACIMA DE"))
				return "ACIMA DE 10 ANOS";

			return dados;
		}

		return service;
});
