class PatientProfilesController < ApplicationController
  # GET /patient_profiles
  # GET /patient_profiles.xml
  def index
    @patient_profiles = PatientProfile.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json => @patient_profiles }
      format.xml { render :xml => @patient_profiles }
    end
  end

  # GET /patient_profiles/1
  # GET /patient_profiles/1.xml
  def show
    @patient_profile = PatientProfile.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @patient_profile }
      format.xml { render :xml => @patient_profile }
    end
  end

  # GET /patient_profiles/new
  # GET /patient_profiles/new.xml
  def new
    @patient_profile = PatientProfile.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render :json => @patient_profile }
      format.xml  { render :xml => @patient_profile }
    end
  end

  # GET /patient_profiles/1/edit
  def edit
    @patient_profile = PatientProfile.find(params[:id])
  end

  # POST /patient_profiles
  # POST /patient_profiles.xml
  def create
    @patient_profile = PatientProfile.new(params[:patient_profile])

    respond_to do |format|
      if @patient_profile.save
        format.html { redirect_to(@patient_profile, :notice => 'Patient profile was successfully created.') }
        format.json { render :json => @patient_profile, :status => :created, :location => @patient_profile }
        format.xml  { render :xml => @patient_profile, :status => :created, :location => @patient_profile }
      else
        format.html { render :action => "new" }
        format.json { render :json => @patient_profile.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @patient_profile.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /patient_profiles/1
  # PUT /patient_profiles/1.xml
  def update
    @patient_profile = PatientProfile.find(params[:id])

    respond_to do |format|
      if @patient_profile.update_attributes(params[:patient_profile])
        format.html { redirect_to(@patient_profile, :notice => 'Patient profile was successfully updated.') }
        format.json { render :json => [] }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.json { render :json => @patient_profile.errors, :status => :unprocessable_entity }
        format.xml  { render :xml => @patient_profile.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /patient_profiles/1
  # DELETE /patient_profiles/1.xml
  def destroy
    @patient_profile = PatientProfile.find(params[:id])
    @patient_profile.destroy

    respond_to do |format|
      format.html { redirect_to(patient_profiles_url) }
      format.json { render :json => [] }
      format.xml  { head :ok }
    end
  end


  # GET /patient_profiles/search
  # GET /patient_profiles/search.xml
  def search
    @patient_profiles = PatientProfile.search(params[:query])
    @summary_array = @patient_profiles.collect do |profile|
      { :text => profile.diagnosis, :id => profile.id } 
    end

    respond_to do |format|
      format.json { render :json => @summary_array }
    end 
  end
end
