
function JournalPageController($page) {
  var searchBar = new SearchBarController($page.find('.search-input'));  
  var entryList = new ItemListController($page.find('.search-panel .item-list'));
  var messageLabel = new TimedMessageLabel($page.find('.message'));
  var autosaveTextarea = new AutosaveTextarea($page.find('.editor-panel textarea'));
  var $warningLabel = $page.find('.warning');
  var controller = this;

  Support.property(this, 'entry');

  $warningLabel.hide();

  /* Create a new entry, and save the current entry */
  $page.find('.new').click(function() {
    var entry = controller.entry();
    if (entry.id == null) {
      entry({});
      return;
    }
    JournalEntry.update(profile, function(data, stat) {

    });
    

  });
}
