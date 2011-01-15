
function ProfilesPageController($page) {
  var searchBar = new SearchBarController($page.find('.search-panel input'));
  var profileList = new ItemListController($page.find('.search-panel .item-list'));
  var messageLabel = new TimedMessageLabel($page.find('.message'));
  var profilePanel = new ProfilePanelController($page.find('.tabs-panel')); 
  var autosaveTextarea = new AutosaveTextarea($page.find('.editor-panel textarea'));
  var $warningLabel = $page.find('.warning');
  var controller = this;

  $warningLabel.hide();
  searchBar.reactor = this;
  profileList.reactor = this;
  profilePanel.reactor = this;
  autosaveTextarea.reactor = this;

  /* Create a new profile, and save the current profile. */
  $page.find('.new').click(function() {
    var profile = profilePanel.profile();
    if (profile.id == null) {
      profilePanel.profile({});
      return;
    }
    PatientProfile.update(profile, function(data, stat) {
      if (stat == 'success') {
        profilePanel.profile({});
        messageLabel.message('Saved!');
        controller.onQuery();
      } else {
        $warningLabel.html('Couldn\'t save!').show();
      }
    });
  });

  /* Delete the current profile and replace it with an empty profile */
  $page.find('.delete').click(function() {
    var profile = profilePanel.profile();
    PatientProfile.destroy(profile, function(data, stat) {
      if (stat == 'success') {
        profilePanel.profile({});
        controller.onQuery();
      } else {
        $warningLabel.html('Couldn\'t delete!').show();         
      }
    });
  });

  /* Save the current profile */
  $page.find('.save').click(save);

  /* Called when the query changes in the search bar */
  this.onQuery = function() {
    var data = { search: searchBar.query() };
    var url = '/patient_profile_searches.json';
    if (searchBar.query().length <= 0) {
      profileList.items([]);
      return;
    }

    Support.request('POST', url, data, function(data, stat) {
      if (stat == 'success') {
        for (index in data) {
          data[index].text = '#' + data[index].id + ' ' + data[index].text;
        }
        profileList.items(data);
      }
    });
  }

  /* Called when the saved status changes */
  this.onNeedsAutosave = function() {
    if (autosaveTextarea.needsAutosave() &&
        profilePanel.profile().id) {
      save();
    }
  }

  /* Called when a profile is selected in the search bar */
  this.onSelectedItem = function() {
    var summary = profileList.selectedItem();
    PatientProfile.read(summary.id, function(data, stat) {
      if (stat == 'success') {
        profilePanel.profile(data);
      }
    });
  }

  /* Saves the current profile */
  function save() {
    var profile = profilePanel.profile();
    PatientProfile.update(profile, function(data, stat) {
      if (stat == 'success') {
        profilePanel.profile(data);
        autosaveTextarea.needsSave(false);
        messageLabel.message('');
        messageLabel.message('Saved!');
        controller.onQuery();
      } else {
        $warningLabel.html('Couldn\'t save!').show();
      }
    });
  }
}

function ProfilePanelController($container) {
  var $titleLabel = $container.find('.editor-panel .title');
  var $diagnosis = $container.find('#diagnosis .editor-panel textarea');
  var $modalities = $container.find('#modalities .editor-panel textarea');
  var $exercises = $container.find('#exercises .editor-panel textarea');
  var $tests = $container.find('#tests .editor-panel textarea');
  var $other = $container.find('#other .editor-panel textarea');
  $container.tabs();

  Support.property(this, 'profile', updatePanel);

  this.profile({});

  /* Renders the current panel */
  function updatePanel() {
    if (this.profile().id != null) {
      $titleLabel.html('Patient Profile #' + this.profile().id);
    } else {
      $titleLabel.html('New Patient Profile');
    }
    $diagnosis.val(this.profile().diagnosis);
    $modalities.val(this.profile().modalities);
    $exercises.val(this.profile().exercises);    
    $tests.val(this.profile().tests);
    $other.val(this.profile().other);
  }

  var controller = this;

  /* When a key is pressed, the profile needs to be saved */
  $container.find('textarea').keyup(function() {
    controller.profile().saved = false;
    controller.profile().diagnosis = $diagnosis.val();
    controller.profile().modalities = $modalities.val();
    controller.profile().exercises = $exercises.val();
    controller.profile().tests = $tests.val();
    controller.profile().other = $other.val();
  });
}
