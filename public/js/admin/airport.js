function populateTable() {
  var tableContent = '';
  $('#data-entry').html('');
  $.getJSON('/api/airport', function(data) {
    if (data.length == 0) {
      tableContent +=
        '<tr><td colspan="5" style="text-align:center;"><i>Empty</i></td></tr>';
      $('#data-entry').append($(tableContent));
    } else {
      $.each(data, function() {
        tableContent += '<div id="a' + this.code +
          '" class="reveal-modal small" data-reveal style="text-align:center;">';
        tableContent += '<h2>Delete airport ' + this.code + '</h2>';
        tableContent += '<h4>Are you sure?</h4>';
        tableContent += '<p><button class="alert" id="delete_' + this
          .code + '">Delete</button>';
        tableContent += '<button>Cancel</button></p>';
        tableContent +=
          '<a class="close-reveal-modal">&#215;</a></div>';
        $('#data-entry').append($(tableContent));
        tableContent = '';


        tableContent += '<tr><td style="text-align:center;">';
        tableContent += this.code;
        tableContent += '</td><td style="text-align:center;">';
        tableContent += this.name;
        tableContent += '</td><td style="text-align:center;">';
        tableContent += this.city;
        tableContent += '</td><td style="text-align:center;">';
        tableContent += this.country;
        tableContent += '</td><td style="text-align:center;">';
        tableContent += '<a id="' + this.code +
          '"><i class="icon-remove icon-2x"></i></a></td></tr>';
        $('#data-entry').append(tableContent);
        tableContent = '';


        var modal = $('#a' + this.code);
        $('#' + this.code).on('click', function() {
          modal.foundation('reveal', 'open');
        });
        var delete_button = $("#delete_" + this.code);
        var airport_code = this.code;
        delete_button.on('click', function() {
          $.ajax({
            type: 'DELETE',
            url: '/api/airport/' + airport_code,
          }).done(function(response) {
            console.log(response);
            // Check for successful (blank) response
            if (response.status === 'ok') {
              modal.foundation('reveal', 'close');
              // Update the table
              populateTable();
            } else {
              // If something goes wrong, alert the error message that our service returned
              alert('Error: ' + response.error);
            }
          });
        });
      });
    }
  });


};

$(document).ready(function() {

  populateTable();
  $('#add-new-airport-form').on('valid.fndtn.abide', function(req) {
    var code = $("#airport_code").val().trim();
    var name = $("#airport_name").val().trim();
    var city = $("#airport_city").val().trim();
    var country = $("#airport_country").val().trim();

    var data = {
      "code": code,
      "name": name,
      "city": city,
      'country': country
    };

    $.ajax({
      type: 'POST',
      data: data,
      url: '/api/airport',
      dataType: 'JSON'
    }).done(function(response) {
      console.log(response);
      // Check for successful (blank) response
      if (response.status === 'ok') {
        // Clear the form inputs
        $('#add-new-airport-form input').val('');
        // Update the table
        populateTable();
      } else {
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.error);
      }
    });
  });

});
