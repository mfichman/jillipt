require 'test_helper'

class PatientProfilesControllerTest < ActionController::TestCase
  setup do
    @patient_profile = patient_profiles(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:patient_profiles)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create patient_profile" do
    assert_difference('PatientProfile.count') do
      post :create, :patient_profile => @patient_profile.attributes
    end

    assert_redirected_to patient_profile_path(assigns(:patient_profile))
  end

  test "should show patient_profile" do
    get :show, :id => @patient_profile.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @patient_profile.to_param
    assert_response :success
  end

  test "should update patient_profile" do
    put :update, :id => @patient_profile.to_param, :patient_profile => @patient_profile.attributes
    assert_redirected_to patient_profile_path(assigns(:patient_profile))
  end

  test "should destroy patient_profile" do
    assert_difference('PatientProfile.count', -1) do
      delete :destroy, :id => @patient_profile.to_param
    end

    assert_redirected_to patient_profiles_path
  end
end
