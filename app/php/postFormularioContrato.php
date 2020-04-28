<?php header("Access-Control-Allow-Origin: *");
	 header("Access-Control-Allow-Methods: GET,PUT,POST,DELETE");
	 header("Access-Control-Allow-Headers: Content-Type, Authorization");

    require_once '../../Classes/Fianca.php';
    require_once '../../Classes/Session.php';

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata, true);// Convert from object to array

    $session = Session::getInstance();
    if(!$session->codigo) {
        echo json_encode(array('error'=> 'Voce nao esta logado.'));
        die();
    }

       
    $fianca = new Fianca();
    $result = $fianca->incluirDadosContrato($request);

    if($result)
        echo json_encode(array("success"=> "Dados salvos com sucesso!"));
    else
        echo json_encode(array("critical"=> "Dados não puderam ser gravados."));