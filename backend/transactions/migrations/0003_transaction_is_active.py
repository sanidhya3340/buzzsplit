# Generated by Django 5.0.6 on 2024-07-14 11:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0002_alter_transactionsplit_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
