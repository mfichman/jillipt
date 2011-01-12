PatientProfile = {}

PatientProfile.read = function(id, callback) {
  var url = '/patient_profiles/' + id + '.json';
  Support.request('GET', url, {}, function(data, stat) {
    if (data) {
      data.patient_profile.saved = true;
    }
    callback(data, stat);
  });
}

PatientProfile.update = function(profile, callback) {
  if (profile.saved) {
    callback({ patient_profile: profile}, 'success');
    return;
  }
  delete profile.saved;
  data = { patient_profile: profile };
  if (profile.id == null) {
    var method = 'POST';
    var url = '/patient_profiles.json';
  } else {
    var method = 'PUT';
    var url = '/patient_profiles/' + profile.id + '.json';
  }
  Support.request(method, url, data, function(data, stat) {
      if (data == null || data.patient_profile == null) {
        data = { patient_profile: profile };
      }
      data.patient_profile.saved = true;
      callback(data, stat);
  });
} 

PatientProfile.destroy = function(profile, callback) {
  var url = '/patient_profiles/' + profile.id + '.json';
  Support.request('DELETE', url, {}, callback);
}

