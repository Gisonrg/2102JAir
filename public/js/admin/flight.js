function populateEditForm(flight) {
  $('#edit-fno').val(flight);
  $.getJSON("/api/flights/"+flight, function(data) {
    var flight = data[0];
    $('#edit-depart').val(flight.depart_time.substring(0, 5));
    $('#edit-arrive').val(flight.arrive_time.substring(0, 5));
    $('#edit-from').val(flight.origin);
    $('#edit-to').val(flight.destination);
    $('#edit-plane').val(flight.plane_id);
  });

  $('#edit-cancel').click(function(){
    $('#editForm').foundation('reveal', 'close');
  });

  $('#edit-submit').click(function(){
    var depart_time = $('#edit-depart').val();
    var arrive_time = $('#edit-arrive').val();
    var origin = $('#edit-from').val();
    var destination = $('#edit-to').val();
    var plane_id = $('#edit-plane').val();

    var updatedFlight = {
      depart_time : depart_time,
      arrive_time : arrive_time,
      origin      : origin,
      destination : destination,
      plane_id   : plane_id
    }
    $.ajax({
        type: 'PUT',
        url: '/api/flights/' + flight,
        data: updatedFlight,
        dataType: 'JSON',
      }).done(function(response) {
                  console.log(response);
        // Check for successful (blank) response
        if (response.status === 'ok') {
          $('#deleteForm').foundation('reveal', 'close');
          window.location = "/admin/flight";
        } else {
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.error);
        }
    });
  });

  $('#editForm').foundation('reveal', 'open');
}

function populateDeleteForm(fno) {
  $('#delete-fno').html(fno);

  $('#delete-submit').click(function(){
    $.ajax({
        type: 'DELETE',
        url: '/api/flights/' + fno,
      }).done(function(response) {
        // Check for successful (blank) response
        if (response.status === 'ok') {
          $('#deleteForm').foundation('reveal', 'close');
          window.location = "/admin/flight";
        } else {
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.error);
        }
      });
  });

  $('#delete-cancel').click(function(){
    $('#deleteForm').foundation('reveal', 'close');
  });

  $('#deleteForm').foundation('reveal', 'open');
}


$(document).ready(function() {
  $('#flight-depart').datetimepicker({
    datepicker: false,
    format:'H:i',
    step:5
  });
  $('#flight-arrive').datetimepicker({
    datepicker: false,
    format:'H:i',
    step:5,
    onShow: function(ct) {
      this.setOptions({
        minTime: jQuery('#flight-depart').val() ? jQuery('#flight-depart').val() : false
      })
    }
  });

  $('#edit-depart').datetimepicker({
    datepicker: false,
    format:'H:i',
    step:5
  });

  $('#edit-arrive').datetimepicker({
    datepicker: false,
    format:'H:i',
    step:5,
    onShow: function(ct) {
      this.setOptions({
        minTime: jQuery('#edit-depart').val() ? jQuery('#edit-depart').val() : false
      })
    }
  });

});