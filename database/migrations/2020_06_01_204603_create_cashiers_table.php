<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCashiersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cashiers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('date_open');
            $table->time('hour_open');
            $table->integer('value_previous_close');
            $table->integer('value_open')->nullable();
            $table->char('observation', 255)->nullable()->default("");
            $table->date('date_close')->nullable();
            $table->time('hour_close')->nullable();
            $table->integer('value_card')->nullable();
            $table->integer('value_cash')->nullable();
            $table->integer('value_close')->nullable();
            $table->integer('value_sales')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cashiers');
    }
}
