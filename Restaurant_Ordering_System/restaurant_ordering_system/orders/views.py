from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Order, OrderItem
from .serializers import OrderSerializer

from cart.models import Cart
from delivery.models import Delivery
from accounts.models import User



# Place Order
@api_view(['POST'])
def place_order(request):

    user_id = request.data.get("user")


    if not user_id:
        return Response(
            {
                "success": False,
                "message": "User id is required"
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    try:

        cart_items = Cart.objects.filter(
            user_id=user_id
        )


        if not cart_items.exists():

            return Response(
                {
                    "success": False,
                    "message": "Cart is empty"
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        total_price = 0


        for item in cart_items:

            total_price += (
                item.menu.price *
                item.quantity
            )



        user = User.objects.get(
            id=user_id
        )

        # Save new address if user entered one
        new_address = request.data.get("address")

        if new_address:
            user.address = new_address
            user.save()


        # Find delivery person automatically
        delivery_person = User.objects.filter(
            status="Staff"
        ).first()


        order = Order.objects.create(

            user=user,

            address=user.address,

            total_price=total_price

        )



        Delivery.objects.create(

            order=order,

            delivery_address=user.address,

            delivery_status="Preparing",

            delivery_person=(
                delivery_person.username
                if delivery_person
                else "Not Assigned"
            )

        )



        for item in cart_items:


            OrderItem.objects.create(

                order=order,

                menu=item.menu,

                quantity=item.quantity,

                price=item.menu.price

            )



        cart_items.delete()



        serializer = OrderSerializer(order)



        return Response(

            {
                "success": True,

                "message": "Order placed successfully",

                "order": serializer.data
            },

            status=status.HTTP_201_CREATED
        )



    except Exception as e:


        return Response(

            {
                "success": False,

                "error": str(e)

            },

            status=status.HTTP_400_BAD_REQUEST

        )

# Get All Orders
@api_view(['GET'])
def get_all_orders(request):

    orders = Order.objects.all()


    serializer = OrderSerializer(
        orders,
        many=True
    )


    return Response(
        {
            "success": True,
            "orders": serializer.data
        },
        status=status.HTTP_200_OK
    )

# Get Orders By User (Customer)
@api_view(['GET'])
def get_user_orders(request, user_id):

    try:

        orders = Order.objects.filter(
            user_id=user_id
        )


        serializer = OrderSerializer(
            orders,
            many=True
        )


        return Response(
            {
                "success": True,
                "orders": serializer.data
            },
            status=status.HTTP_200_OK
        )


    except Exception as e:

        return Response(
            {
                "success": False,
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )



# Get Order By Id
@api_view(['GET'])
def get_order_by_id(request, order_id):

    try:

        order = Order.objects.get(
            id=order_id
        )


        serializer = OrderSerializer(order)


        return Response(
            {
                "success": True,
                "order": serializer.data
            }
        )


    except Order.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Order not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )




# Update Order
@api_view(['PUT'])
def update_order(request, order_id):

    try:

        order = Order.objects.get(
            id=order_id
        )


    except Order.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Order not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )



    serializer = OrderSerializer(
        order,
        data=request.data,
        partial=True
    )


    if serializer.is_valid():

        serializer.save()


        return Response(
            {
                "success": True,
                "message": "Order updated successfully",
                "order": serializer.data
            }
        )


    return Response(
        {
            "success": False,
            "errors": serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )




# Delete Order
@api_view(['DELETE'])
def delete_order(request, order_id):

    try:

        order = Order.objects.get(
            id=order_id
        )


        order.delete()


        return Response(
            {
                "success": True,
                "message": "Order deleted successfully"
            }
        )


    except Order.DoesNotExist:

        return Response(
            {
                "success": False,
                "message": "Order not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )