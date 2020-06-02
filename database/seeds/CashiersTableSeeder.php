<?php

use Illuminate\Database\Seeder;
use App\Cashier;

class CashiersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Cashier::create([
            'date_open' => '2019/06/11',
            'hour_open' => '12:45',
            'value_previous_close' => 6280,
            'value_open' => null,
            'observation' => ''
        ]);

        Cashier::create([
            'date_open' => '2020/06/02',
            'hour_open' => '12:00',
            'value_previous_close' => 5000,
            'value_open' => null,
            'observation' => ''
        ]);
    }
}
