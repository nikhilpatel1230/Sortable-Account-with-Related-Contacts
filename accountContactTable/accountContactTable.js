import { LightningElement, wire,track} from 'lwc';
import getAccountsWithContactCount from '@salesforce/apex/AccountContactController.getAccountsWithContactCount';
import { NavigationMixin } from 'lightning/navigation';

const COLUMNS = [
    {
        label: 'Account Name',
        fieldName: 'accountName',
        type: 'button',
        
        typeAttributes: {
            label: { fieldName: 'accountName' },
            variant: 'base',
            name: 'view_account'
        },
        sortable: true
    },
    {label:'Contact Count', fieldName:'contactCount', sortable: true},
    {label:'Phone', fieldName:'phone'},
    {label:'Website',fieldName:'website'}
];
export default class AccountContactTable extends NavigationMixin(LightningElement) {
    columns = COLUMNS;
    @track data = [];
    sortBy;
    sortDirection;

    @wire(getAccountsWithContactCount)
    wiredAccounts({ error, data }) {
        if (data) {
            this.data = [...data];
        } else if (error) {
            console.error('Error loading accounts', error);
        }
    }

    handleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];

        cloneData.sort((a, b) => {
            let valA = a[sortedBy] || '';
            let valB = b[sortedBy] || '';

            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            return sortDirection === 'asc'
                ? valA > valB ? 1 : valA < valB ? -1 : 0
                : valA < valB ? 1 : valA > valB ? -1 : 0;
        });

        this.data = cloneData;
        this.sortBy = sortedBy;
        this.sortDirection = sortDirection;
    }

    handleRowAction(event) {
        const row = event.detail.row;
        const actionName = event.detail.action.name;

        if (actionName === 'view_account') {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: row.accountId,
                    objectApiName: 'Account',
                    actionName: 'view'
                }
            });
        }
    }
}
