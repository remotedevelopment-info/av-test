<?php

use Inertia\Testing\AssertableInertia as Assert;

test('hmrc scenario 500000 page is displayed', function () {
    $this->get(route('scenarios.hmrc.500000'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('scenarios/hmrc/500000'),
        );
});