public with sharing class OrderProductsController {
    public OrderProductsController() {

    }

    //cacheable=false, to be allowed to execute DML operations
    @auraEnabled(cacheable=false)
    public static void getActivateOrder(List<AvailableProductsController.ProductWithPrice> pwpList, Id orderId){
        List<OrderItem> orderItemList = new List<OrderItem>();
        
        for(AvailableProductsController.ProductWithPrice pwp : pwpList){
            System.debug('LGM - id : ' + pwp.id);
            System.debug('LGM - name : ' + pwp.name);
            System.debug('LGM - quantity : ' + pwp.quantity);
            System.debug('LGM - unitPrice : ' + pwp.unitPrice);
            System.debug('LGM - totalPrice : ' + pwp.totalPrice);


            Order ord = [SELECT id, Pricebook2Id from Order where id =: orderId];
            PriceBook2 pb2Standard = [select Id from Pricebook2 where isStandard=true];

            Id standardPriceBookId = pb2Standard.Id;
        
            if (ord.Pricebook2Id == null) {
                ord.Pricebook2Id = standardPriceBookId;
                update ord;
            }
            

            //oi.product2 = new Product2(id = pwp.id);
            
            OrderItem oi = new OrderItem();
            oi.PricebookEntryId = [select id from pricebookentry where Pricebook2Id = :ord.Pricebook2Id].get(0).id;
            oi.product2 = [select id from product2 where id =: pwp.id];
            oi.unitPrice = pwp.unitPrice;
            oi.quantity = pwp.quantity;
            oi.orderId = orderId;
            orderItemList.add(oi);
        }

        insert orderItemList;

        ord.status = 'Activated';
        update ord;
    }
}
