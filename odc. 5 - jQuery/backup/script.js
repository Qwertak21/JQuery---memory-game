var cardsDefault =  ["ciri.jpg", "geralt.jpg", "jaskier.jpg", "iorweth.jpg", "triss.jpg", "yen.jpg", "letho.jpg", "vernon.jpg", "priscilla.jpg", "saskia.jpg", "serrit.jpg", "roach.jpg", "caranthir.jpg", "zoltan.jpg", "morenn.jpg"];

var cards = new Array(30);

var sfx = new Array("sfx/start.mp3","sfx/burn.mp3","sfx/match.mp3","sfx/win.mp3");

var turnCounter = seconds1 = minutes1 = seconds2 = minutes2 = points1 = points2 = 0;
var lock = oneVisible = false;
var visibleNr, pairsLeft;
var whoNow = 1;
var sound = new Audio();
sound.volume = 0.3;
var timeOff = timeOff1 = timeOff2 = true;
var timeVar;

window.onload = start;
function start()
{
	$(".player").css("opacity", 0.0);
	$(".board").html('<br/><br/><p>Choose difficulty level:</p><span class="option" onclick="generateBoard(1)">easy</span> <span class="option"  onclick="generateBoard(2)">medium</span> <span class="option"  onclick="generateBoard(3)">hard</span>');
}

function generateBoard(difficulty)		//Przygotowanie nowej gry
{
	play(0);
	boardValue = "";
	
	if(difficulty == 1)		//Ustawienie poziomu trudności
	{
		$(".board").css('width','600');
		quantity = 12;
		pairsLeft = 6;
	}
	else if(difficulty == 2)
	{
		$(".board").css('width','750');
		quantity = 20;
		pairsLeft = 10;
	}
	else
	{
		$(".board").css('width','900');
		var quantity = cards.length;
		pairsLeft = 15;
	}
	
	for(let i=0; i<15; i++){		//Resetuje tablice par
		cards[2*i] = cardsDefault[i];
		cards[2*i+1] = cardsDefault[i];
	}
	
	for(let i=0; i<quantity; i++)		//Generuje karty na planszy
	{
		boardValue += '<div class="card" id="c'+i+'"></div>'; 
		preloadImage(cards[i]);
	}
	
	boardValue += '<div class="statistics" id="score">Turn counter:  0</div>';
	$(".board").html(boardValue);
	
	for(let i=0; i<quantity; i++)		//Przypisanie zdarzeń kartom
	{
		$("#c"+i).on("click", function() { revealCard(i); } ); 
	}
	
	for(let i=0; i<quantity; i++)		//Losowanie kart
	{
		let a = getRandomInt(0, quantity);
		let temp = cards[i];
		cards[i] = cards[a];
		cards[a] = temp;
	}

	$("#timer1").html("Timer:  00:00");		//Pozostałe ustawienia wejściowe gry
	$("#timer2").html("Timer:  00:00");
	$("#score1").html("Points: 0");
	$("#score2").html("Points: 0");
	$("#player1").css("opacity", 1.0);
	$("#player2").css("opacity", 0.3);
}

function getRandomInt(min, max) 		//Pomocnicza funkcja losująca do zamiany na shuffle
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function revealCard(nr)		//Odsłania kartę
{
	var opacityValue = $('#c'+nr).css('opacity');
	if(opacityValue > 0.1 && !lock && nr != visibleNr)
	{
		lock = true;
		var picture = "url(img/" + cards[nr] + ")";
	
		$('#c'+nr).css('background-image', picture);
		$('#c'+nr).addClass('cardA');
		$('#c'+nr).removeClass('card');
		
		if(oneVisible == false)		//pierwsza karta
		{
			oneVisible = true;
			visibleNr = nr;
			lock = false;
		}
		else									//druga karta
		{
			if(cards[nr] == cards[visibleNr])		//Trafienie
			{
				
				play(2);
				setTimeout(function() { hideTwoCards(nr, visibleNr) ;}, 1000);
			}
			else													//Pudło
			{
				setTimeout(function() { restoreTwoCards(nr, visibleNr) ;}, 1000);
			}
			
			turnCounter++;
			$('#score').html('Turn counter: ' +turnCounter);
			oneVisible = false;
		}
	}
	
	if(timeOff)	//Start stopera
	{
		timeVar = setInterval("timeCounter()", 1000);
		timeOff = timeOff1 = false;
	}
}

