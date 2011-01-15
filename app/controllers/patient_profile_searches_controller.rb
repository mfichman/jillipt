class PatientProfileSearchesController < ApplicationController

  # POST /patient_profiles
  # POST /patient_profiles.xml
  def create
    @search_terms = params[:search].downcase.split()
    if @search_terms.empty? 
      @patient_profiles = []
    else
      @patient_profiles = PatientProfile.all().collect do |profile|
        value = { :text => profile.diagnosis, :id => profile.id }
        @search_terms.each do |search_term|
          profile.diagnosis = '' if !profile.diagnosis
          profile.modalities = '' if !profile.modalities
          profile.exercises = '' if !profile.exercises
          profile.tests = '' if !profile.tests
          profile.other = '' if !profile.other

          if !profile.diagnosis.downcase.include?(search_term) &&
            !profile.modalities.downcase.include?(search_term) &&
            !profile.exercises.downcase.include?(search_term) &&
            !profile.tests.downcase.include?(search_term) &&
            !profile.other.downcase.include?(search_term)

            value = nil
          end
        end
        value
      end
      @patient_profiles.compact!
    end

    respond_to do |format|
      format.json { render :json => @patient_profiles }
    end 
  end

end
