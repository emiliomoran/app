<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Api\BaseController as BaseController;
use App\Cashier;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CashierOpen as CashierOpenResource;

class CashierController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function indexOpen()
    {
        $cashierOpen = Cashier::where('value_open', null)->orderBy('updated_at', 'DESC')->first();
        if (is_null($cashierOpen)) {
            return $this->sendResponseGetOpen(null);
        } else {
            return $this->sendResponseGetOpen(new CashierOpenResource($cashierOpen));
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function indexClose()
    {
        $cashierClose = Cashier::where('value_open', '!=', null)->orderBy('updated_at', 'DESC')->first();
        #return $cashierClose;
        return $this->sendResponseGetClose($cashierClose);
    }



    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function storeOpen(Request $request)
    {
        try {
            $cashierOpen = Cashier::where('value_open', null)->orderBy('updated_at', 'DESC')->first();

            $input = $request->all();

            $validator = Validator::make($input, [
                'date_open' => 'required',
                'hour_open' => 'required',
                'value_previous_close' => 'required|integer',
                'value_open' => 'integer',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation Error.', $validator->errors(), 500);
            }

            $cashierOpen->date_open = $input['date_open'];
            $cashierOpen->hour_open = $input['hour_open'];
            $cashierOpen->value_open = $input['value_open'];
            $cashierOpen->observation = $input['observation'];

            $cashierOpen->save();

            return $this->sendResponsePost(new CashierOpenResource($cashierOpen), 'Información guardada con éxito');
        } catch (\Throwable $th) {
            return $this->sendError('Server error.', [], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function storeClose(Request $request)
    {
        try {
            $cashierClose = Cashier::where('value_open', '!=', null)->orderBy('updated_at', 'DESC')->first();

            $input = $request->all();

            $validator = Validator::make($input, [
                'date_close' => 'required',
                'hour_close' => 'required',
                'value_card' => 'required|integer',
                'value_cash' => 'required|integer',
                'value_close' => 'required|integer',
                'value_open' => 'required|integer',
                'value_sales' => 'required|integer',
                //'expenses' => 'required'
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation Error.', $validator->errors(), 500);
            }

            $cashierClose->date_close = $input['date_close'];
            $cashierClose->hour_close = $input['hour_close'];
            $cashierClose->value_card = $input['value_card'];
            $cashierClose->value_cash = $input['value_cash'];
            $cashierClose->value_close = $input['value_close'];
            $cashierClose->value_open = $input['value_open'];
            $cashierClose->value_sales = $input['value_sales'];
            $cashierClose->expenses()->createMany($input['expenses']);

            $cashierClose->save();

            return $this->sendResponsePost(null, 'Información guardada con éxito');
        } catch (\Throwable $th) {
            return $this->sendError('Server error.', [], 500);
        }
    }
}
