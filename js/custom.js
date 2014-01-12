var debugging = false;

$(function() {

  $('#draggableCell').hide();
  $('#answerPlanets li').hide();
    
  // Disable selection to prevent visual quirk
  $('body').disableSelection();
  
  // Create Identity
  $('#add_identity > a').click(function(){
	  //$('#draggableCell').removeClass("hidden");
	  $('#position').text("Drag your identity's cell to explore the questions. Double click elsewhere to add a note.");
	  $(this).fadeOut('slow');  
	  $('#draggableCell').fadeIn('slow');
  });
  
  
    // Make the initial cell draggable
  $( '#draggableCell' ).draggable({ handle: "p", containment: "#containment-wrapper", scroll: false });       
      
  // Add Notes
  var noteIndex = 0;
  function addNote(notex, notey, notei){
	var newNoteY = parseInt(notey)+ getScrollY();
	$("#user_notes").append('<div class="userNote draggable" id="note'+noteIndex + '" data-id="note'+noteIndex + '" style="top:'+newNoteY+'px;left:'+notex+'px;"><a type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-comment"></span> ' + noteIndex + '</a></div>');
	}

  // Get window scroll - Modded from http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
  function getScrollY() {
	  var scrOfY = 0;
	  if( typeof( window.pageYOffset ) == 'number' ) {
	    //Netscape compliant
	    scrOfY = window.pageYOffset;
	  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
	    //DOM compliant
	    scrOfY = document.body.scrollTop;
	  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
	    //IE6 standards compliant mode
	    scrOfY = document.documentElement.scrollTop;
	  }
	  return scrOfY;
	}
 


  // Sequentially activate the Questions as drop zones
  $( "#area_q1" ).droppable({
    accept: "#draggableCell",
    activeClass: "ui-state-hover",
    hoverClass: "ui-state-active",
    drop: function( event, ui ) {
      $(this).addClass( "answered" );
      $("#draggableCell").addClass("answeredQ1");
      //console.log("Answered Q1");
      $('#myModalQuestion01').modal('show');

      $( "#area_q2" ).droppable({
        accept: "#draggableCell",
        activeClass: "ui-state-hover",
        hoverClass: "ui-state-active",
        drop: function( event, ui ) {
          $(this).addClass( "answered" );
          //$("#draggableCell").removeClass("answeredQ1").
          $("#draggableCell").addClass("answeredQ2");
          console.log("Answered Q2");
          $('#myModalQuestion02').modal('show');  
      
          $( "#area_q3" ).droppable({
            accept: "#draggableCell",
            activeClass: "ui-state-hover",
            hoverClass: "ui-state-active",
            drop: function( event, ui ) {
              $(this).addClass( "answered" );
              //$("#draggableCell").removeClass("answeredQ2").
              $("#draggableCell").addClass("answeredQ3");
              console.log("Answered Q3");
              $('#myModalQuestion03').modal('show');  
        
              $( "#area_q4" ).droppable({
                accept: "#draggableCell",
                activeClass: "ui-state-hover",
                hoverClass: "ui-state-active",
                drop: function( event, ui ) {
                  $(this).addClass( "answered" );
                  $("#draggableCell").addClass("answeredQ4");
                  console.log("Answered Q4");
                  $('#myModalQuestion04').modal('show');
                }
              });
            }
          });
        }
      });
    }
  });
  
  // Fade in Planets on modal close
  $('#myModalQuestion01').on('hidden.bs.modal', function () {
	  $('li.answer1').fadeIn('slow'); 
  })
  $('#myModalQuestion02').on('hidden.bs.modal', function () {
	  $('li.answer2').fadeIn('slow');  
  })
  $('#myModalQuestion03').on('hidden.bs.modal', function () {
	  $('li.answer3').fadeIn('slow');  
  })
  $('#myModalQuestion04').on('hidden.bs.modal', function () {
	  $('li.answer4').fadeIn('slow');  
  })  
  
  // Open question modals from planets
  $('li.answer1').click(function(){
	  $('#myModalQuestion01').modal('show'); 
  });  
  $('li.answer2').click(function(){
	  $('#myModalQuestion02').modal('show'); 
  });  
  $('li.answer3').click(function(){
	  $('#myModalQuestion03').modal('show'); 
  });  
  $('li.answer4').click(function(){
	  $('#myModalQuestion04').modal('show'); 
  });  

  // Open question modals from planets
  $('div.userNote button').click(function(){
	  var noteID = $(this).data('id');
	  console.log(noteID);
	  alert("hi");
	  //$('#myModalQuestion04').modal('show'); 
  });
  $('div.userNote > a').click(function(){
	  alert("hi");
	  //$('#myModalQuestion01').modal('show'); 
  }); 
  
  // Tooltips and User Preferences
  $('#userPreferences').tooltip({
    	'show': true,
        'placement': 'auto',
        delay: { show: 1000, hide: 500 }
   }); 
  $('#userPreferences').click(function(e) {
    $('#myModalIdentities').modal('show'); 
	return false;
  });
  $('#cell').tooltip({
    	'show': true,
        'placement': 'auto',
        delay: { show: 1000, hide: 50 }
   });
  
  // Add notes and listen for double clicks
  $('.doubleClickArea').dblclick(function(e) {
    var offset = $(this).offset();
    addNote((e.clientX - offset.left)-20, (e.clientY - offset.top - $(this).scrollTop())-20, noteIndex);    
    $('#myModalNote'+noteIndex).modal('show');
	noteIndex++;
  });
  
  // Not using this right now.
  // It's a listener to delay/debounce creation of notes
  /*
   $('.doubleClickAreas').dblclick(noteHandler);
	function noteHandler(e){
		e.preventDefault();
		var offset = $(this).offset();
		addNote((e.clientX - offset.left)-20, (e.clientY - offset.top - $(this).scrollTop())-20, noteIndex);    
		$(this).unbind('click');
		setTimeout(function(){$('.doubleClickArea').dblclick(noteHandler);}, 1000);
		$('#myModalNote'+noteIndex).modal('show');
		noteIndex++;
	}
  */

 
  // If clicking on the cell, prevent adding a note
  $('#draggableCell').click(function(e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
  });
  
  // Double clicking on the cell opens the identities modal
  $('#draggableCell').dblclick(function(e) {
    $('#position').text("Double clicking the cell will open it's modal");
    $('#myModalIdentities').modal('show'); 
	e.stopPropagation();
	e.preventDefault();
	return false;
  });
  
  // Prevent adding notes over the questions
  $('.area_q').click(function(e) {
    $('#position').text("[Click]Can't add a note on top of a question. Try elsewhere on the spiral");
    e.stopPropagation();
	e.preventDefault();
	return false;
  }); 
  $('.area_q').dblclick(function(e) {
    $('#position').text("[Double Click]Can't add a note on top of a question. Try elsewhere on the spiral");
    e.stopPropagation();
	e.preventDefault();
	return false;
  });  
	
	  // Debugging - Print x, y and scroll
  if (debugging){
  $( "#spiral" ).mousemove(function( event ) {
	var that = $("#containment-wrapper");
	var spiralMargin = (that.outerHeight(true) - that.innerHeight());
	var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
	var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
	$( "#positionw" ).text( "( event.pageX, event.pageY ) : " + pageCoords );
	$( "#position" ).text( "( event.clientX, event.clientY ) : " + clientCoords + " scroll " + getScrollY() );
  });
  }
  	  
});
