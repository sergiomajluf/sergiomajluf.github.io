$(function() {
      
  $("body").disableSelection();
  
  $( "#draggableCell" ).draggable({ handle: "p", containment: "#containment-wrapper", scroll: false });       
      
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
                  $("#draggableCell").removeClass("answeredQ3");
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

  
  $('.doubleClickArea').click(function(e) {
    var offset = $(this).offset();
    $('#position').text("Note would be created at "+(e.clientX - offset.left) + ", " + (e.clientY - offset.top));
    //open1((e.clientX - offset.left), (e.clientY - offset.top))
  });

  $('#draggableCell').click(function(e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
  });
  
  $('#draggableCell').dblclick(function(e) {
    $('#position').text("Double clicking the cell will open it's modal");
    $('#myModalIdentities').modal('show'); 
	e.stopPropagation();
	e.preventDefault();
	return false;
  });
  
  $('.area_q').click(function(e) {
    $('#position').text("[Click] Can't add a note on top of a question. Try elsewhere on the spiral");
    e.stopPropagation();
	e.preventDefault();
	return false;
  }); 
  
  $('.area_q').dblclick(function(e) {
    $('#position').text("[Double Click] Can't add note over a question");
    e.stopPropagation();
	e.preventDefault();
	return false;
  });  
		  
});
