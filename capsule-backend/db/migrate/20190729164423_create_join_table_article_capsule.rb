class CreateJoinTableArticleCapsule < ActiveRecord::Migration[5.2]
  def change
    create_join_table :articles, :capsules do |t|
      t.index [:article_id, :capsule_id]
      # t.index [:capsule_id, :article_id]
    end
  end
end
