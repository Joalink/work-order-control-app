from django.shortcuts import render, get_object_or_404
from django.db.models import Count, Q
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse, JsonResponse
from xhtml2pdf import pisa
from django.template.loader import render_to_string, get_template
from .serializer import *
from .models import WorkOrder, CutOrder, AssignedWork, GeneralStatus, ServiceType, Priority, Worker, Shift
from .utils import is_work_to_perform, check_deliveries
import os

# Handle creation and updates of work orders
class WorkOrdersView(viewsets.ModelViewSet):
    serializer_class = WorkOrderSerializer
    queryset = WorkOrder.objects.all()
    
    def perform_create(self, serializer):
        need_material = serializer.validated_data.get('need_material')
        if need_material:
            current_status = 'Material pendiente'
        else:
            current_status = 'Trabajo por realizar'
        
        new_order = serializer.save()
        new_order.current_status = GeneralStatus.objects.get(status=current_status)
        new_order.save()
        
    def perform_update(self, serializer):
        updated_order = serializer.save()
        updated_order.current_status = GeneralStatus.objects.get(status='Entregado')
        updated_order.save()
        
        
class WorkerView(viewsets.ModelViewSet):
    serializer_class = WorkerSerializer
    queryset = Worker.objects.all()
    
        
# Handle creation and updates of cut orders
class CutOrdersView(viewsets.ModelViewSet):
    serializer_class = CutOrderSerializer
    queryset = CutOrder.objects.all()
    
    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            serializer = self.get_serializer(data=request.data, many=True)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def perform_create(self, serializer):
        serializer.save()
        
        order = serializer.validated_data.get('work_order')
        order.current_status = GeneralStatus.objects.get(status='Material pendiente')
        order.save()
        
    def perform_update(self, serializer):
        serializer.save()
        order = serializer.validated_data.get('work_order')
        if check_deliveries(order):
            order.current_status = GeneralStatus.objects.get(status='Trabajo por realizar')
            order.save()
        
# Handle creation and updates of assigned works
class WorksView(viewsets.ModelViewSet):
    serializer_class = WorksSerializer
    queryset = AssignedWork.objects.all()
    
    def perform_create(self, serializer):
        serializer.save()
        order = serializer.validated_data.get('work_order')
        order.current_status = GeneralStatus.objects.get(status='En proceso de trabajo')
        order.save()
        
    def perform_update(self, serializer):
        serializer.save()
        order = serializer.validated_data.get('work_order')
        order.current_status = GeneralStatus.objects.get(status='Trabajo terminado')
        order.save()
    
        
class MainTableView(generics.ListAPIView):
    serializer_class = MainTableSerializer
    queryset = WorkOrder.objects.filter(delivery_date__isnull=True).all().order_by('-assignment_date')
    
main_table_view = MainTableView.as_view()
    
    
class CutTableView(generics.ListAPIView):
    serializer_class = CutTableSerializer

    def get_queryset(self):
        queryset = WorkOrder.objects.filter(delivery_date__isnull=True, need_material=True).all()
        
        return queryset
    
cut_table_view = CutTableView.as_view()
    

class ProcessTableView(generics.ListAPIView):
    serializer_class = ProcessTableSerializer
    
    def get_queryset(self):
        to_perform = GeneralStatus.objects.get(status='Trabajo por realizar')
        in_process = GeneralStatus.objects.get(status='En proceso de trabajo')
        queryset = WorkOrder.objects.filter(Q(current_status=to_perform) | Q(current_status=in_process)).all()
        
        return queryset

process_table_view = ProcessTableView.as_view()
    

class CutsByOrderTableView(generics.ListAPIView):
    serializer_class = CutsByOrderSerializer
    def get_queryset(self):
        # Access the 'category_id' from the URL
        work_order_pk = self.kwargs.get('order_pk')

        if work_order_pk:
        
            queryset = CutOrder.objects.filter(work_order=work_order_pk)

        else: 
            queryset = CutOrder.objects.all()
        
        return queryset

cuts_by_order_table_view = CutsByOrderTableView.as_view()


class NewOrderFormView(APIView):
    def get(self, request, *args, **kwargs):
        
        service_serializer = ServiceSerializer(ServiceType.objects.all(), many=True)
        priority_serializer = PrioritySerializer(Priority.objects.all(), many=True)

        service_priority = {
            'services': service_serializer.data,
            'priorities': priority_serializer.data
        }
    
        return Response(service_priority, status=status.HTTP_200_OK)
    
new_order_form_view = NewOrderFormView.as_view()


