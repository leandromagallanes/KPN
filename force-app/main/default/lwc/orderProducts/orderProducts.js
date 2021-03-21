import { LightningElement,track } from 'lwc';

const data = [
    { id: 1, name: 'Billy Simonns', unitPrice: 40, quantity: 2, totalPrice: 80 },
    { id: 2, name: 'Kelsey Denesik', unitPrice: 35 , quantity: 2, totalPrice: 80},
    { id: 3, name: 'Kyle Ruecker', unitPrice: 50, quantity: 2, totalPrice: 80},
    { id: 4, name: 'Krystina Kerluke', unitPrice: 37, quantity: 2, totalPrice: 80
    },
];
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
        console.log('LGM - orderProduct - addProduct');
        console.log(JSON.stringify(event.detail));
        
        var found = false;
        this.orderProducts.forEach(element => {
            //console.log('LGM : element.Id = ' + element.id);
            //console.log('LGM : event.detail.Id = ' + event.detail.id);
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
        
        //console.log(JSON.stringify(event.detail));
    }

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];
        
        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    onHandleActivateButton(event) {
        
    }
}
