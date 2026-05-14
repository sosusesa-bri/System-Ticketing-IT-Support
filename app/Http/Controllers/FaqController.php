<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        $faqs = Faq::with('attachments')
            ->active()
            ->orderBy('category')
            ->orderBy('sort_order')
            ->get()
            ->map(function($faq) {
                $faqArray = $faq->toArray();
                $faqArray['attachments'] = $faq->attachments->map(function($att) {
                    return [
                        'id' => $att->id,
                        'file_name' => $att->file_name,
                        'file_type' => $att->file_type,
                        'file_size' => $att->file_size,
                        'url' => asset('storage/' . $att->file_path),
                    ];
                });
                return $faqArray;
            })
            ->groupBy('category');

        return Inertia::render('Faq/Index', [
            'faqsByCategory' => $faqs,
        ]);
    }
}
