<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Laravel\Fortify\Features;

Route::inertia('/', 'Welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('calculator', 'Calculator')->name('calculator');

Route::get('plan', function () {
    abort_unless(File::exists(base_path('PLAN.md')), 404);

    return response()->view('plan', [
        'title' => 'Plan',
        'content' => Str::markdown(File::get(base_path('PLAN.md'))),
    ]);
})->name('plan');

Route::get('process', function (Request $request) {
    $path = base_path('PROCESS.md');

    abort_unless(File::exists($path), 404);

    $requestLogHeading = '## Request Log';
    $requestLogEntry = sprintf(
        '- %s %s /%s',
        now()->toIso8601String(),
        $request->method(),
        ltrim($request->path(), '/')
    );

    $content = File::get($path);

    if (! str_contains($content, $requestLogHeading)) {
        $content .= PHP_EOL.PHP_EOL.$requestLogHeading.PHP_EOL;
    }

    File::put($path, rtrim($content).PHP_EOL.$requestLogEntry.PHP_EOL);

    return response()->view('plan', [
        'title' => 'Process',
        'content' => Str::markdown(File::get($path)),
    ]);
})->name('process');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
