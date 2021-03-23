import { LightningElement, wire, track, api } from 'lwc';
import getProductWithPriceList from '@salesforce/apex/AvailableProductsController.getProductWithPriceList'


const data = [];

const columns = [
    {
        label: 'Add',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'utility:add',
            variant: 'border-filled',
            alternativeText: 'Add Product'
        }
    },
    { 
        label: 'Product Name', 
        fieldName: 'name',
        sortable: true,
    },
    {
        label: 'List Price',
        fieldName: 'unitPrice',
        type: 'currency',
        sortable: true,
        cellAttributes: { alignment: 'left' },
    },
];

export default class AvailableProducts extends LightningElement {
    data = data;
    columns = columns;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;

    @track products;
    

    @wire(getProductWithPriceList)
    products({error,data}) {
        console.log('Data : ' + JSON.stringify(data));
        if(data){
            this.products = data;
        } else if(error){
            console.log('Product Error');
            console.log(error);
        } else{
            console.log('Sorry Nothing Happened');
        }
    }

    //Dispatches the event to let the OrderProduct component know that a product should be added
    handleRowAction(event){
        const dataRow = event.detail.row;
        this.dispatchEvent(new CustomEvent('productadded', {detail: dataRow}));
   }

    // Used to sort - TBD
    sortBy(field, reverse, primer) {
        const key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }
    
    // Used to sort - TBD
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}
