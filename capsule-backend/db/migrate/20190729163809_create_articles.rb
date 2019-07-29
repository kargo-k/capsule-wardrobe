class CreateArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :articles do |t|
      t.string :name
      t.string :category
      t.string :image
      t.string :price
      t.string :color
      t.timestamps
    end
  end
end
