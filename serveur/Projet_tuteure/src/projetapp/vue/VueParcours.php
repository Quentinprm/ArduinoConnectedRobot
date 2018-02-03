<?php

namespace projetapp\vue;

class VueParcours{
	
	private $_v;
	private $select;
	
	public function __construct($tab,$sel){
		$this->_v = $tab;
		$this->select = $sel;
	}
	
	public function render(){
		switch($this->select){
			case ('simple'):
				$content = $this->parcoursSimple();
			break;
			case ('liste'):
				$content = $this->parcoursListe();
			break;
		}
        echo $content;
	}
	
	public function parcoursSimple(){
		$res = "";
		foreach($this->_v as $value){
			$res = $res.$value->chemin;	
		}
		return $res;
	}
	
	public function parcoursListe(){
		$res="";
		foreach($this->_v as $value){
            $res = $res.'<p class="parcours">';
			$res = $res.$value->id;
			$res = $res." ".$value->chemin;
            $res = $res.'<button class="boutonP" onclick="quad.fonctions.app.selectionner('.$value->id.')">selectionner</buton>';
            $res = $res.'<button class="boutonP" onclick="quad.fonctions.app.supprimer('.$value->id.')">supprimmer</button>';
            $res = $res.'</p>';
		}
		return $res;
	}
	
}


?>