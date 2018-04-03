// Global Variables
var main = $("body"),
    hero = "",
    defender = "",
    message = document.getElementById("message"),
    unassigned = true,
    reloadBtn = document.getElementById("reload");
    totalEnemies = 3



// Characters
var pOne = {
    name: "Catman Dieu",
    hp: 120,
    ap: 8,
    cap: 25
}

var pTwo = {
    name: "Sasha Velour",
    hp: 100,
    ap: 6,
    cap: 5
}

var pThree = {
    name: "934-TXS",
    hp: 150,
    ap: 9,
    cap: 15
}

var pFour = {
    name: "B.M. Fahrtz",
    hp: 180,
    ap: 5,
    cap: 4
}

$(document).ready(function () {
    // Set Image
    var oneImg = $('<img src="assets/images/pOne/stand.png">');
    oneImg.appendTo('#oneImg');
    var twoImg = $('<img src="assets/images/pTwo/stand.png">');
    twoImg.appendTo('#twoImg');
    var threeImg = $('<img src="assets/images/pThree/stand.png">');
    threeImg.appendTo('#threeImg');
    var fourImg = $('<img src="assets/images/pFour/stand.png">');
    fourImg.appendTo('#fourImg');
});

function reset() {
    // Set Names
    var oneName = document.getElementById("oneName");
    oneName.innerHTML = pOne.name;
    var twoName = document.getElementById("twoName");
    twoName.innerHTML = pTwo.name;
    var threeName = document.getElementById("threeName");
    threeName.innerHTML = pThree.name;
    var fourName = document.getElementById("fourName");
    fourName.innerHTML = pFour.name;

    // Set HP
    var oneHp = document.getElementById("oneHp");
    oneHp.innerHTML = pOne.hp;
    var twoHp = document.getElementById("twoHp");
    twoHp.innerHTML = pTwo.hp;
    var threeHp = document.getElementById("threeHp");
    threeHp.innerHTML = pThree.hp;
    var fourHp = document.getElementById("fourHp");
    fourHp.innerHTML = pFour.hp;

    
};

// Initial reset
reset();

// Character selection
$(main).on("click", ".playerTile", function() {
    if (unassigned === true) {

        // Assign hero class to clicked, remove unassigned class
        $(this).removeClass("unassigned").addClass("hero");

        // Assign enemy class to others, remove unassigned class, move to enemies box
        var enemies = $(".playerTile").not($(this));
        $(enemies).removeClass("unassigned").addClass("enemy").appendTo($("#enemiesCont"));

        // Prevent recursion
        unassigned = false;
    }
    else if (unassigned === false) {
        // Assign defender class, remove enemy class, move to defender box
        $(this).removeClass("enemy").addClass("defender").appendTo($("#defCont"));
    }
});

// Attack button
$(main).on("click", ".attack", function() {
    // Find div.hero
    hero = $(".hero");
    // Make player = character variable
    player = eval(hero.attr('id'));

    // Find div.defender
    defender = $(".defender");
    // Make computer = character variable
    computer = eval(defender.attr('id'));

    // Player attack
    computer.hp -= player.ap;
    message.innerHTML = "You hit " + computer.name + " for " + player.ap + " damage<br>";

    // Computer counterattack
    player.hp -= computer.cap;
    message.insertAdjacentHTML('beforeend', computer.name + " counter attacks for " + computer.cap + " damage<br>");

    // Player attack build up
    player.ap += player.ap;
    console.log(player.ap);

    // Visual stat reset
    reset();

    if (player.hp <= 0) {
        message.innerHTML = "Game over!";
        message.insertAdjacentHTML(
            'beforeend', 
            '<div id="reload"><p align="center">Reload</p><img src="http://www.placecage.com/100/100"></div>');
    };

    if (computer.hp <= 0) {
        message.innerHTML = "You have defeated " + computer.name + ". You can choose to fight another enemy.";
        defender.addClass("hidden");
        defender.removeClass("defender");
        totalEnemies -= 1;
    };

    if (totalEnemies <= 0) {
        message.innerHTML = "You win!";
    }

});

// Reload
$(main).on("click", "#reload", function() {
    location.reload();
})
