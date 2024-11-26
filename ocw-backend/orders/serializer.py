from rest_framework import serializers
from .models import WorkOrder, CutOrder, AssignedWork, Shift, ServiceType, Priority, Worker
from .utils import general_status, cut_order, material_status

class WorkOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkOrder
        fields = '__all__'
        
        
class CutOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CutOrder
        fields = '__all__'
        

class WorksSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignedWork
        fields = '__all__'
        
        
class PrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = Priority
        fields = '__all__'
        
        
class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = '__all__'
        
        
class WorkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Worker
        fields = '__all__'
        
        
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = '__all__'
        
        
class SimpleWorkerSerializer(serializers.ModelSerializer):
    shift = serializers.SerializerMethodField() 
    
    class Meta:
        model = Worker
        fields = ('id', 'full_name','shift')
        
    def get_shift(self, obj):
        return obj.shift.name.upper()
        

class MainTableSerializer(serializers.ModelSerializer):
    general_status = serializers.SerializerMethodField()
    cut_order = serializers.SerializerMethodField() 
    material_status = serializers.SerializerMethodField()
    shift = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()
    
    class Meta:
        model = WorkOrder
        fields = ('num_of_order', 'description', 'service', 'final_date', 'material_status', 'cut_order', 'general_status', 'shift', 'assignment_date', 'id')
        
    def get_general_status(self, obj):
        return obj.current_status.status

    def get_cut_order(self, obj):
        return cut_order(obj)
        
    def get_material_status(self, obj):
        return material_status(obj)
    
    def get_shift(self, obj):
        if obj.assigned_works.all():
            return obj.assigned_works.first().shift.name
        return 'Not assigned'
    
    def get_service(self, obj):
        return obj.service.s_type
        
    
class CutTableSerializer(serializers.ModelSerializer):
    cut_order = serializers.SerializerMethodField() 
    material_status = serializers.SerializerMethodField()
    assigned_cuts = serializers.SerializerMethodField()
    
    class Meta:
        model = WorkOrder
        fields = ('id', 'num_of_order', 'description', 'num_of_pieces', 'cut_order', 'material_status', 'assigned_cuts')
        
    def get_cut_order(self, obj):
        return cut_order(obj)
        
    def get_material_status(self, obj):
        return material_status(obj)
    
    def get_assigned_cuts(self, obj):
        if obj.cut_orders.all():
            return obj.cut_orders.all().count()
        return 0
    
    
class ProcessTableSerializer(serializers.ModelSerializer): 
    general_status = serializers.SerializerMethodField()
    material_status = serializers.SerializerMethodField()
    shift = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()
    priority = serializers.SerializerMethodField()
    
    class Meta:
        model = WorkOrder
        fields = ('num_of_order', 'description', 'priority', 'service', 'general_status', 'material_status', 'shift', 'id')
        
    def get_general_status(self, obj):
        return obj.current_status.status
    
    def get_material_status(self, obj):
        return material_status(obj)
    
    def get_service(self, obj):
        return obj.service.s_type
    
    def get_shift(self, obj):
        if obj.assigned_works.all():
            return obj.assigned_works.first().shift.name
        return 'Not assigned'
    
    def get_priority(self, obj):
        return obj.priority.priority_num + ' | ' + str(obj.priority.days) + 'd'
    
    
class CutsByOrderSerializer(serializers.ModelSerializer):
    work_order = serializers.SerializerMethodField() 
    material_status = serializers.SerializerMethodField()
    
    class Meta:
        model = CutOrder
        fields = ('work_order', 'num_cut_order', 'material_status', 'material_type', 'material_quantity', 'id', 'observation')
        
        
    def get_material_status(self, obj):
        if obj.delivery_date:
            return 'Delivered'
        return 'Delivered'
    
    def get_work_order(self, obj):
        return obj.work_order.num_of_order
    
