from django import conf
from django.contrib.auth.models import AbstractUser
from django.db import models


class CarGroup(models.Model):
    car_group_id=models.CharField(db_column='car_group_id',max_length=20,null=False,primary_key=True,verbose_name='车队编号')
    car_group_code=models.CharField(db_column='car_group_code',max_length=50,null=False,verbose_name='车队代码(唯一)')
    car_group_full_name=models.CharField(db_column='car_group_full_name',max_length=100,null=False,verbose_name='车队全称')
    car_group_eng_full_name=models.CharField(db_column='car_group_eng_full_name',max_length=100,verbose_name='英文全称')
    car_group_short_name=models.CharField(db_column='car_group_short_name',max_length=15,verbose_name='中文简称')
    address=models.CharField(db_column='address',max_length=200,verbose_name='地址')
    contacts=models.CharField(db_column='contacts',max_length=50,verbose_name='联系人')
    contact_phone=models.CharField(db_column='contact_phone',max_length=20,verbose_name='联系电话')
    fax=models.CharField(db_column='fax',max_length=20,verbose_name='传真')
    type=models.CharField(db_column='type',max_length=10,null=False,verbose_name='车队类型')
    lift_container_number=models.IntegerField(db_column='lift_container_number',max_length=6,null=False,verbose_name='可提TEU数量')
    lift_heavy_container_number=models.IntegerField(db_column='lift_heavy_container_number',max_length=6,null=False,verbose_name='可提重TEU数量')
    create_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_create_by_user',verbose_name='创建者')
    update_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_update_by_user',verbose_name='更新者')
    class Meta:
        managed=False,
        db_table="车队表"


class User(models.Model):
    user_id=models.IntegerField(db_column='id',primary_key=True)
    login_name=models.CharField(db_column='login_name',max_length=50,null=False,verbose_name='登录名',)
    password=models.CharField(db_column='password',max_length=100,null=False,verbose_name='密码',)
    user_type=models.CharField(db_column='user_type',max_length=20,null=False,verbose_name='用户类型（车队方、财务等）',)
    car_group_id=models.CharField(db_column='car_group_id',max_length=20,null=False,verbose_name='如果是车队业务员，则关联到对应车队',)
    B_or_C=models.CharField(db_column='B_or_C',choices=(('B','B端'),('C','_c端')),max_length=1,verbose_name='用户类型2（B端或C端）',)
    create_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_create_by_user', verbose_name='创建者')
    update_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_update_by_user', verbose_name='更新者')
    class Meta:
        managed=False,
        db_table="系统用户表"

class Plan(models.Model):
    plan_id=models.CharField(db_column='plan_id',max_length=20,null=False,verbose_name='计划号',primary_key=True)
    plan_time=models.DateTimeField(db_column='plan_time',null=False,verbose_name='预约时间',)
    expiry_date=models.DateTimeField(db_column='expiry_date',null=False,verbose_name='过期时间',)
    vessel_name=models.CharField(db_column='vessel_name',max_length=50,verbose_name='船名',)
    to_where=models.CharField(db_column='to_where',max_length=10,verbose_name='去向')
    port_of_final = models.CharField(db_column='port_of_final', max_length=10, verbose_name='目的港')
    voyage=models.CharField(db_column='voyage',max_length=50,verbose_name='航次',)
    depot=models.CharField(db_column='depot',max_length=4,null=False,verbose_name='堆场代码')
    bl_no=models.CharField(db_column='bl_no',max_length=50,verbose_name='提单号',)
    car_group_code=models.ForeignKey(CarGroup,db_column='car_group_code',max_length=20,verbose_name='所属车队（外键）',on_delete=models.DO_NOTHING)
    oper_code=models.CharField(db_column='oper_code',max_length=20,null=False,verbose_name='所属客户',)
    plan_status=models.CharField(db_column='plan_status',max_length=20,verbose_name='预约状态',)
    payment_status=models.CharField(db_column='payment_status',max_length=20,verbose_name='缴费状态',)
    document_path=models.CharField(db_column='document_path',max_length=1000,verbose_name='提箱单图片地址',)
    remark=models.CharField(db_column='remark',max_length=500,verbose_name='备注',)
    KS_code=models.CharField(db_column='KS_code',max_length=100,verbose_name='KS码',)
    create_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_create_by_user', verbose_name='创建者')
    update_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_update_by_user', verbose_name='更新者')

    class Meta:
        managed=False,
        db_table="预约计划表"

class Image(models.Model):
    imager_id=models.CharField(db_column='imager_id',max_length=20,null=False,verbose_name='图片编号',primary_key=True)
    images_path=models.CharField(db_column='images_path',max_length=20,null=False,verbose_name='图片地址',)
    plan_id=models.ForeignKey(Plan,db_column='plan_id',max_length=20,null=False,verbose_name='所属计划',on_delete=models.DO_NOTHING)
    create_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_create_by_user', verbose_name='创建者')
    update_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_update_by_user', verbose_name='更新者')
    class Meta:
        managed=False,
        db_table="提箱单图片表"

