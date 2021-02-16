var canVibrate = "vibrate" in navigator || "mozVibrate" in navigator;

if (canVibrate && !("vibrate" in navigator))
    navigator.vibrate = navigator.mozVibrate;
 
 
$('button').on('click', logEntry);

$(function() { //shorthand document.ready function
    $('#eventF').on('submit', function(e) {
		e.preventDefault();  //prevent form from submitting
		navigator.vibrate(100);
        
		
		if ($('#eventH').val() === '')
		{
			alert('Please fill in the event name');
			return false;
		}
		var errorCount = 0;
		  $('.needed').each(function(index, val) {
			if($(this).val() === '') { errorCount++; }
		  });
		if (errorCount > 0)
		{
			alert('Please fill in username and session number');
			return false;
		}
		
        //var data = $("#event :input").serializeArray();
		var newHit = {
			'username': $('#username').val(),
			'session': $('#session').val(),
			'event': $('#eventH').val()
		}
        //console.log(data); //use the console for debugging, F12 in Chrome, not alerts
		$('#eventH').val('');
		$.ajax({
      type: 'POST',
      data: newHit,
      url: '/event',
      dataType: 'JSON'
		}).done(function( response ) {

		  // Check for successful (blank) response
		  if (response.msg === '') {
			
		  }
		  else {

			// If something goes wrong, alert the error message that our service returned
			alert('Error: ' + response.msg);

		  }
		});
    });
});
  
function logEntry(event) {
  navigator.vibrate(100);
  event.preventDefault();
  var happiness = event.target.attributes.value.value;

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('.needed').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all user info into one object
    var newEntry = {
      'username': $('#username').val(),
      'session': $('#session').val(),
      'mood': happiness
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newEntry,
      url: '/',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {
		console.log('success')
      }
      else {

        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);

      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in username and session number');
    return false;
  }
};