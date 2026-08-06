from django.urls import path

from .views import (
    get_delivery_by_order,
    get_all_deliveries,
    update_delivery
)


urlpatterns = [

    # Get delivery using order id
    path(
        "order/<int:order_id>/",
        get_delivery_by_order,
        name="get_delivery_by_order"
    ),


    # Get all deliveries
    path(
        "",
        get_all_deliveries,
        name="get_all_deliveries"
    ),


    # Update delivery status
    path(
        "update/<int:delivery_id>/",
        update_delivery,
        name="update_delivery"
    ),

]