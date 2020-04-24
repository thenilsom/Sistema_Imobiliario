<?php
require_once 'Database.php';
const USERS_TABLE = "fianca";
class Fianca {
    private $pdo;

    function __construct() 
    {
        $dbInstance = Database::getInstance();
        $this->pdo = $dbInstance->getConnection(); 
    }

    public function getFianca()
    {   $session = Session::getInstance();
        $sql = "SELECT *, DATE_FORMAT(data_transm, '%d/%m/%Y') as data_transm_formatada,
            (SELECT fantasia FROM imobs WHERE imobs.cpf=fianca.CGC_imob) as fantasia, 
            (SELECT razao FROM imobs WHERE imobs.cpf=fianca.CGC_imob) as razao, 
            (SELECT razao FROM corretores WHERE corretores.codigo=fianca.corretor) as corretora,
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
}