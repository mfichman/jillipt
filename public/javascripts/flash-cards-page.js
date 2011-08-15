
function FlashCardsPageController($page) {
  var editor = new SuperEditor($page, 'FlashCard'); 
  var $container = $page.find('.tabs-panel');
  var $titleLabel = $container.find('.editor-panel .title');
  var $front = $container.find('#front .editor-panel textarea');
  var $back = $container.find('#back .editor-panel textarea');
  var $other = $container.find('#other .editor-panel textarea');
  $container.tabs();

  editor.reactor = this;
  $titleLabel.html('New Flash Card');

  /* Renders the current panel */
  this.onItem = function() {
    if (editor.item().id != null) {
      $titleLabel.html('Flash Card #' + editor.item().id);
    } else {
      $titleLabel.html('New Flash Card');
    }
    $front.val(editor.item().front);
    $back.val(editor.item().back);
  }

  /* When a key is pressed, the profile needs to be saved */
  $container.find('textarea').keyup(function() {
    editor.item().saved = false;
    editor.item().front = $front.val();
    editor.item().back = $back.val();
  });
}
