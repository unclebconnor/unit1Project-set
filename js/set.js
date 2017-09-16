//card data from JSON file & load board
var cardData; 
var deck = [];

$.getJSON('data/cardObject.json', function(data) {
	cardData = data;
}).done(function(){
	shuffleDeck();
	loadOnBoardArray(12);
	loadBoard(12);
}); 

//clickable items
var dirButton = $('#dirButton');
var xColButton = $('#xColButton');

var pos00 = $('#pos00');
var pos01 = $('#pos01');
var pos02 = $('#pos02');
var pos03 = $('#pos03');
var pos10 = $('#pos10');
var pos11 = $('#pos11');
var pos12 = $('#pos12');
var pos13 = $('#pos13');
var pos20 = $('#pos20');
var pos21 = $('#pos21');
var pos22 = $('#pos22');
var pos23 = $('#pos23');
var pos04 = $('#pos04'); //extra cards
var pos14 = $('#pos14'); //extra cards
var pos24 = $('#pos24'); //extra cards

var p1Score = $('#p1Score');
var p2Score = $('#p2Score');
var p3Score = $('#p3Score');
var deckSize = $('#deckSize');

//modal & directions
var psImg1 = $('#psImg1');
var psImg2 = $('#psImg2');
var psImg3 = $('#psImg3');
var psColor1 = $('#psColor1');
var psColor2 = $('#psColor2');
var psColor3 = $('#psColor3');
var psNumber1 = $('#psNumber1');
var psNumber2 = $('#psNumber2');
var psNumber3 = $('#psNumber3');
var psShading1 = $('#psShading1');
var psShading2 = $('#psShading2');
var psShading3 = $('#psShading3');
var psShape1 = $('#psShape1');
var psShape2 = $('#psShape2');
var psShape3 = $('#psShape3');
var psResult1 = $('#psResult1');
var psResult2 = $('#psResult2');
var psResult3 = $('#psResult3');
var psResult4 = $('#psResult4');
var modalWrapper = $('#modalWrapper');
var directionsWrapper = $('#directionsWrapper');



//initializing party
var xCol = false;
pos04.hide();
pos14.hide();
pos24.hide();
modalWrapper.hide();
directionsWrapper.hide();

var boardElem = [pos00,pos01,pos02,pos03,
pos10,pos11,pos12,pos13,pos20,pos21,
pos22,pos23,pos04,pos14,pos24]; //last 3 are extra

var onBoardArray = ["empty","empty","empty",
"empty","empty","empty","empty","empty","empty",
"empty","empty","empty","empty","empty","empty"]; //last 3 are extra

var currentPlayer = 0; //0 when open, 1, 2, or 3 when chosen
var playerSelectionIndex = 1; //incremented as choices are made.  0 reserved for current player
var playerSelection = [0,0,0,0,{imageURL: "", color: "", 
	shape: "", shading: "", number: "", playStatus: ""}]; //will be loaded as player number, choices 1, 2, and 3
var p1Sets = [];
var p2Sets = [];
var p3Sets = [];
var p1WrongAns = 0;
var p2WrongAns = 0;
var p3WrongAns = 0;
var p1ScoreNum = 0;
var p2ScoreNum = 0;
var p3ScoreNum = 0;

//functions yo
var shuffleDeck = function(){
	deck = cardData;
	for(var i = 0; i<deck.length;i++){
		var rando = Math.floor(Math.random()*deck.length);
		var temp = deck[rando];
		deck[rando] = deck[i];
		deck[i] = temp;
	}
};

var updateScoreBoard = function(){
	p1ScoreNum = p1Sets.length-p1WrongAns;
	p2ScoreNum = p2Sets.length-p2WrongAns;
	p3ScoreNum = p3Sets.length-p3WrongAns;
	p1Score.text(p1ScoreNum);
	p2Score.text(p2ScoreNum);
	p3Score.text(p3ScoreNum);
	deckSize.text(deck.length);
}

var onBoardArrayCount = function(){
	var howManyLetsCount=0;
	for(var i = 0; i<15; i++){
		if(onBoardArray[i]==="empty"){
			howManyLetsCount++;
		}
	}
	var difference = 15-howManyLetsCount;
	return difference;
}

//boardSize should be 12 or 15, dude
var loadOnBoardArray = function(boardSize){
	for(var i = 0;i<boardSize;i++){	
		if(onBoardArray[i]==="empty"){
			if(deck.length>0){
				onBoardArray[i] = deck.pop();
			} 
		}
	} 
}; 

//board size should be 12 or 15, dude
var loadBoard = function(boardSize){
	for(var i = 0;i<boardSize;i++){
		if(onBoardArray[i]==="empty"){
			boardElem[i].children('img').attr('src', "img/emptyImage.png");
		} else{
		boardElem[i].children('img').attr('src', "img/" + onBoardArray[i].imageURL);
		}
	} //maybe add ignore error when it doesn't find the last 3
	updateScoreBoard();
};

