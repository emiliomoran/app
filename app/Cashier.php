<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cashier extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $fillable = [
        'date_open', 'hour_open', 'value_previous_close', 'value_open', 'observation', 'date_close', 'hour_close', 'value_card', 'value_cash', 'value_close', 'value_sales'
    ];

    public function expenses()
    {
        return $this->hasMany('App\Expense');
    }
}
