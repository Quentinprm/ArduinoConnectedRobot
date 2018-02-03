<?php
namespace conf;


class DBConf {
    public static function setConf(){
        $db = new \Illuminate\Database\Capsule\Manager();
        $db->addConnection(parse_ini_file('db.projetapp.conf.ini'));
        $db->setAsGlobal();
        $db->bootEloquent();
        return $db;
    }
}