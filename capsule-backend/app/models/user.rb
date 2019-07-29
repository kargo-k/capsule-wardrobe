class User < ApplicationRecord
  validates :username, {presence: true, uniqueness: true}
  has_many :capsules
  has_many :articles, through: :capsules
end
