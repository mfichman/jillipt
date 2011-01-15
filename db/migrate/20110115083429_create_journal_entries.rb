class CreateJournalEntries < ActiveRecord::Migration
  def self.up
    create_table :journal_entries do |t|
      t.text :text

      t.timestamps
    end
  end

  def self.down
    drop_table :journal_entries
  end
end
