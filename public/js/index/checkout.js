function populateSeats() {
	$.getJSON("/api/booking/"+ booking, function(data) {
    var booking = data[0];

    $.getJSON("/api/seats/"+booking.flight_no + "/" + convertFlightTime(new Date(booking.flight_time)), function(data) {
      $(".select-seat").html('');
      for(var i in data){
        var seat = data[i];
        var sid = seat.sid,
        seat_class = seat.seat_class;
        console.log(seat);
        $(".select-seat").append('<option' + ' value="' + sid + '">' + sid  +'</option>');
      }
    });
  });
}

$(document).ready(function() {
  $('#payNow').click(function(){
    // send data, create booking

    //redirect
    window.location.replace("/paysuccess");
  });
});