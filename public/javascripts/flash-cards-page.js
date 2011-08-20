
function FlashCardsPageController($page) {
  var editor = new SuperEditor($page, 'FlashCard'); 
  var $container = $page.find('.tabs-panel');
  var $titleLabel = $container.find('.editor-panel .title');
  var $front = $container.find('#front .editor-panel textarea');
  var $back = $container.find('#back .editor-panel textarea');
  var $other = $container.find('#other .editor-panel textarea');
  var $topic = $container.find('.editor-panel .meta')
  $container.tabs();

  editor.reactor = this;
  $titleLabel.html('New Flash Card');
  $topic.show();
  $topic.val("Topic: ");

  var savedTopic = "";

  /* Renders the current panel */
  this.onItem = function() {
    if (editor.item().id != null) {
      $titleLabel.html('Flash Card #' + editor.item().id);
    } else {
      $titleLabel.html('New Flash Card');
    }
    $front.val(editor.item().front);
    $back.val(editor.item().back);
    if (editor.item().id != null) {
      $topic.val("Topic: "+editor.item().topic);
      savedTopic = editor.item().topic;
    } else {
      $topic.val("Topic: "+savedTopic);
      editor.item().topic = savedTopic;
    }
  }

  $topic.keydown(function(event) {
    if (this.selectionStart < "Topic: ".length) {
      this.selectionStart = "Topic: ".length;
    }
    if ($topic.val() == "Topic: " && event.keyCode == 8) {
      event.preventDefault();
      return false;
    }
  });

  $topic.keyup(function() {
    var raw = $topic.val();
    var index = "Topic: ".length;
    var topic = raw.substr(index);

    editor.item().saved = false;
    editor.item().topic = topic;
    savedTopic = topic;
  });

  /* When a key is pressed, the profile needs to be saved */
  $container.find('textarea').keyup(function() {
    editor.item().saved = false;
    editor.item().front = $front.val();
    editor.item().back = $back.val();
  });
}
