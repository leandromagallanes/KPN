public with sharing class OrderProductsController {
    //cacheable=false, to be allowed to execute DML operations
    @auraEnabled(cacheable=false)
    public static Boolean getActivateOrder(List<AvailableProductsController.ProductWithPrice> pwpList, Id orderId){
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
        
        //TO REVIEW
        update ord;
        insert orderItemList;
        ord.status = 'Activated';
        update ord;

        Database.SaveResult[] srList = Database.update(orderItemList, false);
 
        for (Database.SaveResult sr : srList) {
            if (sr.isSuccess()) {
                return true;
            }
        }
            return false;
    }
    
    @auraEnabled(cacheable=true)
    public static Boolean getIsOrderActivated(Id orderId){
        Order order = [SELECT status from Order where id =: orderId];
        return order.status == 'Activated';
    }

    //TBD - Confirmation callout
    /*
    @auraEnabled(cacheable=false)
    public static void sendRequest(Order ord){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://kpntest.requestcatcher.com/');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        // Set the body as a JSON object
        //request.setBody('{"name":"mighty moose"}');
        request.setBody(JSON.serialize(ord));
        HttpResponse response = http.send(request);
        // Parse the JSON response
        if (response.getStatusCode() != 201) {
            System.debug('The status code returned was not expected: ' +
                response.getStatusCode() + ' ' + response.getStatus());
        } else {
            System.debug(response.getBody());
        }
    }*/
}
