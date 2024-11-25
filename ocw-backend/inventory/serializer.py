from rest_framework import serializers
from .models import Product, Location, Stock, StockMovement

class ProductsSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Location
    fields = '__all__'

class StockSerializer(serializers.ModelSerializer):


  class Meta:
    model = Stock
    fields = '__all__'
    

class StockMovementSerializer(serializers.ModelSerializer):
  date = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
  class Meta:
    model = StockMovement
    fields = '__all__'
