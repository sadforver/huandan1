from django.db import models


class CarGroup(models.Model):
    carGroupId=models.CharField(db_column='car_group_id',max_length=20,null=False,primary_key=True,verbose_name='车队编号')
    carGroupCode=models.CharField(db_column='car_group_code',max_length=50,null=False,verbose_name='车队代码(唯一)')
    carGroupFullName=models.CharField(db_column='car_group_full_name',max_length=100,null=False,verbose_name='车队全称')
    carGroupEngFullName=models.CharField(db_column='car_group_eng_full_name',max_length=100,verbose_name='英文全称')
    carGroupShortName=models.CharField(db_column='car_group_short_name',max_length=15,verbose_name='中文简称')
    address=models.CharField(db_column='address',max_length=200,verbose_name='地址')
    contacts=models.CharField(db_column='contacts',max_length=50,verbose_name='联系人')
    contactPhone=models.CharField(db_column='contact_phone',max_length=20,verbose_name='联系电话')
    fax=models.CharField(db_column='fax',max_length=20,verbose_name='传真')
    type=models.CharField(db_column='type',max_length=10,null=False,verbose_name='车队类型')
    liftContainerNumber=models.IntegerField(db_column='lift_container_number',max_length=6,null=False,verbose_name='可提TEU数量')
    liftHeavyContainerNumber=models.IntegerField(db_column='lift_heavy_container_number',max_length=6,null=False,verbose_name='可提重TEU数量')

    class Meta:
        managed=False,
        db_table="车队表"


class User(models.Model):
    userId=models.CharField(db_column='user_id',max_length=20,null=False,verbose_name='用户名',primary_key=True)
    loginName=models.CharField(db_column='login_name',max_length=50,null=False,verbose_name='登录名',)
    password=models.CharField(db_column='password',max_length=100,null=False,verbose_name='密码',)
    userType=models.CharField(db_column='user_type',max_length=20,null=False,verbose_name='用户类型（车队方、财务等）',)
    carGroupId=models.CharField(db_column='car_group_id',max_length=20,null=False,verbose_name='如果是车队业务员，则关联到对应车队',)
    BOrC=models.CharField(db_column='B_or_C',choices=(('B','B端'),('C','C端')),max_length=1,verbose_name='用户类型2（B端或C端）',)

    class Meta:
        managed=False,
        db_table="系统用户表"

class Plan(models.Model):
    planId=models.CharField(db_column='plan_id',max_length=20,null=False,verbose_name='计划号',primary_key=True)
    planTime=models.DateTimeField(db_column='plan_time',null=False,verbose_name='预约时间',)
    expTime=models.DateTimeField(db_column='exp_time',null=False,verbose_name='过期时间',)
    vessel=models.CharField(db_column='vessel',max_length=50,verbose_name='船名',)
    voyage=models.CharField(db_column='voyage',max_length=50,verbose_name='航次',)
    billNo=models.CharField(db_column='bill_no',max_length=50,verbose_name='提单号',)
    carGroupCode=models.CharField(db_column='car_group_code',max_length=20,verbose_name='所属车队（外键）',)
    userId=models.CharField(db_column='user_id',max_length=20,null=False,verbose_name='所属客户',)
    planStatus=models.CharField(db_column='plan_status',max_length=20,verbose_name='预约状态',)
    paymentStatus=models.CharField(db_column='payment_status',max_length=20,verbose_name='缴费状态',)
    documentPath=models.CharField(db_column='document_path',max_length=1000,verbose_name='提箱单图片地址',)
    remark=models.CharField(db_column='remark',max_length=500,verbose_name='备注',)
    KSCode=models.CharField(db_column='KS_code',max_length=100,verbose_name='KS码',)

    class Meta:
        managed=False,
        db_table="预约计划表"

class Image(models.Model):
    imagerId=models.CharField(db_column='imager_id',max_length=20,null=False,verbose_name='图片编号',primary_key=True)
    imagesPath=models.CharField(db_column='images_path',max_length=20,null=False,verbose_name='图片地址',)
    planId=models.ForeignKey(Plan,db_column='plan_id',max_length=20,null=False,verbose_name='所属计划',on_delete=models.DO_NOTHING)

    class Meta:
        managed=False,
        db_table="提箱单图片表"

