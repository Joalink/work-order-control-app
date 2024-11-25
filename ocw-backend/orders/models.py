from django.db import models
import datetime

class ShiftHours(models.Model):
    from_time = models.TimeField()
    to_time = models.TimeField()
    
    def __str__(self):
        return f'De {self.from_time} a {self.to_time}'


class Shift(models.Model):
    name = models.CharField(max_length=32)
    # hours = models.ForeignKey(ShiftHours, on_delete=models.SET_NULL, null=True)
    
    @property
    def shift_info(self):
        return f'{self.name}'.upper()
    
    def __str__(self):
        return f'{self.name}'.upper()
    
    
class Worker(models.Model):
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    shift = models.ForeignKey(Shift, on_delete=models.SET_NULL, null=True, related_name='shift_workers')
    
    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.upper()
        
    def __str__(self):
        return f'{self.first_name} {self.last_name}'.upper()
    
    
class Priority(models.Model):
    priority_num = models.CharField(max_length=16)
    days = models.PositiveIntegerField()
    
    def __str__(self):
        return f'{self.priority_num} | {self.days} días'
    
    
class ServiceType(models.Model):
    s_type = models.CharField(max_length=32)
    next_step = models.CharField(max_length=16)
    
    def __str__(self):
        return self.s_type
    

class GeneralStatus(models.Model):
    status = models.CharField(max_length=32)
    
    def __str__(self):
        return self.status
    
    
class WorkOrder(models.Model):
    num_of_order = models.IntegerField()
    description = models.TextField(max_length=256)
    area = models.CharField(max_length=32) 
    carried_by = models.CharField(max_length=32)
    authorized_by = models.CharField(max_length=32)
    num_of_pieces = models.PositiveIntegerField()
    assignment_date = models.DateField()
    priority = models.ForeignKey(Priority, on_delete=models.SET_NULL, related_name='priority_work_orders', null=True)
    service = models.ForeignKey(ServiceType, on_delete=models.SET_NULL, related_name='serviced_orders', null=True)
    need_material = models.BooleanField(default=False)
    delivery_date = models.DateField(null=True, blank=True)
    received_by = models.CharField(max_length=64, null=True, blank=True)
    delivered_by = models.CharField(max_length=32, null=True, blank=True)
    current_status = models.ForeignKey(GeneralStatus, on_delete=models.SET_NULL, related_name='status_work_orders', blank=False, null=True)

    @property
    def final_date(self):
        final_date = self.assignment_date + datetime.timedelta(days=self.priority.days)
        return final_date
    
    @property
    def total_days(self):
        if self.delivery_date:
            return (self.delivery_date - self.assignment_date).days
        return 'Order not delivered'
    
    @property
    def order_area(self):
        order_area = str(self.num_of_order) + ' | AREA: ' + self.area
        return order_area
    
    
    @property
    def PDF_name(self):
        order_area = f'{self.num_of_order}_{self.area.upper()}_{self.delivery_date.strftime("%d-%m-%Y")}'
        return order_area
    
    def __str__(self):
        return str(self.num_of_order) + ' | AREA ' + self.area
    

class CutOrder(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='cut_orders', blank=False)
    num_cut_order = models.PositiveIntegerField()
    material_type = models.CharField(max_length=128)
    material_quantity = models.CharField(max_length=128)
    request_date = models.DateField()
    delivery_date = models.DateField(blank=True, null=True)
    material_weight = models.DecimalField(decimal_places=2, max_digits=6, blank=True, null=True)
    observation = models.TextField(max_length=256, blank=True)
    
    
class AssignedWork(models.Model):
    work_order = models.ForeignKey(WorkOrder, on_delete=models.CASCADE, related_name='assigned_works', blank=False)
    shift = models.ForeignKey(Shift, on_delete=models.SET_NULL, related_name='shift_assigned_works', null=True)
    operator = models.ForeignKey(Worker, on_delete=models.SET_NULL, related_name='operator_assigned_works', null=True)
    work_processes = models.TextField(max_length=256)
    start_date = models.DateField(blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    
    @property
    def total_days(self):
        if self.end_date:
            return (self.end_date - self.start_date).days
        return 'Work not finished'
    