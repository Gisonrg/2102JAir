function populateTable() {
	var tableContent = '';
	$('#data-entry').html('');
	$.getJSON('/api/plane', function(data) {
		if (data.length == 0) {
			tableContent += '<tr><td colspan="4" style="text-align:center;"><i>Empty</i></td></tr>';
			$('#data-entry').append($(tableContent));
		} else {
			$.each(data, function() {
				tableContent += '<div id="a' + this.aid + '" class="reveal-modal small" data-reveal style="text-align:center;">';
				tableContent += '<h2>Delete plane ' + this.aid + '</h2>';
				tableContent += '<h4>Are you sure?</h4>';
				tableContent += '<p><button class="alert" id="delete_' + this.aid + '">Delete</button>';
				tableContent += '<button>Cancel</button></p>';
				tableContent += '<a class="close-reveal-modal">&#215;</a></div>';
				$('#data-entry').append($(tableContent));
				tableContent = '';


				tableContent += '<tr><td style="text-align:center;">';
				tableContent += this.aid;
				tableContent += '</td><td style="text-align:center;">';
				tableContent += this.type;
				tableContent += '</td><td style="text-align:center;">';
				tableContent += this.seats;
				tableContent += '</td><td style="text-align:center;">';
				tableContent += '<a id="' + this.aid + '"><i class="icon-remove icon-2x"></i></a></td></tr>';
				$('#data-entry').append(tableContent);
				tableContent = '';


				var modal = $('#a' + this.aid);
				$('#' + this.aid).on('click', function() {
					modal.foundation('reveal', 'open');
				});
				var delete_button = $("#delete_" + this.aid);
				var plane_id = this.aid;
				delete_button.on('click', function() {
					$.ajax({
						type: 'DELETE',
						url: '/api/plane/' + plane_id,
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
	$('#add-new-plane-form').on('valid.fndtn.abide', function(req) {
		var aid = $("#plane-aid").val();
		var type = $("#plane-type").val();
		var seats = $("#plane-seats").val();
		var data = {
			"aid": aid,
			"type": type,
			"seats": seats
		};
		$.ajax({
			type: 'POST',
			data: data,
			url: '/api/plane',
			dataType: 'JSON'
		}).done(function(response) {
			console.log(response);
			// Check for successful (blank) response
			if (response.status === 'ok') {
				// Clear the form inputs
				$('#add-new-plane-form input').val('');
				// Update the table
				populateTable();
			} else {
				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.error);
			}
		});
	});

});