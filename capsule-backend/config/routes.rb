Rails.application.routes.draw do
  resources :articles
  resources :capsules
  resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  patch '/articles/:id/add', to: 'articles#add'
end
