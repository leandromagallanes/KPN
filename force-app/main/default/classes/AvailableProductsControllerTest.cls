@isTest(seealldata=false)
private class AvailableProductsControllerTest{
    @testSetup 
    static void setup(){
        
        List<Product2> testProds = new List<Product2>();
        for(Integer i=0;i<2;i++) {
            testProds.add(new Product2(Name = 'TestProd' + i));
        }
        insert testProds;        
    }

    @isTest
    static void validateGetProductList() {
        Test.startTest();
        List<Product2> prodList = AvailableProductsController.getProductList();
        Test.stopTest();
        System.assertEquals(2, prodList.size());
    }
}