var showHideCols = function(){
	if(xCol){
		pos04.show();
		pos14.show();
		pos24.show();
	} else {
		pos04.hide();
		pos14.hide();
		pos24.hide();
	}
};

var xColToggle = function(){
	if (xCol){
		xCol=false;
	} else {
		xCol=true;
	}
	showHideCols();
};

var resetPlayerSelection = function(){
	currentPlayer = 0; 
	playerSelectionIndex = 1; 
	playerSelection = [0,0,0,0,{imageURL: "", color: "", 
	shape: "", shading: "", number: "", playStatus: ""}]; 
	for(var i=0; i<boardElem.length;i++){
		boardElem[i].css('background-color',"");
	}
	//remove highlight from player choice
	p1Score.css('background-color',"#33495f");
	p2Score.css('background-color',"#33495f");
	p3Score.css('background-color',"#33495f");
	//remove event listeners after play
	$(pos00).prop('onclick',null).off('click');
	$(pos01).prop('onclick',null).off('click');
	$(pos02).prop('onclick',null).off('click');
	$(pos03).prop('onclick',null).off('click');
	$(pos10).prop('onclick',null).off('click');
	$(pos11).prop('onclick',null).off('click');
	$(pos12).prop('onclick',null).off('click');
	$(pos13).prop('onclick',null).off('click');
	$(pos20).prop('onclick',null).off('click');
	$(pos21).prop('onclick',null).off('click');
	$(pos22).prop('onclick',null).off('click');
	$(pos23).prop('onclick',null).off('click');
	$(pos04).prop('onclick',null).off('click');
	$(pos14).prop('onclick',null).off('click');
	$(pos24).prop('onclick',null).off('click');
}

var checkQuality = function(quality){
	if(playerSelection[1][quality]===playerSelection[2][quality] 
		&& playerSelection[1][quality]===playerSelection[3][quality]){
		playerSelection[4][quality] = "All the Same";
		return true;
	} else if(playerSelection[1][quality]!==playerSelection[2][quality] 
		&& playerSelection[1][quality]!==playerSelection[3][quality]
		&& playerSelection[2][quality]!==playerSelection[3][quality]){
		playerSelection[4][quality] = "All Different";
		return true;
	} else {
		playerSelection[4][quality] = "Not a SET";
		return false;
	}
}; 

//moves set from onBoardArray to p#Sets
var moveSet = function(playerSets){
	playerSets.push(playerSelection);
	for(var i = 1; i<4; i++){
		for(var j = 0;j<onBoardArray.length;j++){
			if(onBoardArray[j].imageURL===playerSelection[i].imageURL){
				onBoardArray[j]="empty";
			}
		}
	} 
	for(var i = 12; i<15;i++){
		for(var j = 0;j<12;j++){
			if(onBoardArray[j]==="empty"){
				onBoardArray[j]=onBoardArray[i];
				onBoardArray[i]="empty";
			}
		}		
	}
};

var checkSetMessage = function(playerNum,isSet){
  	modalWrapper.show();
  	var message;
  	if(isSet){
  		message = "Player " + playerNum + " got a SET!!!"
  	} else {
  		message = "Player " + playerNum + "'s cards do not make a SET"
  	}
  	psImg1.children('img').attr('src', "img/" + playerSelection[1].imageURL);
	psImg2.children('img').attr('src', "img/" + playerSelection[2].imageURL);
	psImg3.children('img').attr('src', "img/" + playerSelection[3].imageURL);
	psColor1.text(playerSelection[1].color);
	psColor2.text(playerSelection[2].color);
	psColor3.text(playerSelection[3].color);
	psNumber1.text(playerSelection[1].number);
	psNumber2.text(playerSelection[2].number);
	psNumber3.text(playerSelection[3].number);
	psShading1.text(playerSelection[1].shading);
	psShading2.text(playerSelection[2].shading);
	psShading3.text(playerSelection[3].shading);
	psShape1.text(playerSelection[1].shape);
	psShape2.text(playerSelection[2].shape);
	psShape3.text(playerSelection[3].shape);
	psResult1.text(playerSelection[4].color);
	psResult2.text(playerSelection[4].number);
	psResult3.text(playerSelection[4].shading);
	psResult4.text(playerSelection[4].shape);
	if(playerSelection[4].color==='Not a SET'){
		psResult1.css('background-color', 'rgba(169,53,54,0.2)');
	} else {
		psResult1.css('background-color', 'rgba(124,156,113,0.2)');
	}
	if(playerSelection[4].number==='Not a SET'){
		psResult2.css('background-color', 'rgba(169,53,54,0.2)');
	} else {
		psResult2.css('background-color', 'rgba(124,156,113,0.2)');
	}
	if(playerSelection[4].shading==='Not a SET'){
		psResult3.css('background-color', 'rgba(169,53,54,0.2)');
	} else {
		psResult3.css('background-color', 'rgba(124,156,113,0.2)');
	}
	if(playerSelection[4].shape==='Not a SET'){
		psResult4.css('background-color', 'rgba(169,53,54,0.2)');
	} else {
		psResult4.css('background-color', 'rgba(124,156,113,0.2)');
	}


  	$( "#checkSetMessage" ).dialog({
    	modal: true,
    	buttons: {
      		Ok: function() {
       			$( this ).dialog( "close" );
       			modalWrapper.hide();
      		}
    	},
    	width: 650,
    	title: message
  	}); //jquery ui

}

