function equalHeightTeaser12(){

    // Initialize variables
    var $items = $('#equalHeightRow .items .item');
	var containerWidth = $('#equalHeightRow .items').width();
	var itemsWidth = $items.first().outerWidth();
	var itemsPerRow = Math.round(containerWidth / itemsWidth);

	var heighest = 0;
	var counter = 0;
	var row = 0;
	var itemAmount  = $items.length;
	var itemCounter = 0;

	// Reset height from items
	$items.css({'height' : 'auto'});

	$items.each(function(){

		// get height & width from current item
		var thisHeight = $(this).height();
		var thisWidth = $(this).outerWidth();

		// Set current heighest item
		heighest = (thisHeight > heighest) ? thisHeight : heighest;

		// Add counter
		counter++;
		itemCounter++;

		// Reset counter after row & reset heighest item
		if(counter >= itemsPerRow || itemCounter >= itemAmount){

			// Set item range (items in current row)
			var fromItem = Math.round((row * itemsPerRow) + 1);
			var toItem = Math.round((row * itemsPerRow) + itemsPerRow);

            /*
			console.log('-----');
			console.log('row: ' + row);
			console.log('itemsPerRow: ' + itemsPerRow);
			console.log('counter: ' + counter);
			console.log('fromItem: ' + fromItem);
			console.log('toItem: ' + toItem);
			console.log('heighest: ' + heighest);
            */

			// Set height items per row
			$('#equalHeightRow .items .item:nth-child(n+'+ fromItem +'):nth-child(-n+'+ toItem +')').css({'height' : heighest + 'px'});

			// Reset variables
			counter = 0;
			heighest = 0;
			row++;
		}
	});
}

$(document).ready(function(){
	equalHeightTeaser12();

	$(window).on('resize', function(){
		equalHeightTeaser12();
	});
});
