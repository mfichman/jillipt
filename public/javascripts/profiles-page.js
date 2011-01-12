$(function() {
  new ProfilesPageController($('body'));
});

function ProfilesPageController($container) {
  var searchBarController = new SearchBarController($('#search-input'));
  var profileListController = new ProfileListController($('#list'));
  var timedMessageLabel = new TimedMessageLabel($('.message-label'));
  var profilePanelController = new ProfilePanelController($('#tabs')); 
  var $warningLabel = $('.warning-label');
  var controller = this;
  var autosaveTimer = null;
  var autosaveInterval = 15000; // 15 seconds


  $warningLabel.hide();
  searchBarController.reactor = this;
  profileListController.reactor = this;
  profilePanelController.reactor = this;

  /* Create a new profile, and save the current profile.  Only save a profile
   * that has been saved manually at least once  */
  $container.find('.new-button').click(function() {
    var profile = profilePanelController.profile();
    if (profile.id == null) {
      profilePanelController.profile({});
      return;
    }
    PatientProfile.update(profile, function(data, stat) {
      if (stat == 'success') {
        profilePanelController.profile({});
        timedMessageLabel.message('Saved!');
        controller.onQuery();
      } else {
        $warningLabel.html('Couldn\'t save!').show();
      }
    });
  });

  /* Delete the current profile and replace it with an empty profile */
  $container.find('.delete-button').click(function() {
    var profile = profilePanelController.profile();
    PatientProfile.destroy(profile, function(data, stat) {
      if (stat == 'success') {
        profilePanelController.profile({});
        controller.onQuery();
      } else {
        $warningLabel.html('Couldn\'t delete!').show();         
      }
    });
  });

  /* Save the current profile */
  $container.find('.save-button').click(save);

  /* Called when the query changes in the search bar */
  this.onQuery = function() {
    var data = { search: searchBarController.query() };
    var url = '/patient_profile_searches.json';
    if (searchBarController.query().length <= 0) {
      profileListController.profiles([]);
      return;
    }

    Support.request('POST', url, data, function(data, stat) {
      if (stat == 'success') {
        profileListController.profiles(data);
      }
    });
  }

  /* Called when the saved status changes */
  this.onSaved = function() {
    if (profilePanelController.saved()) {
      clearTimeout(autosaveTimer);
    } else {
      autosaveTimer = setTimeout(function() {
        if (profilePanelController.profile().id) {
          save();
        }      
      }, autosaveInterval); 
    }
  }

  /* Called when a profile is selected in the search bar */
  this.onSelectedProfile = function() {
    var summary = profileListController.selectedProfile();
    PatientProfile.read(summary.id, function(data, stat) {
      if (stat == 'success') {
        profilePanelController.profile(data.patient_profile);
      }
    });
  }

  /* Saves the current profile */
  function save() {
    var profile = profilePanelController.profile();
    PatientProfile.update(profile, function(data, stat) {
      if (stat == 'success') {
        profilePanelController.profile(data.patient_profile);
        profilePanelController.saved(true);
        timedMessageLabel.message('Saved!');
        controller.onQuery();
      } else {
        $warningLabel.html('Couldn\'t save!').show();
      }
    });
  }
}

function ProfileListController($container) {
  var maxLabelLength = 32;

  Support.property(this, 'selectedProfile');
  Support.property(this, 'profiles', updateList);

  /* Renders the list of profiles */
  function updateList() {
    /* Create a new unordered list to hold all of the profiles */
    var $list = $('<ul></ul>');
    var controller = this;

    /* Loop through all the profiles, and add them to the DOM so that they
     * become visible */
    for (index in this.profiles()) {
      (function() {
        var profile = controller.profiles()[index];
        var text = '#' + profile.id + ' ' + profile.text;
        if (text.length > maxLabelLength) {
          text = text.substr(0, maxLabelLength - 3) + '...';
        }
        var $anchor = $('<a href="#">' + text + '</a>');
        $anchor.click(function() {
          controller.selectedProfile(profile);
        }); 
        var $element = $('<li></li>');
        $element.append($anchor);
        $list.append($element);
      })();
    }

    /* Now append the new HTML list to the end of the DOM for the list
     * container */
    $container.html('');
    $container.append($list);
  }
}

function ProfilePanelController($container) {
  var $titleLabel = $container.find('.profile-id');
  var $messageLabel = $container.find('.message-label');
  var $diagnosis = $container.find('#diagnosis textarea');
  var $modalities = $container.find('#modalities textarea');
  var $exercises = $container.find('#exercises textarea');
  var $tests = $container.find('#tests textarea');
  var $other = $container.find('#other textarea');
  $container.tabs();
  $messageLabel.hide();

  Support.property(this, 'profile', updatePanel);
  Support.property(this, 'saved');

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
    this.saved(true);
  }

  var controller = this;

  /* When a key is pressed, the profile needs to be saved */
  $container.find('textarea').keyup(function() {
    controller.saved(false);
    controller.profile().saved = false;
    controller.profile().diagnosis = $diagnosis.val();
    controller.profile().modalities = $modalities.val();
    controller.profile().exercises = $exercises.val();
    controller.profile().tests = $tests.val();
    controller.profile().other = $other.val();
  });
}
