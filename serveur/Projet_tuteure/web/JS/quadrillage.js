var quad = (function () {
    return {
        cases: [{
            x: 0
            , y: 0
        }]
        , fonctions: {}
        , url_serveur : '/Projet_Tuteure/index.php/'
    }
})();

quad.fonctions.case = (function () {
    return {
        ajouterCase: function (abs, ord) {
            quad.cases.push({
                x: abs
                , y: ord
            });
            console.log(abs, ord);
            quad.fonctions.app.affichageParcoursCreation(abs, ord);
        }
        , reinitialiser: function () {
            quad.cases = [{
                x: 0
                , y: 0
            }];
        }
    }
})();

quad.fonctions.parcours = (function () {
    return {
        transformCaseParcours: function (tab) {
            var sensActuel = "haut";
            console.log("debut transformation");
            var tab = this.decoupage(quad.cases);
            console.log("tab :" + quad.fonctions.app.affichage(tab));
            var par = "";


            for (var i = 0; i < tab.length - 1; i++) {
                if (tab[i].y < tab[i + 1].y) {
                    if (sensActuel != "haut") {
                        par += this.tourner("haut", sensActuel);
                        sensActuel = "haut";
                    }
                    par += "A";
                } else if (tab[i].y > tab[i + 1].y) {
                    if (sensActuel != "bas") {
                        par += this.tourner("bas", sensActuel);
                        sensActuel = "bas";
                    }
                    par += "A";
                } else if (tab[i].x < tab[i + 1].x) {
                    if (sensActuel != "droite") {
                        par += this.tourner("droite", sensActuel);
                        sensActuel = "droite";
                    }
                    par += "A";
                } else if (tab[i].x > tab[i + 1].x) {
                    if (sensActuel != "gauche") {
                        par += this.tourner("gauche", sensActuel);
                        sensActuel = "gauche";
                    }
                    par += "A";
                } else {
                    par += "";
                }
                console.log("res :" + par + " : " + i + " : " + sensActuel);

            }


            console.log("fin transformation");
            return par;

        }
        , tourner: function (direction, sens) {
            res = "";
            switch (direction) {
            case "haut":
                if (sens == "gauche") {
                    res += "D";
                } else if (sens == "droite") {
                    res += "G";
                } else if (sens == "bas") {
                    res += "DD";
                }
                break;
            case "bas":
                if (sens == "gauche") {
                    res += "G";
                } else if (sens == "droite") {
                    res += "D";
                } else if (sens == "haut") {
                    res += "DD";
                }
                break;
            case "droite":
                if (sens == "gauche") {
                    res += "GG";
                } else if (sens == "haut") {
                    res += "D";
                } else if (sens == "bas") {
                    res += "G";
                }
                break;
            case "gauche":
                if (sens == "haut") {
                    res += "G";
                } else if (sens == "droite") {
                    res += "DD";
                } else if (sens == "bas") {
                    res += "D";
                }
                break;
            default:
                res += "";
                break;
            }
            return res;
        }
        , decoupage: function (tab) {
            var res = [];
            console.log("debut découpage");
            console.log("tab :" + quad.fonctions.app.affichage(tab));

            for (var i = 0; i < tab.length - 1; i++) {
                if (tab[i].x == tab[i + 1].x) {
                    var j = tab[i].y;
                    while (j != tab[i + 1].y) {
                        res.push({
                            x: tab[i].x
                            , y: j
                        });
                        if (tab[i].y > tab[i + 1].y) {
                            j--;
                        } else {
                            j++;
                        }
                    }
                    res.push(tab[i + 1]);
                } else if (tab[i].y == tab[i + 1].y) {
                    var k = tab[i].x;
                    while (k != tab[i + 1].x) {
                        res.push({
                            x: k
                            , y: tab[i].y
                        });
                        if (tab[i].x > tab[i + 1].x) {
                            k--;
                        } else {
                            k++;
                        }
                    }
                    res.push(tab[i + 1]);

                } else {
                    var inter = {
                        x: tab[i].x
                        , y: tab[i + 1].y
                    };
                    console.log("inter :" + quad.fonctions.app.affichage(inter));
                    var part1 = quad.fonctions.parcours.decoupage([tab[i], inter]);
                    var part2 = quad.fonctions.parcours.decoupage([inter, tab[i + 1]]);
                    console.log("part1 :" + quad.fonctions.app.affichage(part1));
                    console.log("part2 :" + quad.fonctions.app.affichage(part2));
                    for (var t = 0; t < part1.length; t++) {
                        res.push(part1[t]);
                    }
                    for (var s = 1; s < part2.length; s++) {
                        res.push(part2[s]);
                    }
                }
                console.log("res :" + quad.fonctions.app.affichage(res));

            }
            console.log("res :" + quad.fonctions.app.affichage(res));
            console.log("fin découpage");
            return res;

        }

    }
})();

