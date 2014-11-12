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

function collectPassenger() {
  var passengers = new Array();
  $('#data-entry tr').each(function() {
    var name = $(this).find(".bookName").val();
    var passport = $(this).find(".bookPassport").val();
    var email = $(this).find(".bookEmail").val();
    var contact = $(this).find(".bookContact").val();
    var singleSeat = $(this).find(".single-seat").val();
    var returnSeat = $(this).find(".return-seat").val();

    var passenger = {
      "name": name,
      "passport": passport,
      "email": email,
      "contact": contact,
      "singleSeat": singleSeat,
      "returnSeat": returnSeat
    }
    passengers.push(passenger);
  });
  var data = JSON.stringify(passengers);
  var passengers = JSON.stringify({passengers:data});
  $.ajax({
    type: "POST",
    url: "/checkout",
    dataType: 'JSON',
    contentType: 'application/json',
    data: passengers,
    success: function(data){
      console.log(data);
      window.location.replace("/paysuccess");
    }
  });
}


$(document).ready(function() {
  $('#payNow').click(function(){
    collectPassenger();
    // window.location.replace("/paysuccess");
  });
});