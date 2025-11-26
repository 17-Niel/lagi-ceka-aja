<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BeritaModel extends Model
{
    use HasFactory;

    protected $table = 'm_berita'; // Ganti dari 'berita' ke 'm_berita'
    protected $fillable = [
        'judul',
        'deskripsi',
        'gambar_path',
    ];
}