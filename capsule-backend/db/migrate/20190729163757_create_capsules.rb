class CreateCapsules < ActiveRecord::Migration[5.2]
  def change
    create_table :capsules do |t|
      t.integer :user_id
      t.string :name
      t.string :season
      t.string :style
      t.timestamps
    end
  end
end
