
function JournalPageController($page) {
  var editor = new SuperEditor($page, 'JournalEntry');
  var $titleLabel = $page.find('.editor-panel .title');
  var $text = $page.find('.editor-panel textarea');

  editor.reactor = this;
  
  this.onItem = function() {
    if (editor.item().id != null) {
      $titleLabel.html('Journal Entry #' + editor.item().id);
    } else {
      $titleLabel.html('New Journal Entry');
    }
    $text.val(editor.item().text);
  }

  $text.keyup(function() {
    editor.item().saved = false;
    editor.item().text = $text.val();
  });
}
