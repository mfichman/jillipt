
function JournalPageController($page) {
  var searchBar = new SearchBarController($page.find('.search-panel input'));  
  var entryList = new ItemListController($page.find('.search-panel .item-list'));
  var messageLabel = new TimedMessageLabel($page.find('.message'));
  var autosaveTextarea = new AutosaveTextarea($page.find('.editor-panel textarea'));
  var $warningLabel = $page.find('.warning');
  var $titleLabel = $page.find('.editor-panel .title');
  var $text = $page.find('.editor-panel textarea');
  var controller = this;

  Support.property(this, 'entry', updatePanel);

  this.entry({})

  $warningLabel.hide();
  searchBar.reactor = this;
  entryList.reactor = this;
  autosaveTextarea.reactor = this;

  /* Create a new entry, and save the current entry */
  $page.find('.new').click(function() {
    var entry = controller.entry();
    if (entry.id == null) {
      controller.entry({});
      return;
    }
    JournalEntry.update(entry, function(data, stat) {
      if (stat == 'success') {
        controller.entry({});
        messageLabel.message('Saved!');
        controller.onQuery();
      } else {
        $warningLabel.html('Couldn\'t save!').show();
      }
    });
  });

  /* Delete the current journal entry and replace it with an empty one */
  $page.find('.delete').click(function() {
    var entry = controller.entry();
    JournalEntry.destroy(entry, function(data, stat) {
      if (stat == 'success') {
        controller.entry({});
        controller.onQuery();
      } else {
        $warningLabel.html('Couldn\'t delete!').show();
      }
    });
  });

  /* Save the current entry */
  $page.find('.save').click(save);

  /* Called when the query changes in the search bar */
  this.onQuery = function() {
    JournalEntry.search(searchBar.query(), function(data, stat) {
      if (stat == 'success') {
        for (index in data) {
          data[index].text = '#' + data[index].id + ' ' + data[index].text;
        }
        entryList.items(data);
      }
    });
  }

  /* Called when the saved status changes */
  this.onNeedsAutosave = function() {
    if (autosaveTextarea.needsAutosave() && 
        controller.entry().id) {
      save();
    }
  }

  /* Called when a journal is selected */
  this.onSelectedItem = function() {
    var summary = entryList.selectedItem();
    JournalEntry.read(summary.id, function(data, stat) {
      if (stat == 'success') {
        controller.entry(data);
      }
    });
  }

  function save() {
    var entry = controller.entry();
    JournalEntry.update(entry, function(data, stat) {
      if (stat == 'success') {
        controller.entry(data);
        autosaveTextarea.needsSave(false);
        messageLabel.message('');
        messageLabel.message('Saved!');
        controller.onQuery();
      } else {
        $warningLabel.html('Couldn\'t save!').show();
      }
    });
  } 

  function updatePanel() {
    if (this.entry().id != null) {
      $titleLabel.html('Journal Entry #' + this.entry().id);
    } else {
      $titleLabel.html('New Journal Entry');
    }
    $text.val(this.entry().text);
  }

  $text.keyup(function() {
    controller.entry().saved = false;
    controller.entry().text = $text.val();
  });
}
