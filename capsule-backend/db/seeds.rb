require 'pry'
require 'nokogiri'
require 'open-uri'

User.delete_all
Capsule.delete_all
Article.delete_all

#Create dummy users
user1 = User.create(username: 'Kargo', location: 'Seattle')
user2 = User.create(username: 'Mittens', location: 'Seattle')

#Create dummy capsules
capsule1 = Capsule.create(user_id: User.first.id, name: 'Spring 2019', season: 'Spring', style: 'Casual')
capsule2 = Capsule.create(user_id: User.first.id, name: 'Business Guru Outfits', season: 'Fall', style: 'Business Casual')
capsule3 = Capsule.create(user_id: User.second.id, name: 'Lookin\' Spiffy!', season: 'Summer', style: 'Athleisure')
capsule4 = Capsule.create(user_id: User.second.id, name: 'My Capsule Collection', season: 'Winter', style: 'Casual')

# scraping uniqlo webpages
def scraper(url, category)

  doc = Nokogiri::HTML(open(url))
  search_results = doc.css("ul.search-result-items")

  search_results.each do |result|
    article_grid = result.css('div.product-tile-info')
    article_grid.each_with_index do |article, index|
      article_name = article.css("div.product-name a[title]").text.strip
      article_image = article.css("div.product-image a.thumb-link img")
      image = article_image.xpath('//div["product-image"]/a/img/@src')[index]
      article_price = article.css("div.product-pricing span.product-sales-price").text
      Article.create(name: article_name, image: image, price: article_price, category: category)
    end
  end
end


# t-shirts and tops
scraper('https://www.uniqlo.com/us/en/women/t-shirts-and-tops', 'top')

# # shirts and blouses
scraper('https://www.uniqlo.com/us/en/women/shirts-and-blouses', 'top')

# # all dresses and jumpsuits
scraper('https://www.uniqlo.com/us/en/women/dresses-and-jumpsuits', 'dress')

# # skirts
scraper('https://www.uniqlo.com/us/en/women/skirts', 'skirt')

# # pants
scraper('https://www.uniqlo.com/us/en/women/pants', 'pants')

# # jeans
scraper('https://www.uniqlo.com/us/en/women/jeans', 'jeans')

# # sweaters and cardis 
scraper('https://www.uniqlo.com/us/en/women/sweaters-and-cardigans', 'sweater')

# # outerwear
scraper('https://www.uniqlo.com/us/en/women/outerwear-and-blazers', 'outerwear')

# # accessories (and shoes)
scraper('https://www.uniqlo.com/us/en/women/accessories-and-shoes', 'accessory')



5.times do 
  capsule1.articles << Article.all.sample
end

9.times do 
  capsule2.articles << Article.all.sample
end

33.times do 
  capsule3.articles << Article.all.sample
end

7.times do 
  capsule4.articles << Article.all.sample
end