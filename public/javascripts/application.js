// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$(document).ready(function() {
    new ApplicationController();
});

function ApplicationController() {
    var profilesPageController = new ProfilesPageController($('#profiles-page'));
    var journalPageController = new JournalPageController($('#journal-page'));

}
