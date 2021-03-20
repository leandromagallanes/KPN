public with sharing class AvailableProductsController {
    public AvailableProductsController() {

    }
    @auraEnabled(cacheable=true)
    public static List<Product2> getProductList(){
        List<Product2> productList = [Select id, name from Product2 limit 10];
        system.debug('LGM : Entered getProductList');
        return productList;
    }
}