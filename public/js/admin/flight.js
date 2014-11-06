function populateEditForm(flight) {
  $('#edit-fno').val(flight);
  $('edit-depart').val(flight.depart_time);
  $('edit-arrive').val(flight.arrive_time);
  $('edit-from').val(flight.origin);
  $('edit-to').val(flight.destination);
  $('edit-plane').val(flight.plane_id);

  $('#editForm').foundation('reveal', 'open');
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



});