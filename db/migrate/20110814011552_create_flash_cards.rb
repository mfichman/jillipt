class CreateFlashCards < ActiveRecord::Migration
  def self.up
    create_table :flash_cards do |t|
      t.text :front
      t.text :back

      t.timestamps
    end
  end

  def self.down
    drop_table :flash_cards
  end
end
