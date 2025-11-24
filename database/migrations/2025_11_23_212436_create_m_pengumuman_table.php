<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('m_pengumuman', function (Blueprint $table) {
            $table->id();
            $table->string('judul'); // Judul pengumuman
            $table->text('isi'); // Isi pengumuman (bisa panjang)
            $table->date('expired_date'); // Tanggal kedaluwarsa
            $table->string('gambar_path')->nullable(); // Menyimpan path file gambar (jpg/png)
            $table->timestamps(); // Created_at & Updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_pengumuman');
    }
};