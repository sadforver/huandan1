from django.db import models


class CarGroup(models.Model):
    carGroupId=models.CharField(dbColumn='car_group_id',maxlength=20,null=False,primart_key=True,
    verboseName='车队编号')
    carGroupCode=models.CharField(dbColumn='car_group_code',maxlength=50,null=False,verboseName='车队代码(唯一)')
    carGroupFullName=models.CharField(dbColumn='car_group_full_name',maxlength=100,null=False,verboseName='车队全称')
    carGroupEngFullName=models.CharField(dbColumn='car_group_eng_full_name',maxlength=100,verboseName='英文全称')
    carGroupShortName=models.CharField(dbColumn='car_group_short_name',maxlength=15,verboseName='中文简称')
    address=models.CharField(dbColumn='address',maxlength=200,verboseName='地址')
    contacts=models.CharField(dbColumn='contacts',maxlength=50,verboseName='联系人')
    contactPhone=models.CharField(dbColumn='contact_phone',maxlength=20,verboseName='联系电话')
    fax=models.CharField(dbColumn='fax',maxlength=20,verboseName='传真')
    type=models.CharField(dbColumn='type',maxlength=10,null=False,verboseName='车队类型')
    liftContainerNumber=models.IntegerField(dbColumn='lift_container_number',maxlength=6,null=False,
    verboseName='可提TEU数量')
    liftHeavyContainerNumber=models.IntegerField(dbColumn='lift_heavy_container_number',maxlength=6,null=False,
    verboseName='可提重TEU数量')


class User(models.Model):
    userId=models.CharField(dbColumn='user_id',maxlength=20,null=False,verbose_name='用户名',primary_key=True)
    loginName=models.CharField(dbColumn='login_name',maxlength=50,null=False,verbose_name='登录名',)
    password=models.CharField(dbColumn='password',maxlength=100,null=False,verbose_name='密码',)
    userType=models.CharField(dbColumn='user_type',maxlength=20,null=False,verbose_name='用户类型（车队方、财务等）',)
    carGroupId=models.CharField(dbColumn='car_group_id',maxlength=20,null=False,verbose_name='如果是车队业务员，则关联到对应车队',)
    BOrC=models.CharField(dbColumn='B_or_C',choices=(('B','B端'),('C','C端')),verbose_name='用户类型2（B端或C端）',)


class Plan(models.Model):
    planId=models.CharField(dbColumn='plan_id',maxlength=20,null=False,verbose_name='计划号',primary_key=True)
    planTime=models.DateTimeField(dbColumn='plan_time',null=False,verbose_name='预约时间',)
    expTime=models.DateTimeField(dbColumn='exp_time',null=False,verbose_name='过期时间',)
    vessel=models.CharField(dbColumn='vessel',maxlength=50,verbose_name='船名',)
    voyage=models.CharField(dbColumn='voyage',maxlength=50,verbose_name='航次',)
    billNo=models.CharField(dbColumn='bill_no',maxlength=50,verbose_name='提单号',)
    carGroupCode=models.CharField(dbColumn='car_group_code',maxlength=20,verbose_name='所属车队（外键）',)
    userId=models.CharField(dbColumn='user_id',maxlength=20,null=False,verbose_name='所属客户',)
    planStatus=models.CharField(dbColumn='plan_status',maxlength=20,verbose_name='预约状态',)
    paymentStatus=models.CharField(dbColumn='payment_status',maxlength=20,verbose_name='缴费状态',)
    documentPath=models.CharField(dbColumn='document_path',maxlength=1000,verbose_name='提箱单图片地址',)
    remark=models.CharField(dbColumn='remark',maxlength=500,verbose_name='备注',)
    KSCode=models.CharField(dbColumn='KS_code',maxlength=100,verbose_name='KS码',)

class Image(models.Model):
    imagerId=models.CharField(dbColumn='imager_id',maxlength=20,null=False,verbose_name='图片编号',primary_key=True)
    imagesPath=models.CharField(dbColumn='images_path',maxlength=20,null=False,verbose_name='图片地址',)
    planId=models.CharField(dbColumn='plan_id',maxlength=10,null=False,verbose_name='所属计划',)

