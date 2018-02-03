<?php

namespace projetapp\control;

use \projetapp\models\Parcours;
use \projetapp\vue\VueParcours;

class ParcoursController{
	
	public function listerParcour($id){
		$parcours = Parcours::where( 'id' , 'like' , $id)->get();
		$v = new VueParcours($parcours,"simple");
		$v->render();
	}
	
	public function listerParcours(){
		$liste_Par=Parcours::all();
		$v = new VueParcours($liste_Par,"liste");
		$v->render();
	}
	
	public function parcoursArduino(){
		$res = "@";
		$parcours = Parcours::where( 'selectionne' , 'like' , 'true')->get();
		foreach($parcours as $var=>$val){
			$res = $res.$val->chemin;
		}
		$res = $res."#";
		echo $res;
	}
	
}


?>