class Container(models.Model):
    container_id=models.CharField(db_column='container_id',max_length=20,null=False,verbose_name='集装箱编号',
    primary_key=True)
    container_no=models.CharField(db_column='container_no',max_length=20,null=False,verbose_name='集装箱箱号',)
    cont_size=models.CharField(db_column='cont_size',max_length=10,null=False,verbose_name='尺寸',)
    cont_type=models.CharField(db_column='cont_type',max_length=10,null=False,verbose_name='箱型',)
    ctn_net_weight=models.FloatField(db_column='ctn_net_weight',null=False,verbose_name='净重',)
    ctn_gross_weight=models.FloatField(db_column='ctn_gross_weight',verbose_name='毛重',)
    ctn_cy_no=models.CharField(db_column='ctn_cy_no',max_length=50,verbose_name='箱系统号',)
    enter_time=models.DateTimeField(db_column='enter_time',verbose_name='进场时间',)
    serial_no=models.CharField(db_column='serial_no',max_length=20,verbose_name='授权码',)
    plan_id=models.ForeignKey(Plan,db_column='plan_id',max_length=20,null=True,verbose_name='所属计划（外键）',on_delete=models.DO_NOTHING)
    create_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_create_by_user', verbose_name='创建者')
    update_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_update_by_user', verbose_name='更新者')
    class Meta:
        managed=False,
        db_table="箱列表"

class Invoice(models.Model):
    invoice_no=models.CharField(db_column='invoice_no',max_length=20,null=False,verbose_name='发票号',primary_key=True)
    money=models.CharField(db_column='money',max_length=20,null=False,verbose_name='交易金额',)
    pay_time=models.DateTimeField(db_column='pay_time',null=False,verbose_name='交易时间',)
    pay_type=models.CharField(db_column='pay_type',max_length=10,null=False,verbose_name='交易类型（小程序或者网页端）',)
    pay_from=models.CharField(db_column='pay_from',max_length=50,null=False,verbose_name='支付来源',)
    return_status=models.CharField(db_column='return_status',max_length=50,null=False,verbose_name='退款状态',)
    return_no=models.CharField(db_column='return_no',max_length=20,verbose_name='退款流水号',)
    return_money_apply=models.CharField(db_column='return_money_apply',max_length=20,verbose_name='申请退款金额',)
    return_money_actual=models.CharField(db_column='return_money_actual',max_length=20,verbose_name='实际退款金额',)
    return_remark=models.CharField(db_column='return_remark',max_length=50,verbose_name='退款说明',)
    plan_id=models.ForeignKey(Plan,db_column='plan_id',max_length=20,null=False,verbose_name='所属计划',on_delete=models.DO_NOTHING)
    create_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_create_by_user', verbose_name='创建者')
    update_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_update_by_user', verbose_name='更新者')
    class Meta:
        managed=False,
        db_table="支付费用表"

class Fee(models.Model):
    fee_id=models.CharField(db_column='fee_id',max_length=20,null=False,verbose_name='费用编号',primary_key=True)
    fee_name=models.CharField(db_column='fee_name',max_length=20,null=False,verbose_name='费用名称',)
    quantity=models.IntegerField(db_column='quantity',max_length=6,null=False,verbose_name='数量',)
    unit=models.CharField(db_column='unit',max_length=10,null=False,verbose_name='单位',)
    unit_price=models.FloatField(db_column='unit_price',null=False,verbose_name='单价',)
    price=models.FloatField(db_column='price',null=False,verbose_name='总价',)
    plan_id=models.ForeignKey(Plan,db_column='plan_id',max_length=20,null=False,verbose_name='所属计划',on_delete=models.DO_NOTHING)
    invoice_id=models.CharField(db_column='invoice_id',max_length=20,verbose_name='所属交易流水（外键）',)
    container_no=models.CharField(db_column='container_no',max_length=20,null=False,verbose_name='集装箱箱号',)
    pay_status=models.CharField(db_column='pay_status',max_length=20,null=False,verbose_name='缴费状态',)
    create_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_create_by_user', verbose_name='创建者')
    update_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_update_by_user', verbose_name='更新者')
    class Meta:
        managed=False,
        db_table="支付费用明细表"

class Action(models.Model):
    action_id=models.CharField(db_column='action_id',max_length=20,null=False,verbose_name='操作编号',primary_key=True)
    action_name=models.CharField(db_column='action_name',max_length=20,null=False,verbose_name='操作名称',)
    plan_id=models.ForeignKey(Plan,db_column='plan_id',max_length=20,null=False,verbose_name='计划编号',on_delete=models.DO_NOTHING)
    user_id=models.ForeignKey(User,db_column=' id',verbose_name='操作人',on_delete=models.DO_NOTHING)
    action_time=models.DateTimeField(db_column='action_time',null=False,verbose_name='操作时间',)
    create_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_create_by_user', verbose_name='创建者')
    update_by = models.ForeignKey(conf.settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
                                  related_name='%(class)s_update_by_user', verbose_name='更新者')
    class Meta:
        managed=False,
        db_table="操作记录表"