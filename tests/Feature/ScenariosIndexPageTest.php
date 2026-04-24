<?php

use Inertia\Testing\AssertableInertia as Assert;

test('scenarios index page is displayed', function () {
    $this->get(route('scenarios.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('scenarios/Index'),
        );
});

test('hmrc scenarios index page is displayed', function () {
    $this->get(route('scenarios.hmrc.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('scenarios/hmrc/Index'),
        );
});