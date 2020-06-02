<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CashierOpen extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'date_open' => $this->date_open,
            'hour_open' => $this->hour_open,
            'value_previous_close' => intval($this->value_previous_close),
            'value_open' => is_null($this->value_open) ? $this->value_open : intval($this->value_open),
            'observation' => is_null($this->observation) ? "" : $this->observation,
        ];
    }
}
