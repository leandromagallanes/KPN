public with sharing class OrderProductsController {
    public OrderProductsController() {

    }

    //cacheable=false, to be allowed to execute DML operations
    @auraEnabled(cacheable=false)
    public static void getActivateOrder(List<AvailableProductsController.ProductWithPrice> pwpList, Id orderId){
        List<OrderItem> orderItemList = new List<OrderItem>();
        Order ord = [SELECT id, Pricebook2Id, status from Order where id =: orderId];
        PriceBook2 pb2Standard = [select Id from Pricebook2 where isStandard=true];

        Map<Id,PricebookEntry> pricebookEntryByPricebookId = new Map<Id,PricebookEntry>();

        List<pricebookentry> pbeList = [select id, Pricebook2.id from pricebookentry];
        for(pricebookentry pbe : pbeList){
            pricebookEntryByPricebookId.put(pbe.pricebook2.id, pbe);
        }
        Map<Id,Product2> productById = new Map<id,product2>([select id from Product2]);



        for(AvailableProductsController.ProductWithPrice pwp : pwpList){
            System.debug('LGM - id : ' + pwp.id);
            System.debug('LGM - name : ' + pwp.name);
            System.debug('LGM - quantity : ' + pwp.quantity);
            System.debug('LGM - unitPrice : ' + pwp.unitPrice);
            System.debug('LGM - totalPrice : ' + pwp.totalPrice);

            Id standardPriceBookId = pb2Standard.Id;
        
            if (ord.Pricebook2Id == null) {
                ord.Pricebook2Id = standardPriceBookId;
            }
            
            OrderItem oi = new OrderItem();
            oi.PricebookEntryId = pricebookEntryByPricebookId.get(ord.Pricebook2Id).id;
            oi.product2 = productById.get(pwp.id);
            oi.unitPrice = pwp.unitPrice;
            oi.quantity = pwp.quantity;
            oi.orderId = orderId;
            orderItemList.add(oi);
        }
        
        update ord;
        insert orderItemList;
        ord.status = 'Activated';
        update ord;
        //sendRequest(ord);
    }

    
}
