public with sharing class AvailableProductsController {
    public AvailableProductsController() {

    }
    @auraEnabled(cacheable=true)
    public static List<Product2> getProductList(){
        List<Product2> productList = [SELECT id, name from Product2 where isActive = true];
        return productList;
    }

    @auraEnabled(cacheable=true)
    public static List<ProductWithPrice> getProductWithPriceList(){
        List<Product2> productList = [SELECT id, name FROM Product2 WHERE isActive = TRUE];
        List<Pricebookentry> pbeList = [SELECT id, unitPrice, Product2.name, pricebook2.isstandard FROM Pricebookentry WHERE pricebook2.isstandard = TRUE AND isActive = TRUE AND Product2Id IN: productList];
        List<ProductWithPrice> productsWithPriceToReturn = new List<ProductWithPrice>();
        for(Pricebookentry p : pbeList){
            ProductWithPrice pwp = new ProductWithPrice();
            pwp.id = p.Product2Id;
            pwp.name = p.product2.name;
            pwp.unitPrice = p.unitPrice;

            productsWithPriceToReturn.add(pwp);
        }
        return productsWithPriceToReturn;
    }

    //Wrapper class to set the product with the unitprice from the standard pricebook
    public with sharing class ProductWithPrice {
        @auraenabled public String id {get; set;}
        @auraenabled public String name {get; set;}
        @auraenabled public Decimal unitPrice {get; set;}
    }
}

