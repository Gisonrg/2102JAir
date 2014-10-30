$(document).ready(function() {
  jQuery('#from').datetimepicker({
    minDate:0,
  format:'Y/m/d',
  onShow:function( ct ){
   this.setOptions({
    maxDate:jQuery('#to').val()?jQuery('#to').val():false
   })
  },
  timepicker:false
 });
 jQuery('#to').datetimepicker({
  format:'Y/m/d',
  onShow:function( ct ){
   this.setOptions({
    minDate:jQuery('#from').val()?jQuery('#from').val():0
   })
  },
  timepicker:false
 });
});

