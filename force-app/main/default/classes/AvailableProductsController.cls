public with sharing class AvailableProductsController {
    @auraEnabled(cacheable=true)
    public static List<ProductWithPrice> getProductWithPriceList(){
        List<Pricebookentry> pbeList = [SELECT id, unitPrice, Product2.name, pricebook2.isstandard FROM Pricebookentry WHERE Product2.isActive = TRUE AND pricebook2.isstandard = TRUE AND isActive = TRUE ORDER BY Product2.name ASC];
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
        @auraenabled public Decimal totalPrice {get; set;}
        @auraenabled public Integer quantity {get; set;}
    }
}