Support = {}

/* Creates a property inside the an object */
Support.property = function(source, name, write) { 
  var property = null;
  var firstLetter = name.substring(0, 1);
  var end = name.substring(1);
  var callbackName = 'on' + firstLetter.toUpperCase() + end;

  /* Create a new function for the attribute */
  source[name] = function(value) {

    if (arguments.length == 0) {
      return property;
    }

    if (property != value) {
      property = value;
      if (source.reactor && source.reactor[callbackName]) {
        source.reactor[callbackName](); 
      }
      if (write) {
        write.call(source, value);
      }
    }
  };
}

/* Wrapper on the jQuery.ajax() function, because I like this better */
Support.request = function(method, url, data, complete) {
  if (method == 'PUT') {
    data._method = 'PUT';
  } 
  if (method == 'DELETE') {
    data._method = 'DELETE';
  }

  $.ajax({
    type: method,
    url: url,
    data: data,
    success: function(data, stat, req) {
      //console.log(method + ' success');
      complete(data, 'success');
    },
    error: function(req, stat, error) {
      //console.log(method + ' error');
      complete(null, stat);
    }
  });
}

function SearchBarController($input) {
  var timer = null; 

  Support.property(this, 'query');
  Support.property(this, 'timeout');

  this.query('');
  this.timeout(500);

  var searchBarController = this;
  $input.keyup(function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      searchBarController.query($input.val());
    }, searchBarController.timeout());
  });
}

function TimedMessageLabel($label) {
  Support.property(this, 'timeout');
  Support.property(this, 'message', updateLabel);

  this.timeout(5000);

  /* Renders the updated message label */
  function updateLabel() {
    $label.hide();
    if (this.message() != null) {
      $label.html(this.message()).show().fadeOut(this.timeout()); 
    }
  }
}

