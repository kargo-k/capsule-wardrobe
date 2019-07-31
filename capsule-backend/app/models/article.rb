class Article < ApplicationRecord
  validates :name, presence: true
  validates :image, {uniqueness: true}
  has_and_belongs_to_many :capsules
end
