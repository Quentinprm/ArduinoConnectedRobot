<?php

namespace projetapp\control;

use projetapp\models\Parcours;

class AdminController{
	
	public function ajouterParcours($chemin){
		$parcours = new Parcours();
		$parcours->chemin=$chemin;
		$parcours->save();
	}
    
    public function selectionParcours($id){
        Parcours::where('id','like',$id)->update(['selectionne'=>'true']);
    }
    
    public function supprimerParcours($id){
        Parcours::destroy($id);
    }
    
    public function viderBase(){
        Parcours::truncate();
        echo 'done';
    }
	
}

?>