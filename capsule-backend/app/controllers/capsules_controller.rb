class CapsulesController < ApplicationController
  def index
    @capsules = Capsule.all
    render json: @capsules
  end

  def show
    @capsule = Capsule.find(params[:id])
    render json: @capsule
  end

  def destroy
    @capsule = Capsule.find(params[:id])
    @capsule.destroy
    render json: Capsule.all
  end

  def create
    @capsule = Capsule.create(name: params[:name], season: params[:season], style: params[:style])    render json: @capsule
  end
end
