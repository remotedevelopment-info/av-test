<?php

use Inertia\Testing\AssertableInertia as Assert;

test('calculator page is displayed', function () {
    $this->get(route('calculator'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Calculator'),
        );
});