class Article < ApplicationRecord
  validates :image, {uniqueness: true}
  has_and_belongs_to_many :capsules
end
