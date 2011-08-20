class AddTopicToFlashCard < ActiveRecord::Migration
  def self.up
    change_table :flash_cards do |t|
      t.text :topic
    end
    FlashCard.update_all ["topic = ?", "Unknown"]
  end

  def self.down
    remove_column :flash_cards, :topic
  end
end
