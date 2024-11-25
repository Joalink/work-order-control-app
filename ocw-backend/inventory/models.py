from django.db import models

class Product(models.Model):
  identifier = models.CharField(max_length=10, blank=True, null=True, unique=True)
  name = models.CharField(max_length=50, blank=True, null=True)
  description = models.CharField(max_length=100, blank=True, null=True)

  def __str__(self):
    return self.name or "Unnamed Product"

class Location(models.Model):
  identifier = models.CharField(max_length=10, blank=False, null=False, unique=True)
  name = models.CharField(max_length=50, blank=True, null=True)

  def __str__(self):
    return self.name or "Unnamed Location"

class Stock(models.Model):
  product = models.ForeignKey(Product, to_field='identifier', on_delete=models.CASCADE)
  location = models.ForeignKey(Location, to_field='identifier', on_delete=models.CASCADE)
  quantity = models.IntegerField(blank=True, null=True, default=0)

  def __str__(self):
    return f"{self.product} at {self.location} - Quantity: {self.quantity}"

class StockMovement(models.Model):
  product = models.ForeignKey(Product, on_delete=models.CASCADE, to_field='identifier')
  quantity = models.IntegerField(blank=True, null=True, default=0)
  delivery = models.CharField(max_length=50, blank=True, null=True)
  reception = models.CharField(max_length=50, blank=True, null=True)
  date = models.DateTimeField(auto_now=True)

  def __str__(self):
    return f"Stock Movement for {self.product.product.name}"
1