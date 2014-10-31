function parseDate(date) {
  var day = date.split('/');
  var output = new Date();
  output.setFullYear(day[0]);
  output.setMonth(day[1]-1);
  output.setDate(day[2]);
  return output;
}

function convertDateString(date) {
  return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}


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
  jQuery('#search_date').datetimepicker({
  format:'Y/m/d',
  timepicker:false
 });


  $("#seat_submit").on("click", function(event){
    $('#data-entry').html('');
    event.preventDefault();
    var fno = $("#search_fno").val();
    var date = $("#search_date").val().replace("/\//g", "-");
    var avaliablity = $("#search_avaliable").val();
    var condition = {
      "flight_no" : fno,
      "flight_time" : date,
      "avaliable" : avaliablity
    };
    $.getJSON("/api/seats", condition, function(data) {
      var tableContent = "";
        if (data.length == 0) {
          tableContent += '<tr><td colspan="7" style="text-align:center;"><i>Empty</i></td></tr>';
          $('#data-entry').append($(tableContent));
          tableContent = '';
        } else {
          $.each(data, function(index, element) {
            console.log(index);
            tableContent += '<tr><td style="text-align:center;">';
            tableContent += this.flight_no;
            tableContent += '</td><td style="text-align:center;">';
            tableContent += this.flight_time;
            tableContent += '</td><td style="text-align:center;">';
            tableContent += this.seat_class;
            tableContent += '</td><td style="text-align:center;">';
            tableContent += this.sid;
            tableContent += '</td><td style="text-align:center;">';
            tableContent += this.avaliable;
            tableContent += '</td><td style="text-align:center;">';
            tableContent += this.price;
            tableContent += '</td><td style="text-align:center;">';
            tableContent += '<a id=""><i class="icon-remove icon-2x"></i></a></td></tr>';
            $('#data-entry').append(tableContent);
            tableContent = '';
          });
        }

    });
  });


});

