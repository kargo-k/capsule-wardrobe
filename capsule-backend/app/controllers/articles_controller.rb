class ArticlesController < ApplicationController
    def index
    @articles = Article.all
    render json: @articles
  end

  def show
    @article = Article.find(params[:id])
    render json: @article
  end

  def destroy
    @article = Article.find(params[:id])
    @article.destroy
    render json: Article.all
  end

  def create
    @article = Article.create(name: params[:name], category: params[:category], image: params[:image])
    render json: @article
  end

end
