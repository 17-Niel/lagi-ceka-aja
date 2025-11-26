<?php

namespace App\Http\Controllers\App\Berita;

use App\Http\Controllers\Controller;
use App\Models\BeritaModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BeritaController extends Controller
{
    // Jika Anda ingin halaman khusus Berita (terpisah dari pengumuman)
    public function index(Request $request)
    {
        $query = BeritaModel::query();

        if ($request->search) {
            $searchTerm = strtolower($request->search);
            $query->whereRaw('LOWER(judul) LIKE ?', ["%{$searchTerm}%"]);
        }

        $data = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('app/berita/berita-page', [
            'data' => $data,
            'filters' => $request->only(['search']),
        ]);
    }

    // Fungsi Simpan (Tambah / Edit)
    public function store(Request $request)
    {
        try {
            $request->validate([
                'judul' => 'required|string|max:255',
                'deskripsi' => 'required|string',
                'gambar' => 'nullable|mimes:jpg,jpeg,png|max:2048', 
            ]);

            $data = [
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
            ];

            // Upload Gambar
            if ($request->hasFile('gambar')) {
                // Jika Edit, hapus gambar lama
                if ($request->id) {
                    $old = BeritaModel::find($request->id);
                    if ($old && $old->gambar_path) {
                        Storage::disk('public')->delete($old->gambar_path);
                    }
                }
                
                $path = $request->file('gambar')->store('uploads/berita', 'public');
                $data['gambar_path'] = $path;
            }

            BeritaModel::updateOrCreate(['id' => $request->id], $data);

            return redirect()->back()->with('success', 'Berita berhasil disimpan');
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    // Fungsi Hapus
    public function destroy(Request $request)
    {
        $item = BeritaModel::find($request->id);
        if ($item) {
            if ($item->gambar_path) {
                Storage::disk('public')->delete($item->gambar_path);
            }
            $item->delete();
        }
        return redirect()->back()->with('success', 'Berita berhasil dihapus');
    }
}