"use strict"

const ageAlcool=16;   // à transformer en millisecondes pour le if

function verifAge() {
    let naissance=document.getElementById("dateNaissance").value;    // on récupères un ISOString qu'on transforme en dte à la prochaine ligne
    let age= new Date()- new Date(naissance);   // résultat en millisecondes
    let ageAlcoolMilli=ageAlcool*365*24*60*60*1000; // transforme ageAlcool en millisecondes
    if ((age/ageAlcoolMilli)>=1) {
        //redirection("../venteBieres.html");   // envoie sur une nouvelle page, ne fonctionne pas depuis ce fichier mais fonctionne en console. Ne fonctionne pas.
        document.getElementById("messageVerifAge").innerHTML="<h1> Accès autorisé </h1> <br> <a href= \"venteBieres.html\" class=retourMain> Poursuivre vers la boutique </a>";
    }
    else{
        document.getElementById("messageVerifAge").innerHTML= "<h1> Accès refusé </h1> <br> <p>Vous devez avoir 16 and pour acheter de l'alcool en belgique. <br> <a href=\" https://www.ejustice.just.fgov.be/cgi_loi/loi_a.pl\" class=\"loi\" > Règles sur l'achat d'alcool en Belgique</a> </p>  <a href= \"main.html\" class=retourMain> Retourner à la page d'acceuil </a>";
        document.getElementById("formAge").innerHTML="";
    }

    return false
}


/**
 * Redirige l'utilisateur vers une autre adresse.
 * @param {string} adresse , représente l'adresse vers lequel diriger l'utilisateur.
 */
function redirection(adresse) {
    window.location.href=adresse;      // différence entre document et window    -> synonymes      NE FONCTIONNE PAS -> ????
}