class FinishedOrdersView(generics.ListAPIView):
    serializer_class = FinishedOrdersSerializer
    def get_queryset(self):
        finished = GeneralStatus.objects.get(status='Entregado')
        queryset = WorkOrder.objects.filter(current_status=finished).all()
        
        return queryset

finished_orders_view = FinishedOrdersView.as_view()


class OrdersForCutView(generics.ListAPIView):
    serializer_class = OrdersForCutSerializer
    def get_queryset(self):
        orders_with_work = WorkOrder.objects.annotate(works=Count('assigned_works'))
        queryset = orders_with_work.filter(delivery_date__isnull=True, need_material=True, works=0).all()
        
        return queryset
        
orders_for_cut_view = OrdersForCutView.as_view()


class MaterialForDeliveryView(generics.ListAPIView):
    serializer_class = MaterialForDeliverySerializer
    queryset = CutOrder.objects.filter(delivery_date__isnull=True).all()
    
material_for_delivery_view = MaterialForDeliveryView.as_view()


class WorkToAssignView(APIView):
    def get(self, request, *args, **kwargs):
        
        to_perform = GeneralStatus.objects.get(status='Trabajo por realizar')
        
        orders_serializer = SimpleOrderSerializer(WorkOrder.objects.filter(current_status=to_perform).all(), many=True, read_only=True)
        shift_w_serializer = ShiftWorkersSerializer(Shift.objects.all(), many=True, read_only=True)

        orders_shift_w = {
            'orders': orders_serializer.data,
            'shift_workers': shift_w_serializer.data
        }
    
        return Response(orders_shift_w, status=status.HTTP_200_OK)
    
work_to_assign_view = WorkToAssignView.as_view()


class WorkToFinishView(generics.ListAPIView):
    serializer_class = WorkToFinishSerializer
    queryset = AssignedWork.objects.filter(end_date__isnull=True).all()
    
work_to_finish_view = WorkToFinishView.as_view()
    

class OrderToConcludeView(generics.ListAPIView):
    serializer_class = OrderToConcludeSerializer
    
    def get_queryset(self):
        finished_work = GeneralStatus.objects.get(status='Trabajo terminado')
        queryset = WorkOrder.objects.filter(current_status=finished_work).all()
        
        return queryset
    
order_to_conclude_view = OrderToConcludeView.as_view()

class GeneratePDFView(APIView):

    def get(self, request, *args, **kwargs):
        
        order = get_object_or_404(WorkOrder.objects.filter(current_status=GeneralStatus.objects.get(status='Entregado')), id=self.kwargs.get('id'))
        
        order_data = {
            "num_of_order": order.num_of_order,
            "area": order.area,
            "description": order.description,
            "carried_by": order.carried_by,
            "authorized_by": order.authorized_by,
            "num_of_pieces": order.num_of_pieces,
            "assignment_date": order.assignment_date.strftime("%d/%m/%Y") if order.assignment_date else None,
            "priority_num": order.priority.priority_num if order.priority else None,
            "service_type": order.service.s_type if order.service else None,
            "need_material": "Sí necesitó" if order.need_material else "No necesitó",
            "delivery_date": order.delivery_date.strftime("%d/%m/%Y") if order.delivery_date else None,
            "received_by": order.received_by,
            "delivered_by": order.delivered_by,
            "assigned_work": {
                "shift_name": order.assigned_works.first().shift.name if order.assigned_works.exists() else None,
                "operator_full_name": order.assigned_works.first().operator.full_name if order.assigned_works.exists() else None,
                "work_processes": order.assigned_works.first().work_processes if order.assigned_works.exists() else None,
                "start_date": order.assigned_works.first().start_date.strftime("%d/%m/%Y") if order.assigned_works.exists() else None,
                "start_time": order.assigned_works.first().start_time if order.assigned_works.exists() else None,
                "end_date": order.assigned_works.first().end_date.strftime("%d/%m/%Y") if order.assigned_works.exists() else None,
                "end_time": order.assigned_works.first().end_time if order.assigned_works.exists() else None,
                "total_days": order.assigned_works.first().total_days if order.assigned_works.exists() else None,
            },
            "cut_orders": [
                {
                    "num_cut_order": cut_order.num_cut_order,
                    "material_type": cut_order.material_type,
                    "material_quantity": cut_order.material_quantity,
                    "request_date": cut_order.request_date.strftime("%d/%m/%Y") if cut_order.request_date else None,
                    "delivery_date": cut_order.delivery_date.strftime("%d/%m/%Y") if cut_order.delivery_date else None,
                    "material_weight": cut_order.material_weight,
                    "observation": cut_order.observation,
                }
                for cut_order in order.cut_orders.all()
            ]
        }
        return JsonResponse(order_data)
generate_pdf_view = GeneratePDFView.as_view()