function hideTwoCards(nr1, nr2)		//Trafienie
{
	$('#c'+nr1).css('opacity', '0.1');
	$('#c'+nr2).css('opacity', '0.1');
	pairsLeft--;
	if(whoNow == 2)	{ points2++;	$("#score2").html("Points: " + points2); }
	else { points1++;		$("#score1").html("Points: " + points1); }
	
	
	if(pairsLeft == 0)		//Zwycięstwo
	{
		let boardValue;
		if(points1>points2)	{ boardValue = '<h1 style="color: #51C8F2;">Player1 wins!</h1>'; } 
		else if(points2>points1) { boardValue = '<h1 style="color: #F24C51;">Player2 wins!</h1>'; }
		else if((minutes1*60+seconds1)<(minutes2*60+seconds2)) { boardValue = '<h1 style="color: #51C8F2;">Player1 wins by time!</h1>'; } 
		else if((minutes2*60+seconds2)<(minutes1*60+seconds1)) { boardValue = '<h1 style="color: #F24C51;">Player2 wins by time!</h1>'; }
		else	{ boardValue = '<h1 style="color: #F2C8F2;">Zło nie jest w stanie stworzyć niczego nowego, może jedynie zniekształcać i niszczyć to, co zostało wymyślone lub stworzone przez siły dobra - J. R. R. Tolkien</h1>'; } 
		boardValue += '<br/>Done in ' + turnCounter + ' turns! <br/>';
		boardValue += '<br/><br/><br/><span class="option" onclick="start()">RESTART</span>';
		$('.board').html(boardValue);
		clearTimeout(timeVar);
		points1 = points2 = minutes1 = seconds1 = minutes2 = seconds2 = turnCounter = 0;
		timeOff = timeOff1 = timeOff2 = true;
		$("#player1").css("opacity", 1.0);
		$("#player2").css("opacity", 1.0);
		play(3);
	}
	lock = false;
}

function restoreTwoCards(nr1, nr2)		//Pudło
{
	play(1);
	$('#c'+nr1).css('background-image', 'url(img/karta.jpg)');
	$('#c'+nr1).addClass('card');
	$('#c'+nr1).removeClass('cardA');
	
	$('#c'+nr2).css('background-image', 'url(img/karta.jpg)');
	$('#c'+nr2).addClass('card');
	$('#c'+nr2).removeClass('cardA');
	changePlayer();
	visibleNr = 30;
	lock = false;
}

function changePlayer()		//Zmienia Gracza
{
	if(whoNow == 1)
	{
		whoNow = 2;
		$("#player1").css("opacity", 0.3);
		$("#player2").css("opacity", 1.0);
		timeOff1 = true;
		timeOff2 = false;
	}
	else
	{
		whoNow = 1;
		$("#player1").css("opacity", 1.0);
		$("#player2").css("opacity", 0.3);
		timeOff1 = false;
		timeOff2 = true;
	}
}

function timeCounter()		//Zmienia czas (redundancja!)
{
	if(!timeOff1)
	{
		seconds1 = parseInt(seconds1);
		minutes1 = parseInt(minutes1);
		seconds1++;
		
		if(seconds1>=60)
		{
			minutes1++;
			seconds1=0;
		}
		
		if(minutes1<10) minutes1= '0' + minutes1;
		if(seconds1<10) seconds1= '0' + seconds1;
		
		$("#timer1").html("Timer: " + minutes1 + ":" + seconds1);
	}
	else if(!timeOff2)
	{
		seconds2 = parseInt(seconds2);
		minutes2 = parseInt(minutes2);
		seconds2++;
		
		if(seconds2>=60)
		{
			minutes2++;
			seconds2=0;
		}
		
		if(minutes2<10) minutes2= '0' + minutes2;
		if(seconds2<10) seconds2= '0' + seconds2;
		
		$("#timer2").html("Timer: " + minutes2 + ":" + seconds2);
	}
}

function play(nr)		//Odtwarza dźwięki
{
	sound.src = sfx[nr];
	sound.play();
}

function preloadImage(url)
{
    var img = new Image();
    img.src = "img/" + url;
}

