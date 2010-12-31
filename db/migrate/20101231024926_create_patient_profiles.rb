class CreatePatientProfiles < ActiveRecord::Migration
  def self.up
    create_table :patient_profiles do |t|
      t.text :diagnosis
      t.text :modalities
      t.text :exercises
      t.text :tests
      t.text :other

      t.timestamps
    end
  end

  def self.down
    drop_table :patient_profiles
  end
end
