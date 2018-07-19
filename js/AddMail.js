/* [AddMail]
 * 
 * */
var AddMailVm = new Vue({
    el: '#amMailPart',
    data: function () { return initData },
    created: function () {
    },
    methods: {
        /* [邮寄日期]设置禁用日期
         */
        setDisableDate: function () {
            return {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now();
                }
            }
        },
        
        /* [级联省市区]选择省市区
         */
        selectAreaInfo: function (item, callback) {
            $.ajax({
                url: this.viewUrl.getAreaInfoUrl,
                data: { pid: item.value },
                dataType: "json",
                type: 'Get',
                success: function (result) {
                    if (result) {
                        item.children = result.map(m => {
                            if (item.type <= 3) {
                                return {
                                    value: m.value,
                                    label: m.label,
                                    loading: false,
                                    children: []
                                }
                            } else {
                                return {
                                    value: m.value,
                                    label: m.label,
                                    children: []
                                }
                            }
                        });

                        callback();
                    }
                    else {
                        MyMsg.error('获取数据失败.');
                        item.children = [];
                    }
                },
                error: function () {
                    MyMsg.error('获取数据异常.');
                    item.children = [];
                }
            });
        },
        /* [级联省市区]设置呈现格式
         */
        selectAreaFormat: labels => labels.join('，'),
        /* [级联省市区]保存选择详细
         */
        areaSelChange(value, selectedData) {
            if (selectedData && selectedData.length >= 3) {
                this.viewData.provinceId = selectedData[0].value;
                this.viewData.provinceName = selectedData[0].label;
                this.viewData.cityId = selectedData[1].value;
                this.viewData.cityName = selectedData[1].label;
                this.viewData.districtId = selectedData[2].value;
                this.viewData.districtName = selectedData[2].label;
            } else {
                this.viewData.provinceId = 0;
                this.viewData.provinceName = '';
                this.viewData.cityId = 0;
                this.viewData.cityName = '';
                this.viewData.districtId = 0;
                this.viewData.districtName = '';
            }
        },
        
        /* 定位
         */
        focusSerialId: function (serialId) {
            this.$refs['mailContent_' + serialId][0].focus();
        },
        
        /* [按钮]第二次确认,提交保存
         */
        btnSave: function () {
            var _this = this;
            this.$Spin.show({
                render: (h) => {
                    return h('div', [
                        h('Icon', {
                            'class': 'demo-spin-icon-load',
                            props: {
                                type: 'load-c',
                                size: 60
                            }
                        }),
                        h('div', '正在保存...')
                    ])
                }
            });
            $.ajax({
                url: this.viewUrl.getConfrimUrl,
                data: this.submitItem,
                cache: false,
                type: 'Post',
                success: function (ret) {
                    
                    _this.$Spin.hide();
                },
                error: function () {
                    MyMsg.error('保存失败.');
                    _this.$Spin.hide();
                }
            })
        },
        
        /* [数据验证]第一次确认,整理数据,弹出确认界面
         */
        showPostInfo: function () {
            //数据填写验证
            var inputFlag = true;
            if (this.checkAreaSel()) {
                if (inputFlag) {
                    var el = $(this.$refs['txt_areaSel'].$el);
                    var ipt = el.find('input');
                    ipt.focus();
                }
                inputFlag = false;
            }
            if (this.checkAddress()) {
                if (inputFlag) {
                    this.$refs['txt_address'].focus();
                }
                inputFlag = false;
            }
            var cont = this.checkContactInfos();
            if (cont == 1) {
                if (inputFlag) {
                    this.$refs['txt_contact'].focus();
                }
                inputFlag = false;
            } else if (cont == 2) {
                if (inputFlag) {
                    this.$refs['txt_contactMobile'].focus();
                }
                inputFlag = false;
            } else if (cont == 3) {
                if (inputFlag) {
                    this.$refs['txt_customerEmail'].focus();
                }
                inputFlag = false;
            }
            if (this.checkInfosTitle()) {
                inputFlag = false;
            }
            //数据填写不完整,拦截提交操作
            if (!inputFlag) {
                return;
            }

            //整理数据
            this.submitItem = {};//清空待提交实体,重新赋值
            this.prepareMail();
            this.prepareBilling();
            this.prepareEticket();
            this.prepareInvoice();
            this.prepareInsuance();

            setTimeout(() => {
                this.$refs['previewModal'].show()
            }, 0);//弹出确认框 _Preview.cshtml
        },
        
    },
    computed: {
        /* [级联省市区]判断是否有历史地址
         */
        showAddressSel: function () {
            return this.contactList && this.contactList.length > 0;
        }
    },
    watch: {
        'viewData.areaSel': function () {
            this.checkAreaSel();
        },
        'viewData.address': function () {
            this.checkAddress();
        },
        'viewData.contact': function () {
            this.checkContactInfos();
        },
        'viewData.contactMobile': function () {
            this.checkContactInfos();
        },
        'viewData.customerEmail': function () {
            this.checkContactInfos();
        },
    }
});