# Generated by Django 5.0.6 on 2024-07-27 06:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0005_payment_recipient_alter_payment_payer_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='transactionsplit',
            name='paid_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]