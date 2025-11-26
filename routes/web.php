<?php

use App\Http\Controllers\App\HakAkses\HakAksesController;
use App\Http\Controllers\App\Home\HomeController;
use App\Http\Controllers\App\Todo\TodoController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\App\Pengumuman\PengumumanController;
use App\Http\Controllers\App\Berita\BeritaController;
use App\Http\Controllers\App\Artikel\ArtikelController;

Route::middleware(['throttle:req-limit', 'handle.inertia'])->group(function () {
    // SSO Routes
    Route::group(['prefix' => 'sso'], function () {
        Route::get('/callback', [AuthController::class, 'ssoCallback'])->name('sso.callback');
    });

    // Authentication Routes
    Route::prefix('auth')->group(function () {
        // Login Routes
        Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/login-check', [AuthController::class, 'postLoginCheck'])->name('auth.login-check');
        Route::post('/login-post', [AuthController::class, 'postLogin'])->name('auth.login-post');

        // Logout Route
        Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');

        // TOTP Routes
        Route::get('/totp', [AuthController::class, 'totp'])->name('auth.totp');
        Route::post('/totp-post', [AuthController::class, 'postTotp'])->name('auth.totp-post');
    });

    // Protected Routes
    Route::group(['middleware' => 'check.auth'], function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');

        // Hak Akses Routes
        Route::prefix('hak-akses')->group(function () {
            Route::get('/', [HakAksesController::class, 'index'])->name('hak-akses');
            Route::post('/change', [HakAksesController::class, 'postChange'])->name('hak-akses.change-post');
            Route::post('/delete', [HakAksesController::class, 'postDelete'])->name('hak-akses.delete-post');
            Route::post('/delete-selected', [HakAksesController::class, 'postDeleteSelected'])->name('hak-akses.delete-selected-post');
        });

        // Todo Routes
        Route::prefix('todo')->group(function () {
            Route::get('/', [TodoController::class, 'index'])->name('todo');
            Route::post('/change', [TodoController::class, 'postChange'])->name('todo.change-post');
            Route::post('/delete', [TodoController::class, 'postDelete'])->name('todo.delete-post');
        });
        

        Route::prefix('pengumuman')->name('pengumuman.')->group(function () {
            Route::get('/', [PengumumanController::class, 'index'])->name('index');
            Route::post('/change', [PengumumanController::class, 'postChange'])->name('change');
            Route::post('/delete', [PengumumanController::class, 'postDelete'])->name('delete');
        });

        // Route Khusus Berita
    Route::prefix('berita')->name('berita.')->group(function () {
        Route::get('/', [BeritaController::class, 'index'])->name('index'); 
        
        // Action Simpan & Hapus
        Route::post('/store', [BeritaController::class, 'store'])->name('store');
        Route::post('/delete', [BeritaController::class, 'destroy'])->name('delete');
    });
        // Artikel Routes
        Route::prefix('artikel')->group(function () {
            Route::get('/', [ArtikelController::class, 'index'])->name('artikel');
            Route::post('/change', [ArtikelController::class, 'changePost'])->name('artikel.change-post');
            Route::post('/delete', [ArtikelController::class, 'deletePost'])->name('artikel.delete-post');
        });
    
    });
});
