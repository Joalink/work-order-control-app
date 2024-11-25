from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from orders import views

# api versioning
router = routers.DefaultRouter()
router.register(r'orders', views.WorkOrdersView, basename='orders_view')
router.register(r'cuts', views.CutOrdersView, basename='cuts_view')
router.register(r'works', views.WorksView, basename='works_view')
router.register(r'workers', views.WorkerView, basename='worker_view')

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("api/main_table/", views.main_table_view),
    path("api/cut_table/", views.cut_table_view),
    path("api/process_table/", views.process_table_view),
    path("api/cuts_order_table/<int:order_pk>", views.cuts_by_order_table_view),
    path("api/cuts_order_table/", views.cuts_by_order_table_view),
    path("api/order_form/", views.new_order_form_view),
    path("api/finished_orders/", views.finished_orders_view),
    path("api/orders_for_cut/", views.orders_for_cut_view),
    path("api/mat_for_deli/", views.material_for_delivery_view),
    path("api/work_to_assign/", views.work_to_assign_view),
    path("api/work_to_finish/", views.work_to_finish_view),
    path("api/order_to_conclude/", views.order_to_conclude_view),
    path("api/generate_PDF/<int:id>/", views.generate_pdf_view),
    path('docs', include_docs_urls(title="Orders API")),
]