class FinishedOrdersSerializer(serializers.ModelSerializer):
    service = serializers.SerializerMethodField() 
    
    class Meta:
        model = WorkOrder
        fields = ('id' ,'num_of_order', 'description', 'delivery_date', 'service', 'area', 'num_of_pieces')
        
    def get_service(self, obj):
        return obj.service.s_type
        
        
class OrdersForCutSerializer(serializers.ModelSerializer):
    order_with_area = serializers.SerializerMethodField() 
    
    class Meta:
        model = WorkOrder
        fields = ('id', 'order_with_area', 'description', 'num_of_pieces')
        
    def get_order_with_area(self, obj):
        return str(obj.num_of_order) + ' | area: ' + obj.area
    
    
class MaterialForDeliverySerializer(serializers.ModelSerializer):
    order_with_area = serializers.SerializerMethodField() 
    num_pieces = serializers.SerializerMethodField() 
    
    class Meta: 
        model = CutOrder
        fields = ('id', 'num_cut_order', 'order_with_area', 'num_pieces', 'material_type', 'material_quantity', 'request_date','work_order')
        
    def get_order_with_area(self, obj):
        return str(obj.work_order.num_of_order) + ' | area: ' + obj.work_order.area
    
    def get_num_pieces(self, obj):
        return obj.work_order.num_of_pieces
    
    
class SimpleOrderSerializer(serializers.ModelSerializer):
    order_with_area = serializers.SerializerMethodField()
    
    class Meta: 
        model = WorkOrder
        fields = ('id', 'order_with_area', 'description', 'service', 'assignment_date' )
    
    def get_order_with_area(self, obj):
        return str(obj.num_of_order) + ' | area: ' + obj.area
    
    
class ShiftWorkersSerializer(serializers.ModelSerializer):
    shift_workers = SimpleWorkerSerializer(many=True, read_only=True)
    class Meta: 
        model = Shift
        fields = ('id', 'name', 'shift_workers')
        
        
class WorkToFinishSerializer(serializers.ModelSerializer):
    description = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()
    assignment_date = serializers.SerializerMethodField()
    order_area = serializers.SerializerMethodField()
    operator = serializers.SerializerMethodField()
    shift = serializers.SerializerMethodField()
    
    class Meta:
        model = AssignedWork
        fields = ('id', 'order_area', 'description', 'service', 'shift', 'operator', 'work_processes', 'assignment_date','work_order')
        
    def get_description(self, obj):
        return obj.work_order.description
    
    def get_service(self, obj):
        return obj.work_order.service.s_type
    
    def get_assignment_date(self, obj):
        return obj.work_order.assignment_date
    
    def get_order_area(self, obj):
        return obj.work_order.order_area
    
    def get_operator(self, obj):
        return obj.operator.full_name
    
    def get_shift(self, obj):
        return obj.shift.name.upper()
    
    
class OrderToConcludeSerializer(serializers.ModelSerializer):
    work_end_date = serializers.SerializerMethodField()
    work_shift = serializers.SerializerMethodField()
    work_worker = serializers.SerializerMethodField()
    work_processes = serializers.SerializerMethodField()
    current_status = serializers.SerializerMethodField()
    service = serializers.SerializerMethodField()
    need_material = serializers.SerializerMethodField()
    
    
    class Meta:
        model = WorkOrder
        fields = ('id', 'num_of_order', 'description', 'current_status', 'service', 'assignment_date', 
                    'work_end_date', 'work_shift', 'work_worker', 'work_processes', 'need_material')
        
    def get_work_end_date(self, obj):
        return obj.assigned_works.last().end_date
    
    def get_work_shift(self, obj):
        return obj.assigned_works.last().shift.name
    
    def get_work_worker(self, obj):
        return obj.assigned_works.last().operator.full_name
    
    def get_work_processes(self, obj):
        return obj.assigned_works.last().work_processes
    
    def get_current_status(self, obj):
        return obj.current_status.status
    
    def get_service(self, obj):
        return obj.service.s_type
    
    def get_need_material(self, obj):
        if obj.need_material:
            return 'Yes'
        return 'No'
    