# Generated by Django 5.0.6 on 2024-07-28 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0006_transactionsplit_paid_amount'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transactionsplit',
            old_name='amount',
            new_name='amount_owed',
        ),
        migrations.RemoveField(
            model_name='transactionsplit',
            name='paid_amount',
        ),
        migrations.AddField(
            model_name='transactionsplit',
            name='amount_paid',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='transactionsplit',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='transactionsplit',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
