<?php 	 header("Access-Control-Allow-Origin: *");
	 header("Access-Control-Allow-Methods: GET,PUT,POST,DELETE");
	 header("Access-Control-Allow-Headers: Content-Type, Authorization");

    require_once '../../Classes/Fianca.php';
    require_once '../../Classes/Session.php';
    $session = Session::getInstance();
    if(!$session->codigo) {
        echo json_encode(array('error'=> 'Voce nao esta logado.'));
        die();
    }

    $fianca = new Fianca();
    $fiancaData = $fianca->getFianca();
    echo json_encode($fiancaData);