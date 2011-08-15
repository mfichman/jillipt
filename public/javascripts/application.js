// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$(document).ready(function() {
    new ApplicationController();
});

PatientProfile = new JSONModel('patient_profile');
JournalEntry = new JSONModel('journal_entry');
FlashCard = new JSONModel('flash_card');

function ApplicationController() {
    var profilesPage = new ProfilesPageController($('#profiles-page'));
    var journalPage = new JournalPageController($('#journal-page'));
    var flashCardPage = new FlashCardsPageController($('#flash-cards-page'));
    var navigationList = new NavigationList($('.navigation-list'));
}