var showDirections = function(){
  	directionsWrapper.show();
  	$( "#directions" ).dialog({
    	modal: true,
    	buttons: {
      		Ok: function() {
       			$( this ).dialog( "close" );
       			directionsWrapper.hide();
      		}
    	},
    	width: 800,
    	height: 700,

 
  	});
  	directionsWrapper.scrollTop(0);
}

var checkForSet = function(){
	var checkColor = checkQuality("color");
	var checkShading = checkQuality("shading");
	var checkShape = checkQuality("shape");
	var checkNumber = checkQuality("number");
	if(checkColor && checkShape && checkShading && checkNumber){	

		if(currentPlayer===1){
			moveSet(p1Sets);
		} else if(currentPlayer===2){
			moveSet(p2Sets);
		} else if(currentPlayer===3){
			moveSet(p3Sets);
		}
		checkSetMessage(currentPlayer, true);
		return true;
	} else{
		if(currentPlayer===1){
			p1WrongAns++;
		} else if(currentPlayer===2){
			p2WrongAns++;
		} else if(currentPlayer===3){
			p3WrongAns++;
		}		
		checkSetMessage(currentPlayer, false);
		return false;	
	}
};

var getClick = function(clickIndex){
	//store selection in one array and data about it 
	//in another dummy.  unchecking removes from one 
	//array and not another.  when that one has 3, you're good
	//then merge the 2 arrays into one for storage
	playerSelection[0]=currentPlayer; //current player is first index of array
	var selection = onBoardArray[clickIndex];
	for(var i = 1; i<4; i++){
		if(playerSelection[i]===selection){
			return false;
		}
	}
	playerSelection[playerSelectionIndex]=selection;
	boardElem[clickIndex].css('background-color',"#ccb361");
	playerSelectionIndex++;
	if(playerSelectionIndex>3){
		if(checkForSet()){
			loadOnBoardArray(12);
			loadBoard(12);	
		if(xCol){
			xColToggle();
			if(deck.length>0){
				$(xColButton).css('visibility', 'visible');
			}	
		}
		}
		updateScoreBoard();
		resetPlayerSelection();

	}
}

//click events turn on when players claim board
$(document).keydown(function (e) {
	var key = e.which;
	if(key === 81 && currentPlayer===0){ //q
		currentPlayer=1;
		p1Score.css('background-color',"#ccb361");
	}
	if(key === 66 && currentPlayer===0){ //b
		currentPlayer=2;
		p2Score.css('background-color',"#ccb361");
	}
	if(key === 80 && currentPlayer===0){ //p
		currentPlayer=3;
		p3Score.css('background-color',"#ccb361");
	}
	if(currentPlayer!==0){
		pos00.click(function(){getClick(0);});
		pos01.click(function(){getClick(1);});
		pos02.click(function(){getClick(2);});
		pos03.click(function(){getClick(3);});
		pos10.click(function(){getClick(4);});
		pos11.click(function(){getClick(5);});
		pos12.click(function(){getClick(6);});
		pos13.click(function(){getClick(7);});
		pos20.click(function(){getClick(8);});
		pos21.click(function(){getClick(9);});
		pos22.click(function(){getClick(10);});
		pos23.click(function(){getClick(11);});
		pos04.click(function(){getClick(12);});
		pos14.click(function(){getClick(13);});
		pos24.click(function(){getClick(14);});
	}
});


//extra column toggle
xColButton.click(function(){
	xColToggle();
	$(xColButton).css('visibility', 'hidden');
	loadOnBoardArray(15);
	loadBoard(15);
});

//shows directions yo
dirButton.click(function(){
	showDirections();
});

//esc cancels a player's turn
$(document).keydown(function (e) {
	var key = e.which;
	if(key === 27){ //q
		resetPlayerSelection();
	}
});

var simpleMode = function(){
	$.getJSON('data/cardObject_justGreen.json', function(data) {
	cardData = data;
}).done(function(){
	shuffleDeck();
	onBoardArray = ["empty","empty","empty",
	"empty","empty","empty","empty","empty","empty",
	"empty","empty","empty","empty","empty","empty"];
	loadOnBoardArray(12);
	loadBoard(12);
	if(xCol){
		xColToggle();	
		}
}); 
}

var simpleButton = $('#simpleButton');
simpleButton.click(function(){
	simpleMode();
});

