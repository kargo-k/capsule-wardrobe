class CapsulesController < ApplicationController
  def index
    @capsules = Capsule.all
    render json: @capsules
  end

  def show
    @capsule = Capsule.find(params[:id])
    @articles = @capsule.articles
    render json: [@capsule, @articles]
  end

  def destroy
    @capsule = Capsule.find(params[:id])
    @capsule.destroy
    render json: Capsule.all
  end

  def create
    @capsule = Capsule.create(name: params[:name], season: params[:season], style: params[:style], user_id: params[:user_id])
    render json: @capsule
  end
end
