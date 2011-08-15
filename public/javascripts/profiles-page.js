
function ProfilesPageController($page) {
  var editor = new SuperEditor($page, 'PatientProfile'); 
  var $container = $page.find('.tabs-panel');
  var $titleLabel = $container.find('.editor-panel .title');
  var $diagnosis = $container.find('#diagnosis .editor-panel textarea');
  var $modalities = $container.find('#modalities .editor-panel textarea');
  var $exercises = $container.find('#exercises .editor-panel textarea');
  var $tests = $container.find('#tests .editor-panel textarea');
  var $other = $container.find('#other .editor-panel textarea');
  $container.tabs();

  editor.reactor = this;

  /* Renders the current panel */
  this.onItem = function() {
    if (editor.item().id != null) {
      $titleLabel.html('Patient Profile #' + editor.item().id);
    } else {
      $titleLabel.html('New Patient Profile');
    }
    $diagnosis.val(editor.item().diagnosis);
    $modalities.val(editor.item().modalities);
    $exercises.val(editor.item().exercises);    
    $tests.val(editor.item().tests);
    $other.val(editor.item().other);
  }

  /* When a key is pressed, the profile needs to be saved */
  $container.find('textarea').keyup(function() {
    editor.item().saved = false;
    editor.item().diagnosis = $diagnosis.val();
    editor.item().modalities = $modalities.val();
    editor.item().exercises = $exercises.val();
    editor.item().tests = $tests.val();
    editor.item().other = $other.val();
  });
}