class Container(models.Model):
    containerId=models.CharField(dbColumn='container_id',maxlength=20,null=False,verbose_name='集装箱编号',
    primary_key=True)
    containerNo=models.CharField(dbColumn='container_no',maxlength=20,null=False,verbose_name='集装箱箱号',)
    ctnSize=models.CharField(dbColumn='ctn_size',maxlength=10,null=False,verbose_name='尺寸',)
    ctnType=models.CharField(dbColumn='ctn_type',maxlength=10,null=False,verbose_name='箱型',)
    ctnNetWeight=models.FloatField(dbColumn='ctn_net_weight',null=False,verbose_name='净重',)
    ctnGrossWeight=models.FloatField(dbColumn='ctn_gross_weight',verbose_name='毛重',)
    volume=models.FloatField(dbColumn='volume',verbose_name='体积',)
    ctnCyNo=models.CharField(dbColumn='ctn_cy_no',maxlength=50,verbose_name='箱系统号',)
    enterTime=models.DateTimeField(dbColumn='enter_time',verbose_name='进场时间',)
    planId=models.CharField(dbColumn='plan_id',maxlength=20,verbose_name='所属计划（外键）',)

class Invoice(models.Model):
    invoiceNo=models.CharField(dbColumn='invoice_no',maxlength=20,null=False,verbose_name='发票号',primary_key=True)
    money=models.CharField(dbColumn='money',maxlength=20,null=False,verbose_name='交易金额',)
    payTime=models.DateTimeField(dbColumn='pay_time',null=False,verbose_name='交易时间',)
    payType=models.CharField(dbColumn='pay_type',maxlength=10,null=False,verbose_name='交易类型（小程序或者网页端）',)
    pay_from=models.CharField(dbColumn='pay_from',null=False,verbose_name='支付来源',)
    returnStatus=models.CharField(dbColumn='return_status',null=False,verbose_name='退款状态',)
    returnNo=models.CharField(dbColumn='return_no',maxlength=20,verbose_name='退款流水号',)
    returnMoneyApply=models.CharField(dbColumn='return_money_apply',maxlength=20,verbose_name='申请退款金额',)
    returnMoneyActual=models.CharField(dbColumn='return_money_actual',maxlength=20,verbose_name='实际退款金额',)
    return_remark=models.CharField(dbColumn='return_remark',verbose_name='退款说明',)
    planId=models.CharField(dbColumn='plan_id',null=False,verbose_name='所属计划',)

class Fee(models.Model):
    feeId=models.CharField(dbColumn='fee_id',maxlength=20,null=False,verbose_name='费用编号',primary_key=True)
    feeName=models.CharField(dbColumn='fee_name',maxlength=20,null=False,verbose_name='费用名称',)
    quantity=models.IntegerField(dbColumn='quantity',maxlength=6,null=False,verbose_name='数量',)
    unit=models.FloatField(dbColumn='unit',maxlength=10,null=False,verbose_name='单位',)
    unitPrice=models.FloatField(dbColumn='unit_price',null=False,verbose_name='单价',)
    price=models.CharField(dbColumn='price',null=False,verbose_name='总价',)
    planId=models.CharField(dbColumn='plan_id',maxlength=20,null=False,verbose_name='所属计划',)
    invoiceId=models.CharField(dbColumn='invoice_id',maxlength=20,verbose_name='所属交易流水（外键）',)
    containerNo=models.CharField(dbColumn='container_no',maxlength=20,null=False,verbose_name='集装箱箱号',)
    payStatus=models.CharField(dbColumn='pay_status',maxlength=20,null=False,verbose_name='缴费状态',)

class Action(models.Model):
    actionId=models.CharField(dbColumn='action_id',maxlength=20,null=False,verbose_name='操作编号',primary_key=True)
    actionName=models.CharField(dbColumn='action_name',maxlength=20,null=False,verbose_name='操作名称',)
    planId=models.CharField(dbColumn='plan_id',maxlength=20,null=False,verbose_name='计划编号',)
    userId=models.CharField(dbColumn='user_id',maxlength=10,null=False,verbose_name='操作人',)
    actionTime=models.DateTimeField(dbColumn='action_time',null=False,verbose_name='操作时间',)