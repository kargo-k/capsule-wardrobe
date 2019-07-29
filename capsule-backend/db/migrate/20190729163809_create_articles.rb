class CreateArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :articles do |t|
      t.string :name
      t.string :category
      t.string :image
      t.float :price
      t.string :color
      t.timestamps
    end
  end
end
