<?php
require_once 'Database.php';
const USERS_TABLE = "fianca";
const USERS_TABLE = "seguradoras";
const USERS_TABLE = "usuarios";
const USERS_TABLE = "imobs";
const USERS_TABLE = "usuarios_imobs";
class Fianca {
    private $pdo;

    function __construct() 
    {
        $dbInstance = Database::getInstance();
        $this->pdo = $dbInstance->getConnection(); 
    }

    public function getFianca()
    {   $session = Session::getInstance();
        $sql = "SELECT *, 
            DATE_FORMAT(data_transm, '%d/%m/%Y') as data_transm_formatada,
            DATE_FORMAT(data_contratacao, '%d/%m/%Y') as data_contratacao_formatada,
            (SELECT fantasia FROM imobs WHERE imobs.cpf=fianca.CGC_imob) as fantasia, 
            (SELECT razao FROM imobs WHERE imobs.cpf=fianca.CGC_imob) as razao, 
            (SELECT razao FROM corretores WHERE corretores.codigo=fianca.corretor) as corretora,
            (SELECT ocupacao FROM profissao_cbo WHERE profissao_cbo.codigo_cbo COLLATE latin1_general_ci = fianca.profissao_resp_proprietario) as profissao_resp_descricao,
            (SELECT nome FROM usuarios WHERE usuarios.codigo=fianca.usuario_analise) as usuario_atendente
            from fianca where CGC_imob='$session->cnpj_imob' order by data_transm desc, hora_transm desc";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
    }

    public function getVariaveisSessao()
    {   $session = Session::getInstance();
        $CGC_imob = $session->cnpj_imob;
        $codigo_user = $session->codigo;
        $nivelAcesso = $session->acesso->nivel_acesso;
        $result = array('CGC_imob' => $CGC_imob, 'codigo_user' => $codigo_user, 'nivel_acesso' => $nivelAcesso); 
        return $result;
    }

    public function listarSeguradoras()
    {   
        $sql = "SELECT nome_abrev, sigla from seguradoras where fianca = '1' order by nome_abrev";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
    }

    public function consultarUsuario($parametro){
        $codigo = $parametro['codigo'];
        $nivel = $parametro['nivel'];

        if($nivel == '1'){
            $sql = "SELECT nome as user from usuarios where codigo='$codigo'";
        }else if($nivel == '2'){
            $sql = "SELECT usuario as user from imobs where codigo='$codigo'";
        }else if($nivel == '3'){
            $sql = "SELECT usuario as user from usuarios_imobs where codigo='$codigo'";
        }
    
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result;
    }

    public function incluirDadosContrato($formulario){
        $codigo = $formulario['codigo'];
        $dataServidor = date("Y-m-d H:i:s");
        $sql = "UPDATE `fianca` SET 
        `data_contratacao`='$dataServidor',
        `usuario_contratacao`='".$formulario['usuario_contratacao']."',
        `seguradora`='".$formulario['seguradora']."',
        `proprietario`='".$formulario['proprietario']."',
        `tipo_proprietario`='".$formulario['tipo_proprietario']."',
        `CPF_proprietario`= '".$formulario['CPF_proprietario']."',
        `data_proprietario`='".$formulario['data_proprietario']."',
        `est_civil_proprietario`='".$formulario['est_civil_proprietario']."',
        `rg_proprietario`='".$formulario['rg_proprietario']."',
        `orgao_exp_proprietario`='".$formulario['orgao_exp_proprietario']."',
        `data_exp_proprietario`='".$formulario['data_exp_proprietario']."',
        `resp_proprietario`='".$formulario['resp_proprietario']."',
        `CPF_resp_proprietario`='".$formulario['CPF_resp_proprietario']."',
        `profissao_resp_proprietario`='".$formulario['profissao_resp_proprietario']."',
        `inicio`='".$formulario['inicio']."',
        `fim_contrato`='".$formulario['fim_contrato']."',
        `indice_reajuste`='".$formulario['indice_reajuste']."',
        `forma_pagto`='".$formulario['forma_pagto']."'
         WHERE `codigo`= $codigo";

         $stmt = $this->pdo->prepare($sql);
         $stmt->execute();
         return $stmt->rowCount();
    }
}