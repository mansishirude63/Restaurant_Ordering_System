from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Delivery
from .serializers import DeliverySerializer



# Get delivery by order id
@api_view(['GET'])
def get_delivery_by_order(request, order_id):

    try:

        delivery = Delivery.objects.get(order_id=order_id)

        serializer = DeliverySerializer(delivery)

        return Response({
            "success": True,
            "delivery": serializer.data
        }, status=status.HTTP_200_OK)


    except Delivery.DoesNotExist:

        return Response({
            "success": False,
            "message": "Delivery not found"
        }, status=status.HTTP_404_NOT_FOUND)




# Get all deliveries
@api_view(['GET'])
def get_all_deliveries(request):

    deliveries = Delivery.objects.all()

    serializer = DeliverySerializer(
        deliveries,
        many=True
    )

    return Response({
        "success": True,
        "deliveries": serializer.data
    }, status=status.HTTP_200_OK)




# Update delivery status
@api_view(['PUT'])
def update_delivery(request, delivery_id):

    try:

        delivery = Delivery.objects.get(
            id=delivery_id
        )

    except Delivery.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Delivery not found"
            },
            status=404
        )


    serializer = DeliverySerializer(
        delivery,
        data=request.data,
        partial=True
    )


    if serializer.is_valid():

        updated_delivery = serializer.save()


        # Update related order status
        updated_delivery.order.status = updated_delivery.delivery_status
        updated_delivery.order.save()


        return Response(
            {
                "success": True,
                "message": "Delivery updated successfully",
                "delivery": serializer.data
            }
        )


    return Response(
        serializer.errors,
        status=400
    )

    try:

        delivery = Delivery.objects.get(
            id=delivery_id
        )


    except Delivery.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Delivery not found"
            },
            status=404
        )


    serializer = DeliverySerializer(
        delivery,
        data=request.data,
        partial=True
    )


    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Delivery updated successfully",
                "delivery": serializer.data
            }
        )


    return Response(
        serializer.errors,
        status=400
    )