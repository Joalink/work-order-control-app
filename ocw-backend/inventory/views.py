from rest_framework import viewsets
from .serializer import *
from .models import Product, Location, Stock, StockMovement
from rest_framework.status import HTTP_201_CREATED, HTTP_200_OK
from rest_framework.response import Response

# Create your views here.
class ProductView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductsSerializer

class LocationView(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class StockView(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

    def create(self, request, *args, **kwargs):
        data = request.data

        # Assuming data is for a single stock entry:
        product = data.get('product')
        location = data.get('location')
        quantity = int(data.get('quantity', 0))

        # Check if stock already exists
        stock, created = Stock.objects.get_or_create(
            product_id=product,
            location_id=location,
            defaults={'quantity': quantity}
        )

        if not created:  # If the stock exists, update the quantity
            stock.quantity += quantity
            stock.save()

        serializer = self.get_serializer(stock)
        status = HTTP_201_CREATED if created else HTTP_200_OK
        return Response(serializer.data, status=status)

class StockMovementView(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
