<?php

use Illuminate\Support\Facades\File;

test('process markdown is displayed and the request is recorded', function () {
    $path = base_path('PROCESS.md');
    $originalContent = File::get($path);

    try {
        $response = $this->get(route('process'));

        $response
            ->assertOk()
            ->assertSee('Process Log: JSON-Driven Application Calculator', false)
            ->assertSee('Request Log', false);

        expect(File::get($path))->toContain('GET /process');
    } finally {
        File::put($path, $originalContent);
    }
});