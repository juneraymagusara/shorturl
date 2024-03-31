<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;
use App\Services\HashUrlShortenerService;
Use App\Models\Url;

class UrlShortenerController extends Controller
{
    protected $hashUrlShortenerService;

    public function __construct(HashUrlShortenerService $hashUrlShortenerService)
    {
        $this->hashUrlShortenerService = $hashUrlShortenerService;
    }

    public function shorten(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'url' => 'required|url',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => '0', 'message' =>'URL is not valid.']);
            }

            \DB::beginTransaction();
            $longUrl = $request->input('url');

            if(strlen($longUrl) < 50) {
                return response()->json(['success' => '0', 'message' =>'URL is too short.']);
            }

            $url = Url::where('long_url', $longUrl)->first();
        
            if (!empty($url)) {
                $url->last_access = now();
                $url->save();
    
                return response()->json(['success' => '1', 'short_url' => $url->short_url, 'message' => 'Shorten URL is available.']);
            }

            $shortUrl = $this->hashUrlShortenerService->shortenUrl($longUrl);
    
            \DB::commit();

            return response()->json(['success' => '1', 'short_url' => $shortUrl, 'message' => 'Shorten URL successfully created.']);
        } catch (\Exception $e) {
            \DB::rollBack();
            report($e);
            return response()->json(['success' => '0', 'message' => $e->getMessage()]);
        }  
        
    }

    public function expand(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'url' => 'required|url',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => '0', 'message' =>'URL is not valid.']);
            }


            \DB::beginTransaction();
            $shortUrl = $request->input('url');

            if(strlen($shortUrl) > strlen(url('')) + 9) {
                return response()->json(['success' => '0', 'message' =>'URL is too long.']);
            }

            $url = Url::where('short_url', $shortUrl)->first();

            $longUrl = $url->long_url;
            $url->last_access = now();
            $url->save();

            \DB::commit();

            return response()->json(['success' => '1', 'long_url' => $longUrl, 'message' => 'Original URL is available.']);
        } catch (\Exception $e) {
            \DB::rollBack();
            report($e);
            return response()->json(['success' => '0', 'message' => "URL is not available."]);
        }  
    }

    public function redirect($hash)
    {
        try {
            \DB::beginTransaction();
            $url = Url::where('short_url', route('redirect', $hash))->first();
            $longUrl = $url->long_url;
            $url->last_access = now();
            $url->save();

            \DB::commit();

            return redirect()->away($longUrl);
        } catch (\Exception $e) {
            \DB::rollBack();
            report($e);
            return response()->json(['success' => '0', 'message' => "URL is not available."]);
        }  
    }
}