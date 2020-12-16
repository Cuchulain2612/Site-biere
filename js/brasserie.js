"use strict"

// document.cookie="test=234; coucou=241";
// var cookieUn=document.cookie;



const ageAlcool=16;   // à transformer en millisecondes pour le if

var panierCourse={
    beer1:{nombre:0, prix:2.5},
    beer2:{nombre:0, prix:3},
    beer3:{nombre:0, prix:2},
    beer4:{nombre:0, prix:1.75},
}

var nomBiere={beer1:"Première bière",beer2:"Deuxième bière",beer3:"Troisième bière",beer4:"Quatrième bière",}

/**
 * Récupère la date de naissance introduite dans un formulaire et verifie si la personne a 16 ans (et plus) ou pas
 * -> Envoie vers la page venteBieres.html si la personne est assez agée
 * -> Sinon: change le DOM et affiche que l'accès lui est interdit et mets un lien vers la page d'acceuil
 *  
 */
function verifAge() {
    let naissance=document.getElementById("dateNaissance").value;    // on récupères un ISOString qu'on transforme en dte à la prochaine ligne
    let age= new Date()- new Date(naissance);   // résultat en millisecondes
    let ageAlcoolMilli=ageAlcool*365*24*60*60*1000; // transforme ageAlcool en millisecondes
    if ((age/ageAlcoolMilli)>=1) {
        redirection("venteBieres.html");   // envoie sur une nouvelle page, ne fonctionne pas depuis ce fichier mais fonctionne en console. Ne fonctionne pas.
        //document.getElementById("messageVerifAge").innerHTML="<h1> Accès autorisé </h1> <br> <a href= \"venteBieres.html\" class=retourMain> Poursuivre vers la boutique </a>";
        document.getElementById("formAge").innerHTML="";
        console.log("Accès autorisé");
    }
    else{
        document.getElementById("messageVerifAge").innerHTML= "<h1> Accès refusé </h1> <br> <p>Vous devez avoir 16 ans pour acheter de l'alcool en belgique. <br> <a href=\" https://www.ejustice.just.fgov.be/\" class=\"loi\" > Règles sur l'achat d'alcool en Belgique</a> </p>  <a href= \"main.html\" class=retourMain> Retourner à la page d'acceuil </a>";
        document.getElementById("formAge").innerHTML="";
        console.log("Accès restreint");
    }

    return false;
}


/**
 * Redirige l'utilisateur vers une autre adresse.
 * @param {string} adresse , représente l'adresse vers lequel diriger l'utilisateur.
 */
function redirection(adresse) {
    window.location.href=adresse;      // différence entre document et window    -> synonymes      NE FONCTIONNE PAS POUR CHROME (ma version mac)
    return false;
}

function ajouterPanier(beer){
    beer.nombre+=1;
    return false;
}

function retirerPanier(beer){
    if (beer.nombre>0){
        beer.nombre-=1;
    }
    else{
        alert("Il n'en reste plus dans votre panier.")
    }
    return false;
}


/**
 * A partir du panier récupéré dans les cookies modifie la DOM et affiche dans un tableau notre list de course.
 * Affiche aussi un tableau avec le prix sans et avec TVA.
 */
function creerTablePanier(){     // mis dans <script> car ne fonctionne pas avec onload
    var clefs=Object.keys(cookieToObjetPanier());
    var panierCourseFin=cookieToObjetPanier();
    var texteTab="";
    var sousTot=0;
    clefs.sort( function(v,w){return (panierCourseFin[w].nombre - panierCourseFin[v].nombre)} );  // tri en fonction de leur nombre
    console.log(clefs);
    for(let i of clefs){

        if(panierCourseFin[i].nombre>0) {    // ATTENTION -> ne rentre pas
            console.log("test");
            texteTab+= "<tr> <td>"+ nomBiere[i] + "</td> <td>" + panierCourseFin[i].nombre + "</td> <td>"+ panierCourseFin[i].prix + "€ </td> <td>" + panierCourseFin[i].nombre*panierCourseFin[i].prix +"€</td> </tr>";
            sousTot+= panierCourseFin[i].nombre*panierCourseFin[i].prix;
        }
        
    }

    if(texteTab.length==0){
         texteTab="<tr class=\"panierVide\"> <td> Panier vide </td> <td> - </td> <td> - </td> <td> - </td> </tr>";
    }

    document.getElementById("objetPanier").innerHTML+= texteTab;
    document.getElementById("sousTotal").innerHTML+= "<td>" +sousTot+ "€ </td>";
    document.getElementById("total").innerHTML+= "<td>"+ (sousTot*1.21).toFixed(2)+"€ </td>";   // essayer de faire d'une autre manière? Utiliser map?
}

/**
 * Récupères le nombre de chaque bière dans la variable panier et en crée des cookies
 * 
 */
function mettrePanierCookie() {
    var dateDeleteCookie= new Date() + 120000;    //limité à deux minutes pour le moment
    var clefs=Object.keys(panierCourse);
    for (let e of clefs) {

        document.cookie= "" +e+"="+panierCourse[e].nombre+";" +dateDeleteCookie+ ";path=/";     // espace en trop au début de la variable  -> comme ça que ça marche, il y a des espaces devant les cookies sauf pour le dernier envoyé
                                                                                               // les nouvelles valeurs cookie sont mis au début. On va rajouter une valeur cookie pour mettre un espace sur tous ceux qu'on veut
    }
    document.cookie="espace=..."
    
}

/**
 * Lis les cookies et crée un objet équuivalent à panier (avant qu'il soit envoyé dans les cookies)
 * Renvoie cet objet.
 */
function cookieToObjetPanier() {    // objet final
    var listeCookie=document.cookie.split(";"); // on transforme le string en array
    var listeCookieTest= listeCookie.map(function(elem) { return elem.slice(1,6)})   // on crée un array avec les string raccourcis   ATTENTION: fonction de map -> besoin d'un return
                                                                                     // avec le slice on enlève l'espace avant et tout ce qu'il y a a partir de =
    var panierCourseFromCookie={                                                     
        beer1:{nombre:0, prix:2.5},
        beer2:{nombre:0, prix:3},
        beer3:{nombre:0, prix:2},
        beer4:{nombre:0, prix:1.75},
    }

    for(let e in listeCookieTest) {   
     
        if( listeCookieTest[e].slice(0,4)=="beer") {
            panierCourseFromCookie[listeCookieTest[e]].nombre=parseFloat(listeCookie[e].slice(7,listeCookie[e].length));   // on mets comme valeur nombre le nombre dans le string de cookie   parseFloat ne marche pas
                                                                                                                            // attention pour le .slice() la deuxième valeur (fin du slice) est non comprise
        }
    }


    return panierCourseFromCookie;
}

/**
 * Récupère les valeures dans le formulaire de contact et mets les valeurs dans un objet demande à envoyer quelque part d'autre
 * Modifie la DOM et affiche un message comme quoi la demande a été envoyée (ce n'est pas le cas pour le moment -> manque de connaissances)
 */
function getDemande() {
    var demande={    // à envoyer à un serveur, etc.
        nom:"",
        email:"",
        texte:"",}

    demande.nom= document.getElementById("nom").value;
    demande.email= document.getElementById("email").value;
    demande.texte= document.getElementById("demande").value;

    document.getElementById("contact").innerHTML= "<p class=\"reponseContact\"> Votre demande de contact a été envoyé. </p>";

    return false;
}


// POSSIBILITE: faire un split avec ; et un espace