from django.db import models
from orders.models import Order


class Delivery(models.Model):

    STATUS_CHOICES = [

        ("Preparing", "Preparing"),
        ("Out for Delivery", "Out for Delivery"),
        ("Delivered", "Delivered"),

    ]


    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name="delivery"
    )


    delivery_address = models.TextField(
        blank=True,
        null=True
    )


    delivery_person = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )


    delivery_status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="Preparing"
    )


    def save(self, *args, **kwargs):

        super().save(*args, **kwargs)

        # Update order status automatically
        self.order.status = self.delivery_status
        self.order.save()


    def __str__(self):
        return f"Delivery {self.order.id}"