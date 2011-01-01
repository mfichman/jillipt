// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$(function() {
  var AUTOSAVE_INTERVAL = 30000; // In milliseconds
  var SEARCH_TIMEOUT = 500; // In milliseconds
	var MESSAGE_TIMEOUT = 5000; // In milliseconds
	var MAX_LABEL_LENGTH = 32;

  var id_ = null;
  var changes_ = false;
  var saveTimer_ = null;
  var searchTimer_ = null;

  /* Creates the tabs and makes them sortable */
  $('#tabs').tabs();

  /* Saves the current profile */
  $('.save-button').click(save);

  /* Hide the warning labels */
  $('.warning-label').hide();
	$('.message-label').hide();
	title('New Patient Profile');

  /* Creates a new profile, editable by the user */
  $('.new-button').click(function() {
		if (id_) {
			save();
		}

    $('#tabs > div > textarea').val('');
    changes(false);
    id(null);
		title('New Patient Profile');
  });

  /* Clears the current profile */
  $('.delete-button').click(function() {
    destroy();
  });
  
  /* Marks the current profile as NOT saved */
  $('#tabs > div > textarea').keydown(function() {
    changes(true);
  });

  /* Search timeout */
  $('#search-input').keydown(function() {
    clearTimeout(searchTimer_);
    searchTimer_ = setTimeout(search, SEARCH_TIMEOUT);
  });

  /* Deletes the current profile */
  function destroy() {
    $('#tabs > div > textarea').val('');
    if (id_) {
      del('/patient_profiles/' + id_ + '.json', {}, function(data, stat) {
        if (stat == 'success') {
          search();
        }
      });
    }
		changes(false);
    id(null);
	  title('New Patient Profile');
  }

  /* Searches for whatever is in the search box */
  function search() {
    var search = $('#search-input').val();
    var data = { search: search };

    console.log('Searching for "' + search + '"');
    post('/patient_profile_searches.json', data, function(data, stat) {
      if (stat == 'success') {

        /* Build the list of profiles that match the search */
        $list = $('<ul></ul>');
        for (index in data) {
					var text = '#' + data[index].id + ' ' + data[index].text;
					if (text.length > MAX_LABEL_LENGTH) {
						text = text.substr(0, MAX_LABEL_LENGTH - 3) + '...';
					} 
          $anchor = $('<a href="#">' + text + '</a></li>');
          $anchor.data('id', data[index].id);
          $anchor.click(function(event) {
            id($(event.target).data('id'));
          });
          $element = $('<li></li>');
          $element.append($anchor);
          $list.append($element);
        }

        $('#list').html('');
        $('#list').append($list);
      }
    });
  }

  /* Sets the ID of the current patient profile */
  function id(value) {
    if (arguments.length == 0) {
      return id_;
    } 
    id_ = value;
    if (id_ == null) {
      $('.warning-label').hide();
      return;
    }
    get('/patient_profiles/' + value + '.json', {}, function(data, stat) {
      id_ = data.patient_profile.id;
      $('#diagnosis textarea').val(data.patient_profile.diagnosis);
      $('#modalities textarea').val(data.patient_profile.modalities);
      $('#exercises textarea').val(data.patient_profile.exercises);
      $('#tests textarea').val(data.patient_profile.tests);
      $('#other textarea').val(data.patient_profile.other);
			title('Patient Profile #' + id_);
    });
  }

  /* Saves the current profile */
  function save() {
    console.log('Saving patient profile');

    /* Save all the data the user typed into the text areas */
    var data = {
      patient_profile: {
        diagnosis: $('#diagnosis textarea').val(),
        modalities: $('#modalities textarea').val(),
        exercises: $('#exercises textarea').val(),
        tests: $('#tests textarea').val(),
        other: $('#other textarea').val()
      }
    };
  
    /* Send the ajax request */
    if (!id_) {  
      post('/patient_profiles.json', data, function(data, stat) {
        if (stat == 'success') {
          id_ = data.patient_profile.id;
          changes(false);
          search();
					message('Saved!');
					title('Patient Profile #' + id_);
        } else {
					$('.warning-label').html('Couldn\'t save!').show();
          changes(true);
        }
      });
    } else {
			console.log(data);
      put('/patient_profiles/' + id_ + '.json', data, function(data, stat) {
        if (stat == 'success') {
          changes(false);
          search();
					message('Saved!');
        } else {
					$('.warning-label').html('Couldn\'t save!').show();
          changes(true);
        }
      });
    }
  }

	/* Sets the message that's flashed on the top bar */
	function message(message) {
		$('.message-label').hide();
		if (message != null) {
			
			$('#tabs > div').not('.ui-tabs-hide').find('.message-label')
				.html(message)
				.show()
				.fadeOut(MESSAGE_TIMEOUT);
		}
	}

	/* Sets the title of the card */
	function title(title) {
		if (title != null) {
			$('.profile-id').html(title);
		}
	}

  /* Starts the autosave timer */
  function changes(flag) {
    if (flag == null) {
      return changes_;
    }
    changes_ = flag;

    if (changes_ && id_ == null) {
      $('.warning-label').html('Don\'t forget to save!').show();
    } else {
      $('.warning-label').hide();
    }

    if (changes_ && saveTimer_ == null && id_) {
      saveTimer_ = setInterval(save, AUTOSAVE_INTERVAL);
    } else if (!changes_) {
      clearTimeout(saveTimer_);
    }
  }
  
});


/* Wrapper on the jQuery.ajax() function, because I like this better */
function post(url, data, complete) {
  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    success: function(data, stat, req) {
      console.log('POST success');
      complete(data, 'success');
    },
    error: function(req, stat, error) {
      console.log('POST error');
      complete(null, stat);
    }
  });
}

/* Wrapper on the jQuery.ajax() function, because I like this better */
function put(url, data, complete) {
  data._method = 'PUT';
  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    success: function(data, stat, req) {
      console.log('PUT success');
      complete(data, 'success');
    },
    error: function(req, stat, error) {
      console.log('PUT error');
      complete(null, stat);
    }
  });
}

/* Wrapper on the jQuery.ajax() function, because I like this better */
function get(url, data, complete) {
  $.ajax({
    type: 'GET',
    url: url,
    data: data,
    success: function(data, stat, req) {
      console.log('GET success');
      complete(data, 'success');
    },
    error: function(req, stat, error) {
      console.log('GET error');
      complete(null, stat);
    }
  });
}

/* Wrapper on the jQuery.ajax() function */
function del(url, data, complete) {
  data._method = 'DELETE';
  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    success: function(data, stat, req) {
      console.log('DELETE success');
      complete(data, 'success');
    },
    error: function(req, stat, error) {
      console.log('DELETE error');
      complete(null, stat);
    }
  });
}
