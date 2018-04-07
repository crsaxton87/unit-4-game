// Global Variables
var main = $("body"),
    hero = "",
    defender = "",
    baseAP = 0,
    message = document.getElementById("message"),
    unassigned = true,
    reloadBtn = document.getElementById("reload"),
    totalEnemies = 3,
    win = false;



// Characters
var pOne = {
    name: "Catman Dieu",
    hp: 120,
    ap: 8,
    cap: 25
};

var pTwo = {
    name: "Sasha Velour",
    hp: 100,
    ap: 6,
    cap: 20
};

var pThree = {
    name: "934-TXS",
    hp: 150,
    ap: 9,
    cap: 15
};

var pFour = {
    name: "B.M. Fahrtz",
    hp: 180,
    ap: 5,
    cap: 4
};

// Backgrounds
var bg = [
    "assets/images/bg/bg1.png",
    "assets/images/bg/bg2.png",
    "assets/images/bg/bg3.png"
];

// Set random background
var newBg = bg[Math.floor(Math.random() * bg.length)];
$('#bg').attr('src', newBg);

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

// Audio functions
var hit1 = new Audio('assets/audio/hit1.wav');
var hit2 = new Audio('assets/audio/hit2.wav');
var bgmusic = new Audio('assets/audio/bgmusic.mp3');
bgmusic.play();

// Initial reset
reset();

// Character selection
$(main).on("click", ".playerTile", function() {
    if (unassigned === true) {

        // Assign hero class to clicked, remove unassigned and playerTile class
        $(this).removeClass("unassigned playerTile").addClass("hero").appendTo($(".herobox"));

        // Assign enemy class to others, remove unassigned class, move to enemies box
        var enemies = $(".playerTile").not($(this));
        $(enemies).removeClass("unassigned").addClass("enemy").appendTo($("#enemiesCont"));

        // Put player health in GUI
        player = eval($(".hero").attr('id'));
        $("#healthOne").html(player.hp);

        // Set player base AP
        baseAP = player.ap;

        // Hide character selector / show enemy selector
        $(".choose-char").css({"display":"none"});
        $(".choose-enemy").css({"display":"block"});

        // Prevent recursion
        unassigned = false;
    }
    else if (unassigned === false) {
        // Assign defender class, remove enemy class, move to defender box
        $(this).removeClass("enemy playerTile").addClass("defender").appendTo($(".defbox"));

        // Flip defender image
        $(".defender").find(".pImg").find("img").css({"-webkit-transform":"scaleX(-1)","transform":"scaleX(-1)"});

        // Put defender health in GUI
        defender = eval($(".defender").attr('id'));
        $("#healthTwo").html(defender.hp);

        // Hide enemy selector / show defender
        $(".choose-enemy").css({"display":"none"});
        $(".choose-def").css({"display":"block"});
        
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
    $("#healthTwo").html(computer.hp);

    // Show player damage in bubble
    $("#damageRight").html('<p>' + player.ap + '</p>').css({"display":"block"});
    var Rdamage = setInterval(hideRdamage, 1000);
    function hideRdamage () {
        $("#damageRight").css({"display":"none"});
        clearInterval(Rdamage);
    }

    // Show player damage in message
    message.innerHTML = "You hit " + computer.name + " for " + player.ap + " damage<br>";

    // Play hit1 audio
    hit1.play();

    // Computer counterattack
    player.hp -= computer.cap;

    // Show defender damage in bubble
    var delay = setInterval(delayLdamage, 750);
    function delayLdamage () {
        $("#damageLeft").html('<p>' + computer.cap + '</p>').css({"display":"block"});
        var Ldamage = setInterval(hideLdamage, 1000);
        function hideLdamage () {
            $("#damageLeft").css({"display":"none"});
            clearInterval(Ldamage);
        }
        clearInterval(delay);
        hit2.play();
    }
    $("#healthOne").html(player.hp);


    // Show defender damage in message
    message.insertAdjacentHTML('beforeend', computer.name + " counter attacks for " + computer.cap + " damage<br>");

    // Player attack build up
    player.ap += baseAP;

    // Visual stat reset
    reset();

    if (player.hp <= 0) {
        message.innerHTML = "Game over!";
        message.insertAdjacentHTML(
            'beforeend', 
            '<div id="reload"><p align="center">Reload</p><img src="http://www.placecage.com/100/100"></div>');
        
        var wait = setInterval(showLose, 2000);
        message.innerHTML = "Game Over";
        win = true;
    }

    function showLose () {
        $(".loseText").css({"display":"block"});
        clearInterval(wait);
    }

    if (computer.hp <= 0) {
        message.innerHTML = "You have defeated " + computer.name + ". You can choose to fight another enemy.";
        defender.addClass("hidden");
        defender.removeClass("defender");
        totalEnemies -= 1;
        var wait = setInterval(showEnemies, 2000);
    }

    function showEnemies () {
        if (win == false) {
            $(".choose-enemy").css({"display":"block"});
            clearInterval(wait);
        }
    }

    if (totalEnemies <= 0) {
        var wait = setInterval(showWin, 2000);
        message.innerHTML = "You win!";
        win = true;
    }

    function showWin () {
        $(".winText").css({"display":"block"});
        clearInterval(wait);
    }

});

// Reload
//$(main).on("click", "#reload", function() {
//    location.reload();
//})
