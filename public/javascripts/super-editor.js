
function SuperEditor($page, model) {
  if (!window[model]) {
    throw "Couldn't find model: " + model;
  }

  var searchBar = new SearchBarController($page.find('.search-panel input'));  
  var itemList = new ItemListController($page.find('.search-panel .item-list'));
  var messageLabel = new TimedMessageLabel($page.find('.message'));
  var autosaveTextarea = new AutosaveTextarea($page.find('.editor-panel textarea'));
  var warningLabel = new TimedMessageLabel($page.find('.warning'));
  var controller = this;
  var $textarea = $page.find('.editor-panel textarea');
  var $display = $page.find('.editor-panel .display');

  Support.property(this, 'item');
  Support.property(this, 'messageLabel');
  Support.property(this, 'warningLabel');
  this.messageLabel(messageLabel);
  this.warningLabel(warningLabel);
  this.item({});

  searchBar.reactor = this;
  itemList.reactor = this;
  autosaveTextarea.reactor = this;


  editable(false);

  $display.click(function(event) {
    editable(true);
  });
  
  $display.keydown(function(event) {
    if($display.is(":visible")) {
      $textarea.keydown(event);
    }
    editable(true);
  });

  $textarea.blur(function() {
    editable(false);
  });

  function insertLinks(val) {
    val = val.replace(/\n/, "<br/>");
    var pattern = /(HTTP:\/\/|HTTPS:\/\/)([a-zA-Z0-9.\/&?_=!*,\(\)+-]+)/gi;
    var replace = "<a href=\"$1$2\">$1$2</a>";
    
    val = val.replace(pattern, replace);
    return val;
  }

  function editable(editable) {
    if (editable) {
      $display.hide();
      $textarea.show();
      $textarea.focus();
    } else {
      $page.find('.editor-panel').each(function(i, element) {
        var $textarea = $(element).find('textarea');
        var $display = $(element).find('.display');
        var text = insertLinks($textarea.val());
        $display.html("<pre>"+text+"</pre>");
      });
      $display.show();
      $display.focus();
      $textarea.hide();
    }
  }

  /* Create a new entry, and save the current entry */
  $page.find('.new').click(function() {
    var item = controller.item();
    if (item.id == null) {
      controller.item({});
      return;
    }
    window[model].update(item, function(data, stat) {
      if (stat == 'success') {
        controller.item({});
        messageLabel.message('');
        messageLabel.message('Saved!');
        controller.onQuery();
      } else {
        warningLabel.message('');
        warningLabel.message('Couldn\'t save!');
      }
    });
  });

  /* Delete the current journal entry and replace it with an empty one */
  $page.find('.delete').click(function() {
    var item = controller.item();
    window[model].destroy(item, function(data, stat) {
      if (stat == 'success') {
        controller.item({});
        controller.onQuery();
      } else {
        warningLabel.message('');
        warningLabel.message('Couldn\'t delete!');
      }
    });
  });

  /* Save the current item */
  $page.find('.save').click(save);

  /* Called when the query changes in the search bar */
  this.onQuery = function() {
    window[model].search(searchBar.query(), function(data, stat) {
      if (stat == 'success') {
        for (index in data) {
          data[index].text = '#' + data[index].id + ' ' + data[index].text;
        }
        itemList.items(data);
      }
    });
  }

  /* Called when the saved status changes */
  this.onNeedsAutosave = function() {
    if (autosaveTextarea.needsAutosave() && controller.item().id) {
      save();
    }
  }

  /* Called when a journal is selected */
  this.onSelectedItem = function() {
    var summary = itemList.selectedItem();
    window[model].read(summary.id, function(data, stat) {
      if (stat == 'success') {
        controller.item(data);
      }
    });
  }

  function save() {
    var item = controller.item();
    window[model].update(item, function(data, stat) {
      if (stat == 'success') {
        controller.item(data);
        autosaveTextarea.needsSave(false);
        messageLabel.message('');
        messageLabel.message('Saved!');
        controller.onQuery();
      } else {
        warningLabel.message('');
        warningLabel.message('Couldn\'t save!');
      }
    });
  } 
}
