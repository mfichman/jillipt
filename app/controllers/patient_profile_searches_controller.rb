class PatientProfileSearchesController < ApplicationController

  # POST /patient_profiles
  # POST /patient_profiles.xml
  def create
    @search_terms = params[:search].split()
    if @search_terms.empty? 
      @patient_profiles = []
    else
      @patient_profiles = PatientProfile.all().collect do |profile|
        value = { :text => profile.diagnosis, :id => profile.id }
        @search_terms.each do |search_term|
          if !profile.diagnosis.include?(search_term) &&
            !profile.modalities.include?(search_term) &&
            !profile.exercises.include?(search_term) &&
            !profile.tests.include?(search_term) &&
            !profile.other.include?(search_term)

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
