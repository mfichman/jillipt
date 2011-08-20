
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
  $page.find('.next').show();

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
    
  function next(item) {
    var data = { topic: item.topic, id: item.id };
    var url = '/flash_cards/next.json';

    Support.request('GET', url, data, function(data, stat) {
      if (stat != 'success') {
        editor.warningLabel().message('');  
        editor.warningLabel().message('Couldn\'t get the next card!');
      } else {
        data = data["flash_card"];
        data.saved = true;
        editor.item(data);
      }
    }); 
  }

  $page.find('.next').click(function() {
    var item = editor.item();
    if (item.id == null || item.saved) {
      next(item);
      return;
    } 
    FlashCard.update(item, function(data, stat) {
      if(stat == 'success') {
        editor.item(data);
        editor.messageLabel().message('');
        editor.messageLabel().message('Saved!');
        next(data);
      } else {
        editor.warningLabel().message('');
        editor.twarningLabel().message('Couldn\'t save!');
      }
    });

  });

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
