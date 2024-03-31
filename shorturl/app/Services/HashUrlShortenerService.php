<?php

namespace App\Services;

use Illuminate\Support\Str;
Use App\Models\Url;

class HashUrlShortenerService
{
    public function shortenUrl($longUrl)
    {
        $salt = hash('sha512', $longUrl);
        $dataWithSalt = $salt . $longUrl;
        $hashed = hash('adler32', $dataWithSalt);
        $shortUrl = route('redirect', $hashed); 

        $url = Url::where('short_url', $shortUrl)->first();

        if (!empty($url)) {
            $hashed = hash('crc32b', $shortUrl);
            $shortUrl = route('redirect', $hashed);
        }

        Url::create(['short_url' => $shortUrl, 'long_url' => $longUrl, 'last_access' => now()]);

        return $shortUrl;
    }
}