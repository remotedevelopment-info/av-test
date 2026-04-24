<?php

test('plan markdown is displayed', function () {
    $response = $this->get(route('plan'));

    $response
        ->assertOk()
        ->assertSee('Goal', false)
        ->assertSee('Build a standalone Stamp Duty Land Tax (SDLT) calculator', false);
});