class Container(models.Model):
    containerId=models.CharField(db_column='container_id',max_length=20,null=False,verbose_name='集装箱编号',
    primary_key=True)
    containerNo=models.CharField(db_column='container_no',max_length=20,null=False,verbose_name='集装箱箱号',)
    ctnSize=models.CharField(db_column='ctn_size',max_length=10,null=False,verbose_name='尺寸',)
    ctnType=models.CharField(db_column='ctn_type',max_length=10,null=False,verbose_name='箱型',)
    ctnNetWeight=models.FloatField(db_column='ctn_net_weight',null=False,verbose_name='净重',)
    ctnGrossWeight=models.FloatField(db_column='ctn_gross_weight',verbose_name='毛重',)
    volume=models.FloatField(db_column='volume',verbose_name='体积',)
    ctnCyNo=models.CharField(db_column='ctn_cy_no',max_length=50,verbose_name='箱系统号',)
    enterTime=models.DateTimeField(db_column='enter_time',verbose_name='进场时间',)
    planId=models.ForeignKey(Plan,db_column='plan_id',max_length=20,verbose_name='所属计划（外键）',on_delete=models.DO_NOTHING)

    class Meta:
        managed=False,
        db_table="箱列表"

class Invoice(models.Model):
    invoiceNo=models.CharField(db_column='invoice_no',max_length=20,null=False,verbose_name='发票号',primary_key=True)
    money=models.CharField(db_column='money',max_length=20,null=False,verbose_name='交易金额',)
    payTime=models.DateTimeField(db_column='pay_time',null=False,verbose_name='交易时间',)
    payType=models.CharField(db_column='pay_type',max_length=10,null=False,verbose_name='交易类型（小程序或者网页端）',)
    pay_from=models.CharField(db_column='pay_from',max_length=50,null=False,verbose_name='支付来源',)
    returnStatus=models.CharField(db_column='return_status',max_length=50,null=False,verbose_name='退款状态',)
    returnNo=models.CharField(db_column='return_no',max_length=20,verbose_name='退款流水号',)
    returnMoneyApply=models.CharField(db_column='return_money_apply',max_length=20,verbose_name='申请退款金额',)
    returnMoneyActual=models.CharField(db_column='return_money_actual',max_length=20,verbose_name='实际退款金额',)
    return_remark=models.CharField(db_column='return_remark',max_length=50,verbose_name='退款说明',)
    planId=models.ForeignKey(Plan,db_column='plan_id',max_length=20,null=False,verbose_name='所属计划',on_delete=models.DO_NOTHING)

    class Meta:
        managed=False,
        db_table="支付费用表"

class Fee(models.Model):
    feeId=models.CharField(db_column='fee_id',max_length=20,null=False,verbose_name='费用编号',primary_key=True)
    feeName=models.CharField(db_column='fee_name',max_length=20,null=False,verbose_name='费用名称',)
    quantity=models.IntegerField(db_column='quantity',max_length=6,null=False,verbose_name='数量',)
    unit=models.CharField(db_column='unit',max_length=10,null=False,verbose_name='单位',)
    unitPrice=models.FloatField(db_column='unit_price',null=False,verbose_name='单价',)
    price=models.FloatField(db_column='price',null=False,verbose_name='总价',)
    planId=models.ForeignKey(Plan,db_column='plan_id',max_length=20,null=False,verbose_name='所属计划',on_delete=models.DO_NOTHING)
    invoiceId=models.CharField(db_column='invoice_id',max_length=20,verbose_name='所属交易流水（外键）',)
    containerNo=models.CharField(db_column='container_no',max_length=20,null=False,verbose_name='集装箱箱号',)
    payStatus=models.CharField(db_column='pay_status',max_length=20,null=False,verbose_name='缴费状态',)

    class Meta:
        managed=False,
        db_table="支付费用明细表"

class Action(models.Model):
    actionId=models.CharField(db_column='action_id',max_length=20,null=False,verbose_name='操作编号',primary_key=True)
    actionName=models.CharField(db_column='action_name',max_length=20,null=False,verbose_name='操作名称',)
    planId=models.ForeignKey(Plan,db_column='plan_id',max_length=20,null=False,verbose_name='计划编号',on_delete=models.DO_NOTHING)
    userId=models.ForeignKey(User,db_column='user_id',max_length=10,null=False,verbose_name='操作人',on_delete=models.DO_NOTHING)
    actionTime=models.DateTimeField(db_column='action_time',null=False,verbose_name='操作时间',)

    class Meta:
        managed=False,
        db_table="操作记录表"