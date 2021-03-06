module Api
  class LessonsController < ApplicationController
    before_action :authenticate_teacher!, except: [:index, :show]

    def index
      lessons = Lessons::List.call(index_params)

      render json: lessons, status: :ok
    end

    def create
      lesson = Lessons::Create.call(create_params)

      render json: lesson, status: :ok
    end

    def update
      updated = Lessons::Update.call(update_params)

      render json: updated, status: :ok
    end

    def show
      lesson = Lessons::Get.call(show_params)

      render json: lesson, status: :ok
    end

    def destroy
      lesson = Lessons::Delete.call(destroy_params)

      render json: lesson, status: :ok
    end

    private

    def index_params
      params.permit(:query)
    end

    def create_params
      params[:lesson].permit(:name, :description, :link, :image).merge(teacher: current_teacher)
    end

    def update_params
      params[:lesson].permit(:name, :description, :link, :image).merge(params.permit(:id))
    end

    def show_params
      params.permit(:id)
    end

    def destroy_params
      params.permit(:id)
    end
  end
end
