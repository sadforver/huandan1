# Generated by Django 3.1.3 on 2021-11-30 15:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='action',
            name='user_id',
            field=models.ForeignKey(db_column='id', max_length=10, on_delete=django.db.models.deletion.DO_NOTHING, to='app.user', verbose_name='操作人'),
        ),
    ]
