

def general_status(order):
    if order.delivery_date:
            return 'Entregado'
    if order.assigned_works.all():
        if order.assigned_works.all().first().start_date:
            return 'Trabajo terminado'
        return 'En proceso de trabajo'
    if not order.need_material:
        return 'Trabajo por realizar'
    if not order.cut_orders.all():
        return 'Material pendiente'
    for cut_order in order.cut_orders.all():
        if not cut_order.delivery_date:
            return 'Material pendiente'
    return 'Trabajo por realizar'


def cut_order(order):
        if not order.need_material:
            return 'No necesita'
        cut_orders = order.cut_orders.all()
        if not cut_orders:
            return 'No asignada'
        orders_count = cut_orders.count()
        if orders_count == 1:
            return cut_orders.last().num_cut_order
        count = 0
        for cut_order in cut_orders:
            if cut_order.delivery_date:
                count += 1
        return f'{count} de {orders_count}'
    
    
def material_status(order):
        if not order.need_material:
            return 'No necesita'
        cut_orders = order.cut_orders.all()
        if not cut_orders:
            return 'No solicitado'
        orders_count = cut_orders.count()
        if orders_count == 1:
            if cut_orders.first().delivery_date:
                return 'Entregado'
            return 'Solicitado'
        count = 0
        for cut_order in cut_orders:
            if cut_order.delivery_date:
                count += 1
        if orders_count == count:
            return 'Entregados'
        return f'{count} de {orders_count}'
    
    
def is_work_to_perform(order):
    return general_status(order) == 'Trabajo por realizar'


def check_deliveries(order):
    for cut in order.cut_orders.all():
        if not cut.delivery_date:
            return False
    return True
        