quad.fonctions.app = (function () {

    return {
        affichageParcoursCreation: function (abs, ord) {
            var aff = $('#parcoursCrea');
            $('<p class="case">[' + abs + '|' + ord + ']</p>').appendTo(aff);
        }
        , affichageParcoursTransforme: function (parcours) {
            var aff = $('#parcoursTrans');
            $('<p>' + parcours + '</p>').appendTo(aff);
        }
        , affichageBase: function (data) {
            console.log('affichage de la base');
            var aff = $('#parcoursDB');
            aff.empty();
            $('<h2>Liste des parcours :</h2>').appendTo(aff);
            $('<p>'+data+'</p>').appendTo(aff);
        }
        , nettoyageAffichage: function (option) {
            if (option == "Crea") {
                $('#parcoursCrea').empty();
                $('<h2>Parcours en cours de création :</h2>').appendTo($('#parcoursCrea'));
            } else if (option == 'Trans') {
                $('#parcoursTrans').empty();
                $('<h2>Parcours formaté :</h2>').appendTo($('#parcoursTrans'));
            }
        }
        , affichage: function (tabCase) {
            //fonction util pour l'affichage de tableau
            //Utile pour debugger
            var res = "";
            for (var i = 0; i < tabCase.length; i++) {
                res += tabCase[i].x + " " + tabCase[i].y + ",";
            }
            return res;

        }
        , parcoursSimple: function () {
            quad.fonctions.case.ajouterCase(0, 4);
            quad.fonctions.case.ajouterCase(4, 4);
            quad.fonctions.case.ajouterCase(4, 0);
        }
        , refresh: function () {
            console.log('refresh');
            
            $.ajax({
                url: quad.url_serveur+'parcours' 
                , type: "GET"
                , dataType: "html"
                , data: null
                , success: quad.fonctions.app.affichageBase
                , xhrFields: {
                    withCredentials: true
                }
                , crossDomain: true
            })

        }
        , viderDB: function (callback) {
            $.ajax({
                url: quad.url_serveur + "vider"
                , type: "POST"
                , data: 'vider=' + true
                , dataType: "json"
                , success: callback
                , xhrFields: {
                    withCredentials: true
                }
                , crossDomain: true
            })
        }
        , supprimer: function (id) {
            var callback = quad.fonctions.app.refresh;
            $.ajax({
                url: quad.url_serveur + "sup"
                , type: "POST"
                , data: 'id=' + id
                , dataType: "json"
                , success: callback
                , xhrFields: {
                    withCredentials: true
                }
                , crossDomain: true
            });
            
        }
        , selectionner: function(id) {
            var callback = console.log;
            $.ajax({
                url: quad.url_serveur + "sel"
                , type: "POST"
                , data: 'id=' + id
                , dataType: "json"
                , success: callback
                , xhrFields: {
                    withCredentials: true
                }
                , crossDomain: true
            });
        }
        , save: function () {
            quad.cases.push({
                x: 0
                , y: 0
            });
            var parcours = quad.fonctions.parcours.transformCaseParcours(quad.cases);
            quad.fonctions.app.affichageParcoursTransforme(parcours);
            var callback = console.log;
            $.ajax({
                url: quad.url_serveur + "add"
                , type: "POST"
                , data: 'parcours='+parcours
                , dataType: "json"
                , success: callback
                , xhrFields: {
                    withCredentials: true
                }
                , crossDomain: true
            });
            quad.fonctions.app.refresh();
            quad.fonctions.case.reinitialiser();
        }
    }
})();
