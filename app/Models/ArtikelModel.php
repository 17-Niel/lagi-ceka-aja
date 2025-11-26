<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtikelModel extends Model
{
    use HasFactory;

    protected $table = 'm_artikels';

    protected $fillable = [
        'title',
        'content',
        'category',
        'is_published',
        'user_id',
    ];
}
