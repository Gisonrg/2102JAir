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