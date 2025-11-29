<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengumumanModel extends Model
{
    use HasFactory;

    protected $table = 'm_pengumuman';

    protected $fillable = [
        'judul',
        'isi',
        'expired_date',
        'gambar_path',
    ];

    // Tambahkan casting untuk dates
    protected $casts = [
        'expired_date' => 'date:Y-m-d',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}