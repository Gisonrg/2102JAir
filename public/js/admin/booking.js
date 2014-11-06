function populateEditForm(booking) {
  $('#edit-bookRef').val(booking);
  $.getJSON("/api/booking/"+booking, function(data) {
    var booking = data[0];
    $('#edit-seat').val(booking.seat_id);
  });

  $('#edit-cancel').click(function(){
    $('#editForm').foundation('reveal', 'close');
  });

  $('#edit-submit').click(function(){
    var newSeat = $('#edit-seat').val();
    var data = {"seat" : newSeat};
    $.ajax({
        type: 'PUT',
        url: '/api/booking/' + booking,
        data: data,
        dataType: 'JSON',
      }).done(function(response) {
        // Check for successful (blank) response
        if (response.status === 'ok') {
          $('#deleteForm').foundation('reveal', 'close');
          window.location = "/admin/booking";
        } else {
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.error);
        }
    });
  });

  $('#editForm').foundation('reveal', 'open');
}

function populateDeleteForm(booking) {
  $('#delete-booking').html(booking);

  $('#delete-submit').click(function(){
    $.ajax({
        type: 'DELETE',
        url: '/api/booking/' + booking,
      }).done(function(response) {
        // Check for successful (blank) response
        if (response.status === 'ok') {
          $('#deleteForm').foundation('reveal', 'close');
          window.location = "/admin/booking";
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


});

