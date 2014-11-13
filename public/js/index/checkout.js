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
      if (data.success == "ok") {
        window.location.replace("/paysuccess");  
      }
    },
    error: function(error){
      alert("Error! Please try again!");
    }
  });
}

$(document).ready(function() {
  $('#cancel').click(function() {
    window.location.replace("/result");  
  });
  $('#payNow').click(function() {
    var singleMap = {};
    var returnMap = {};
    var flag = false;
    $('#data-entry tr').each(function() {
      var singleSeat = $(this).find(".single-seat").val();
      var returnSeat = $(this).find(".return-seat").val();
      // if some seat is already selected. Error
      if (singleMap[singleSeat] || returnMap[returnSeat]) {
        alert("Please don't select repeated seat!");
        flag = true;
        return false;
      }
      // fill in the dictionary
      singleMap[singleSeat] = singleSeat;
      returnMap[returnSeat] = returnSeat;

      var name = $(this).find(".bookName").val().trim();
      var passport = $(this).find(".bookPassport").val().trim();
      var email = $(this).find(".bookEmail").val().trim();
      var contact = $(this).find(".bookContact").val().trim();
      // should also check error here
      if (!name || !passport || !email || !contact) {
        alert("Please enter valid information!");
        flag = true;
        return false;
      }
    });
    if (!flag) {
      collectPassenger();
    }
  });
});