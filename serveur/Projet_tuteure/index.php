<?php

require_once 'vendor/autoload.php';

use Slim\Slim;
use projetapp\models\Parcours;
use projetapp\control\ParcoursController;
use projetapp\control\AdminController;
use conf\DBConf;


$app = new Slim();
DBConf::setConf();


$app->get('/', function () {
    echo $html = <<<END
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>Projetapp</title>
      </head>
      <body>
        <form id="f1" method="POST" action="index.php/add">
			
			<label for="f1_name"> entrer votre parcours:</label>
			<input type="text" id="f1_name" name="parcours" placeholder="<chemin>" required>
			
			<button type="submit" name="enregistrer_parcours" value="valid_f1">valider</button>
            <a href="/Projet_tuteure/web/HTML/test.html">Page de test</a>
            <a href="/Projet_tuteure/startbootstrap-creative-1.0.2/index.html">Page de finale</a>
		</form>
      </body>
    </html>
END;
});
$app->get('/parcour/:id', function ($id) {
    $controller = new ParcoursController();
    $controller->listerParcour($id);
});
$app->get('/parcours', function () {
    $controller = new ParcoursController();
    $controller->listerParcours();
});
$app->get('/arduino', function () {
    $controller = new ParcoursController();
    $controller->parcoursArduino();
});
$app->post('/add', function () {
    $controller=new AdminController();
    $controller->ajouterParcours($_POST['parcours']);
});
$app->post('/sup', function () {
    $controller=new AdminController();
    $controller->supprimerParcours($_POST['id']);
});
$app->post('/vider', function () {
    $controller=new AdminController();
    $controller->viderBase();
});
$app->post('/sel', function () {
    $controller=new AdminController();
    $controller->selectionParcours($_POST['id']);
});


$app->run();

?>

