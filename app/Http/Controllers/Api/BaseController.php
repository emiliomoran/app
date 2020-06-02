<?php

namespace App\Http\Controllers\API;


use Illuminate\Http\Request;
use App\Http\Controllers\Controller as Controller;


class BaseController extends Controller
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function sendResponseGetOpen($results)
    {
        $response = [
            'status' => 'Success',
            'results' => $results,
        ];


        return response()->json($response, 200);
    }

    public function sendResponseGetClose($results)
    {
        $response = [
            'msg' => 'Success',
            'results' => true,
            'value' => $results->value_open,
            'close' => is_null($results->value_close) ? "0" : $results->value_close,
            'card' => is_null($results->value_card) ? "0" : $results->value_card
        ];

        return response()->json($response, 200);
    }


    public function sendResponsePost($results, $msg)
    {
        $response = [
            'msg' => $msg,
            'results' => $results
        ];

        return response()->json($response, 200);
    }

    /**
     * return error response.
     *
     * @return \Illuminate\Http\Response
     */
    public function sendError($error, $errorMessages = [], $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];


        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }


        return response()->json($response, $code);
    }
}
