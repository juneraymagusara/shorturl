<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

use App\Http\Controllers\UrlShortenerController;

Route::post('/shorten', [UrlShortenerController::class, 'shorten']);
Route::post('/expand', [UrlShortenerController::class, 'expand']);
Route::get('/{hash}', [UrlShortenerController::class, 'redirect'])->name('redirect');