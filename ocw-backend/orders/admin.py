from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(WorkOrder)
admin.site.register(Worker)
admin.site.register(CutOrder)
admin.site.register(AssignedWork)
admin.site.register(Priority)
admin.site.register(ServiceType)
admin.site.register(Shift)
admin.site.register(GeneralStatus)
admin.site.register(ShiftHours)