//card data from JSON file & load board
var cardData; 
$.getJSON('data/cardObject.json', function(data) {
	cardData = data;
}).done(function(){
	loadOnBoardArray(12);
	loadBoard(12);
	//some "loading" image
}); //buh

//clickable items
var xColButton = $('#xColButton');
var padL1 = $('.padL1'); //1 column on left
var padL2 = $('.padL2'); //1 column on left
var padR1 = $('.padR1'); //2 column on right
var padR2 = $('.padR2'); //1 column on right

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


//initializing party
var xCol = false;
padR2.hide();
pos04.hide();
pos14.hide();
pos24.hide();

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
var scores = [0,0,0,0];

//Accepts desired status.  Returns a random object from cardData with that status.
var getCardObj = function(cardStatus){
	randNum = Math.floor(Math.random()*cardData.length);
	var cardObj = cardData[randNum];
	if(cardObj.playStatus===cardStatus){
		cardObj.playStatus="onBoard";
		return cardData[randNum];
	} else {
		return getCardObj(cardStatus);
	}
};

var updateScoreBoard = function(){
	p1Score.text(scores[1]);
	p2Score.text(scores[2]);
	p3Score.text(scores[3]);
}

//boardSize should be 12 or 15, dude
var loadOnBoardArray = function(boardSize){
	var emptyIndex = [];
	console.log(onBoardArray); console.log(emptyIndex);
	for(var i = 0;i<12;i++){
		if(onBoardArray[i]==="empty"){
			emptyIndex.push(i);
		}		
	}	console.log(onBoardArray); console.log(emptyIndex);
	for(var i = 12;i<15;i++){
		if(onBoardArray[i]!=="empty"){
			onBoardArray[emptyIndex[emptyIndex.length-1]]=onBoardArray[i];
			onBoardArray[i]="empty;"
			emptyIndex.pop();
		}			
	}   console.log(onBoardArray); console.log(emptyIndex);
	for(var i = 0;i<boardSize;i++){	
		if(onBoardArray[i]==="empty"){
			onBoardArray[i] = getCardObj("inDeck");
		}
	}	console.log(onBoardArray); console.log(emptyIndex);
}; 


//board size should be 12 or 15, dude
var loadBoard = function(boardSize){
	for(var i = 0;i<boardSize;i++){
		if(onBoardArray[i]==="empty"){
			boardElem[i].children('img').attr('src', "");
		}
		boardElem[i].children('img').attr('src', "img/" + onBoardArray[i].imageURL);
	} //maybe add ignore error when it doesn't find the last 3
	updateScoreBoard();
};

var showHideCols = function(){
	if(xCol){
		padL2.hide();
		padR1.hide();
		padR2.show();
		pos04.show();
		pos14.show();
		pos24.show();
	} else {
		padL2.show();
		padR1.show();
		padR2.hide();
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
		playerSelection[4][quality] = "all the same";
		return true;
	} else if(playerSelection[1][quality]!==playerSelection[2][quality] 
		&& playerSelection[1][quality]!==playerSelection[3][quality]
		&& playerSelection[2][quality]!==playerSelection[3][quality]){
		playerSelection[4][quality] = "all different";
		return true;
	} else {
		playerSelection[4][quality] = "not a set";
		return false;
	}
}; 

var moveSet = function(){
	for(var i = 1; i<4; i++){
		for(var j = 0;j<cardData.length;j++){
			if(cardData[j].imageURL===playerSelection[i].imageURL){
				cardData[j].playStatus="inSet";
			}
		}
	} //changes status in cardData
	for(var i = 1; i<4; i++){
		for(var j = 0;j<onBoardArray.length;j++){
			if(onBoardArray[j].imageURL===playerSelection[i].imageURL){
				onBoardArray[j]="empty";
			}
		}
	} //removes cards from onBoardArray
};

var checkForSet = function(){
	var checkColor = checkQuality("color");
	var checkShading = checkQuality("shading");
	var checkShape = checkQuality("shape");
	var checkNumber = checkQuality("number");
	console.log(playerSelection);
	if(checkColor && checkShape && checkShading && checkNumber){	
		console.log("it's a set!")
		moveSet();
		return true;
	} else{
		console.log("you're a failure!")
		return false;	
	}
};

var getClick = function(clickIndex){
	playerSelection[0]=currentPlayer; //current player is first index of array
	var selection = onBoardArray[clickIndex];
	for(var i = 1; i<4; i++){
		if(playerSelection[i]===selection){
			return false;
		}
	}
	playerSelection[playerSelectionIndex]=selection;
	boardElem[clickIndex].css('background-color',"green");
	playerSelectionIndex++;
	if(playerSelectionIndex>3){
		if(checkForSet()){
			scores[currentPlayer]++;
			loadOnBoardArray(12);
			loadBoard(15);
			updateScoreBoard();
		}
		resetPlayerSelection();
		if(xCol){
			xColToggle();
			$(xColButton).show();
		}
	}
}

//click events turn on when players claim board
$(document).keypress(function (e) {
	var key = e.which;
	if(key === 113){ //q
		currentPlayer=1;
	}
	if(key === 98){ //b
		currentPlayer=2;
	}
	if(key === 112){ //p
		currentPlayer=3;
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
	$(xColButton).hide();
	loadOnBoardArray(15);
	loadBoard(15);
});




