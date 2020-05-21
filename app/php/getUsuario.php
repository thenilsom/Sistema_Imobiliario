<?php header("Access-Control-Allow-Origin: *");
      header("Access-Control-Allow-Methods: GET,PUT,POST,DELETE");
      header("Access-Control-Allow-Headers: Content-Type, Authorization");

   require_once '../../Classes/Fianca.php';
    require_once '../Classes/Session.php';

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata, true);        // Convert from object to array

    $session = Session::getInstance();
    if(! $session->codigo) {
        echo json_encode(array('error'=> 'Voce nao tem autorizacao pra acessar essa pagina.'));
        die();
    }   
     
    $fianca = new Fianca();    
    $userData = $fianca->consultarUsuario($request); 
    echo $userData;