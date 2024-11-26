

def general_status(order):
    if order.delivery_date:
            return 'Delivered'
    if order.assigned_works.all():
        if order.assigned_works.all().first().start_date:
            return 'Work completed'
        return 'In process of work'
    if not order.need_material:
        return 'Work to be performed'
    if not order.cut_orders.all():
        return 'Material pending'
    for cut_order in order.cut_orders.all():
        if not cut_order.delivery_date:
            return 'Material pending'
    return 'Work to be performed'


def cut_order(order):
        if not order.need_material:
            return 'No need for'
        cut_orders = order.cut_orders.all()
        if not cut_orders:
            return 'Not assigned'
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
            return 'No need for'
        cut_orders = order.cut_orders.all()
        if not cut_orders:
            return 'Not requested'
        orders_count = cut_orders.count()
        if orders_count == 1:
            if cut_orders.first().delivery_date:
                return 'Delivered'
            return 'Solicitado'
        count = 0
        for cut_order in cut_orders:
            if cut_order.delivery_date:
                count += 1
        if orders_count == count:
            return 'Delivered'
        return f'{count} de {orders_count}'
    
    
def is_work_to_perform(order):
    return general_status(order) == 'Work to be performed'


def check_deliveries(order):
    for cut in order.cut_orders.all():
        if not cut.delivery_date:
            return False
    return True
        