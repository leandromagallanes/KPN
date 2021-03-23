import { LightningElement,track,wire,api } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getActivateOrder from '@salesforce/apex/OrderProductsController.getActivateOrder'
import STATUS_FIELD from '@salesforce/schema/Order.Status';

const data = [];
const columns = [
    {
        label: 'Remove',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'utility:delete',
            variant: 'border-filled',
            alternativeText: 'Remove Product'
        }
    },
    { 
        label: 'Product Name', 
        fieldName: 'name',
        sortable: true,
        cellAttributes: { alignment: 'left' },
    },
    {
        label: 'Unit Price',
        fieldName: 'unitPrice',
        type: 'currency',
        sortable: true,
        cellAttributes: { alignment: 'left' },
    },
    {
        label: 'Quantity',
        fieldName: 'quantity',
        type: 'number',
        sortable: true,
        cellAttributes: { alignment: 'left' },
    },
    {
        label: 'Total Price',
        fieldName: 'totalPrice',
        type: 'currency',
        sortable: true,
        cellAttributes: { alignment: 'left' },
    },
];


export default class DemoApp extends LightningElement {
    data = data;
    columns = columns;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;
    
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: [STATUS_FIELD]})
    order;

    get isOrderActivated() {
        return getFieldValue(this.order.data, STATUS_FIELD) == 'Activated';
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
    @track orderProducts = [];

    addProduct(event){
        if(getFieldValue(this.order.data, STATUS_FIELD) != 'Activated'){
            console.log('LGM - orderProduct - addProduct');
            console.log(JSON.stringify(event.detail));
            
            var found = false;
            this.orderProducts.forEach(element => {
                if(element.id === event.detail.id){
                    element.quantity++;
                    element.totalPrice = element.unitPrice * element.quantity;
                    this.orderProducts = [...this.orderProducts];
                    found = true;
                }
            });
            if(found === false){
                event.detail.quantity = 1;
                event.detail.totalPrice = event.detail.unitPrice * event.detail.quantity;
                this.orderProducts = [...this.orderProducts, event.detail]; 
            }
        }
        
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];
        
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    @wire(getActivateOrder)
    onHandleActivateButton() {
        console.log('ACTIVATE BUTTON');
        getActivateOrder({pwpList: this.orderProducts, orderId: this.recordId}).then(result => {
            console.log('ACTIVATE - Result : ' + result);
        })
        .catch(error => {
            this.error = error;
        });
    }
}
