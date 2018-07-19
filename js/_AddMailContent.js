/* [AddMail]
 * 子组件
 * */
Vue.component('add-mail-content-template', {
    template: '#add-mail-content-template',
    data() {
        return {
            invoiceTypeFilter: [],//
            eInvoiceEnabled: true,//
            submitErrFocusRef: '',//
        }
    },
    created: function () {
        this.setInvoiceTypeList();
        this.eInvoiceEnabled = this.orderdata.ProjectSourceId == 1;//
    },
    methods: {
       
        bindInvoiceList: function () {
            //拓展字段
            Vue.set(item, 'FPIVBillingProjectOrig', item.FPIVBillingProject);
            Vue.set(item, 'InvoiceTotal', 1);//
            Vue.set(item, 'err', {
                title: false,
                titleErr: '',
                customerIdentifier: false,
                customerIdentifierErr: '',
                fee: false,
                feeErr: '',
            });
        },
        
        btnRemovePerInvoice: passenger => {
            passenger.IsValid = false;
        },
    },
    watch: {
    },
    computed: {
    },
    /* 父组件传入数据
     * orderdata 
     * titlelist 
     * passengerurl 
     * searchdutynourl 
     */
    props: ['orderdata', 'titlelist', 'passengerurl', 'searchdutynourl']
});