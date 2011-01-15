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
  this.message('');
    
  var controller = this;

  /* Renders the updated message label */
  function updateLabel() {
    $label.html(this.message());
    $label.stop().show();
    var $visible = $label.filter(':visible');
    var $hidden = $label.filter(':hidden');

    $visible.css({opacity: 100});
    $visible.fadeOut(this.timeout());
    $hidden.html('');
  }
}

function ItemListController($container) {
  var maxLabelLength = 32;

  Support.property(this, 'items', updateList);
  Support.property(this, 'selectedItem');
  
  function updateList() {
    /* Create a new unordered list to hold all of the profiles */
    var $list = $('<ul></ul>');
    var controller = this;

    /* Loop through all the items, and add them to the DOM */
    for (index in this.items()) {
      (function() { 
        var item = controller.items()[index];
        var text = item.text;
        if (text.length > maxLabelLength) {
          text = text.substr(0, maxLabelLength - 3) + '...';
        }
        var $anchor = $('<a href="#">' + text + '</a>');
        $anchor.click(function() {
          controller.selectedItem(item);
        }); 
        var $element = $('<li></li>');
        $element.append($anchor);
        $list.append($element);
      })();
    }

    /* Now append the new HTML list to the DOM */
    $container.html('');
    $container.append($list);
  }
}

function AutosaveTextarea($textarea) {
  var autosaveTimer = null;
  var autosaveInterval = 15000; // 15 seconds
  var controller = this;

  Support.property(this, 'needsAutosave');
  Support.property(this, 'needsSave', function() {
    if (!controller.needsSave()) {
      controller.needsAutosave(false);
      clearTimeout(autosaveTimer);
    }
  });

  this.needsSave(false);
  this.needsAutosave(false);

  $textarea.filter('textarea').keyup(function() {
    if (!controller.needsSave()) {
      controller.needsSave(true);
      clearTimeout(autosaveTimer);
      autosaveTimer = setTimeout(function() {
        controller.needsAutosave(true);
      }, autosaveInterval); 
    }
  }); 
}

function NavigationList($container) {
  var $links = $container.find('ul > li a');
  var $pages = $links.map(function(i, element) {
    return $(element.getAttribute('href')).get();
  });

  $pages.hide();
  $pages.first().show();
  
  $links.click(function(evt) {
    var $activePage = $(evt.target.getAttribute('href'));
    $pages.hide();
    $activePage.show();
  });
}

function JSONModel(modelName) {

  this.read = function(id, callback) {
    var url = '/' + modelName + 's/' + id + '.json';
    Support.request('GET', url, {}, function(data, stat) {
      if (data) {
        data[modelName].saved = true;
      }
      callback(data[modelName], stat);
    });
  }

  this.update = function(model, callback) {
    /* If the model has already been saved, the return success */
    if (model.saved) {
      callback(model, 'success');
      return;
    }
    delete model.saved;

    /* Otherwise, upload the model to the server */
    if (model.id == null) {
      var method = 'POST';
      var url = '/' + modelName + 's.json';
    } else {
      var method = 'PUT';
      var url = '/' + modelName + 's/' + model.id + '.json';
    }

    /* Prepare the model to be sent */
    data = {}
    data[modelName] = model;
  
    Support.request(method, url, data, function(data, stat) {
        if (data[modelName] != null) {
          model = data[modelName];
        }
        model.saved = true;
        callback(model, stat);
    });
  } 

  this.destroy = function(model, callback) {
    var url = '/' + modelName + 's/' + model.id + '.json';
    Support.request('DELETE', url, {}, callback);
  }
}
