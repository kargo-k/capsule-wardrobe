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
    @capsule = Capsule.find(params[:capsule_id])
    @capsule.articles << @article
    render json: @article
  end

  def update
    @article = Article.find(params[:id])
    @capsule = @article.capsules.find(params[:capsule_id])
    @article.capsules.delete(@capsule)
    render json: @article
  end

  def add
    @article = Article.find(params[:id])
    @capsule = Capsule.find(params[:capsule_id])
    @article.capsules << @capsule
    render json: @capsule
  end
end
