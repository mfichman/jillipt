require 'test_helper'

class JournalEntriesControllerTest < ActionController::TestCase
  setup do
    @journal_entry = journal_entries(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:journal_entries)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create journal_entry" do
    assert_difference('JournalEntry.count') do
      post :create, :journal_entry => @journal_entry.attributes
    end

    assert_redirected_to journal_entry_path(assigns(:journal_entry))
  end

  test "should show journal_entry" do
    get :show, :id => @journal_entry.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @journal_entry.to_param
    assert_response :success
  end

  test "should update journal_entry" do
    put :update, :id => @journal_entry.to_param, :journal_entry => @journal_entry.attributes
    assert_redirected_to journal_entry_path(assigns(:journal_entry))
  end

  test "should destroy journal_entry" do
    assert_difference('JournalEntry.count', -1) do
      delete :destroy, :id => @journal_entry.to_param
    end

    assert_redirected_to journal_entries_path
  end
end
