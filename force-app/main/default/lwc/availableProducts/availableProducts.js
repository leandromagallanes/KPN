import { LightningElement, wire, track } from 'lwc';
import getProductList from '@salesforce/apex/AvailableProductsController.getProductList'

const data = [
    { id: 1, name: 'Billy Simonns', price: 40 },
    { id: 2, name: 'Kelsey Denesik', price: 35 },
    { id: 3, name: 'Kyle Ruecker', price: 50},
    { id: 4, name: 'Krystina Kerluke', price: 37,
    },
];

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
        fieldName: 'Name',
        sortable: true,
    },
    {
        label: 'List Price',
        fieldName: 'price',
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

    @wire(getProductList)
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

    handleRowAction(event){
        const dataRow = event.detail.row;
        console.log('dataRow@@ ' + JSON.stringify(dataRow));
        this.dispatchEvent(new CustomEvent('productadded', {detail: dataRow}));
   }

    // Used to sort the 'Age' column
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

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
}
