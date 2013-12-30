// Runs when the DOM has been loaded
$(document).ready(function() {
	// Check if map exists
	if($('#map')) {
		// Loop through each AREA in the imagemap
		$('#map area').each(function() {
	
			// Assigning an action to the mouseover event
			$(this).mouseover(function(e) {
				var country_id = $(this).attr('id').replace('area_', '');
				$('#'+country_id).fadeIn('medium');
			});
			
			// Assigning an action to the mouseout event
			$(this).mouseout(function(e) {
				var country_id = $(this).attr('id').replace('area_', '');
				$('#'+country_id).hide();
			});
			
			// Assigning an action to the click event
			$(this).click(function(e) {
				e.preventDefault();
				var country_id = $(this).attr('id').replace('area_', '');
				alert('You clicked ' + country_id);
			});
		
		});
	}
});