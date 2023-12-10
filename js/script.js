	// Html elements
	var dicesWrap = $('.dices-wrap');
	var prizes = $('#prizes');
	var rollTheDices = $('#rollthedices');
	var board = $('#board');
	var whatLeft = $('#whatleft');
	var player = $('#player');
	// Varabales
	var numberOfPlayes = '10';
	var boardSize = 50;
	var steps = 0;
	var whatRolled;
	// Offers
	var offer = [];
	offer[5] = 'Get 10$';
	offer[12] = 'Get 10$';
	offer[27] = 'Get 25$';
	offer[31] = 'Free Spin';
	offer[46] = 'Get 500$';
	offer[48] = 'Get 1,000$';
	// Texts
	var win = 'Congratiolations! You won the board, you get extra 1,000$';
	var end = 'Game ended';
	var noMore = 'no more';
	
$(window).load(function(){
	
	// Init number of plays.
	whatLeft.html(numberOfPlayes);

	// Init board.
	for( i=0; i<boardSize ; i++) {
		var dayOffer;
		if(offer[i] != null) {
			dayOffer = '<span>' + offer[i] + '</span>';
			board.append('<li class="price"><p>' + (i+1) + '</p>' + dayOffer + '</li>');
		}
		else {
			board.append('<li><p>' + (i+1) + '</p></li>');
		}
	}
	
	// Init cube.
	$("#dice").dice();
	$("#rollthedices").click(function(){
		$("#dice").dice("roll",[whatRolled]);
	});
	dicesWrap.hide();
	
	// Init draggable.
	player.draggable({ revert: true });
	
});

$("a").vibrate();

// Deposite function - get deposite amount and set additional rolls.
function deposit(value) {
	var temp;
	var youGet = 0;
	if(whatLeft.html() != noMore) {
		temp = parseInt(whatLeft.html(), 10);
	}
	else {
		temp = 0;
	}	
	switch (value) {
		case 100:
			youGet = 2;
			break;
		case 200:
			youGet = 5;
			break;
		case 300:
			youGet = 8;
			break;
	}
	// Return the button, update rolls amount and print info.
	prizes.append('<li class="deposit">You deposite: ' + value+ '$ - You got: ' + youGet + '</li>');
	rollTheDices.css('pointer-events', 'all').animate({opacity:1}, 400 );
	temp += youGet;
	whatLeft.html(String(temp));
};

function rollDices() {
	// Runs only if there are more roll dices and not pass the board size.
	if(whatLeft.html() > 0 && steps < boardSize) {
		
		// Roll dice.
		whatRolled = Math.floor((Math.random() * 6) + 1);
		// Reduce play time.
		whatLeft.html(whatLeft.html()-1);
		// Update board of last step.
		board.find('li:nth-child(' + steps + ')').find('p')
			.addClass('overBlock')
			.removeClass('onBlock');
		
		// Animation for the dice.
		rollTheDices.css('pointer-events', 'none').animate({opacity:0}, 400 );
		dicesWrap.stop().fadeIn(1);
		setTimeout( function() {
			dicesWrap.fadeOut(3000);
			
			// Calculate new location.
			steps += whatRolled;
			
			// check if location is pass the board size or not. (Game Over)
			if(steps >= boardSize) {
				console.log(win);
				rollTheDices.addClass('inactive');
				prizes.append('<li>' + win + '</li>');
				board.addClass('win');
				$('.bottom.right').fadeOut();
				player.fadeOut();
			}
			else {
				// Update block of new step.
				var current = board.find('li:nth-child(' + steps + ')');
				player.css({
					left: current.position().left,
					top: current.position().top
					});
				setTimeout( function() {
					current.addClass('gotBlock').find('p')
						.addClass('onBlock')
						.removeClass('overBlock');
						
					// Print the prizes.
					if(offer[steps-1] != null) {
						console.log(offer[steps-1]);
						prizes.append('<li>' + offer[steps-1] + '</li>');
					}
					
					// If it's the last roll inactive the button.
					if(whatLeft.html() == 0) {
						whatLeft.html(noMore);
						prizes.append('<li class="last-roll">' + end + '</li>');
					}
					else {
						rollTheDices.css('pointer-events', 'all').animate({opacity:1}, 400 );
					}
				}, 800);
			}
		}, 2000);
	}
};