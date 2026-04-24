<script lang="ts">
    import AppHead from '@/components/AppHead.svelte';
    import { Button } from '@/components/ui/button';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import {
        calculateSdlt,
        formatCurrency,
        formatPercent,
        formatRate,
        sdltConfig,
    } from '@/lib/sdlt';

    const purchasePriceField = sdltConfig.fields.find(
        (field) => field.key === 'purchasePrice',
    );
    const checkboxFields = sdltConfig.fields.filter(
        (field) => field.type === 'checkbox',
    );

    let purchasePriceInput = $state('');
    let firstTimeBuyer = $state(false);
    let additionalProperty = $state(false);

    const started = $derived(
        purchasePriceInput.trim().length > 0 ||
            firstTimeBuyer ||
            additionalProperty,
    );

    const purchasePrice = $derived.by(() => {
        const normalized = purchasePriceInput.replace(/[^0-9.]/g, '');

        if (normalized.length === 0) {
            return null;
        }

        const parsed = Number(normalized);

        return Number.isNaN(parsed) ? null : parsed;
    });

    const calculation = $derived.by(() =>
        calculateSdlt({
            purchasePrice,
            firstTimeBuyer,
            additionalProperty,
        }),
    );

    function resetForm(): void {
        purchasePriceInput = '';
        firstTimeBuyer = false;
        additionalProperty = false;
    }

    function updatePurchasePrice(event: Event): void {
        purchasePriceInput = (event.currentTarget as HTMLInputElement).value;
    }
</script>

<AppHead title="SDLT Calculator" />

<div class="bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_45%,#f8fafc_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_45%,#020617_100%)] min-h-screen text-slate-950 dark:text-slate-50">
    <main class="flex flex-col gap-8 mx-auto px-6 lg:px-8 py-10 lg:py-14 w-full max-w-7xl">
        <section class="lg:items-start gap-6 grid lg:grid-cols-[1.15fr_0.85fr]">
            <div class="space-y-5">
                <div class="inline-flex items-center bg-amber-100/80 dark:bg-amber-500/10 px-3 py-1 border border-amber-300/70 dark:border-amber-500/30 rounded-full font-semibold text-amber-900 dark:text-amber-200 text-xs uppercase tracking-[0.2em]">
                    JSON-driven calculation
                </div>

                <div class="space-y-4">
                    <h1 class="max-w-3xl font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight">
                        Stamp Duty calculator powered entirely by a single rates file.
                    </h1>
                    <p class="max-w-2xl text-slate-600 dark:text-slate-300 text-base leading-7">
                        The frontend imports a JSON file as the source of truth for SDLT bands, first-time buyer relief, and the additional property surcharge. Every figure below is derived from that data.
                    </p>
                </div>

                <div class="gap-4 grid sm:grid-cols-3">
                    <div class="bg-white/80 dark:bg-slate-950/50 shadow-sm backdrop-blur p-4 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                        <div class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                            Effective from
                        </div>
                        <div class="mt-2 font-semibold text-lg">
                            {sdltConfig.meta.effectiveFrom}
                        </div>
                    </div>
                    <div class="bg-white/80 dark:bg-slate-950/50 shadow-sm backdrop-blur p-4 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                        <div class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                            Jurisdiction
                        </div>
                        <div class="mt-2 font-semibold text-lg">
                            {sdltConfig.meta.jurisdiction}
                        </div>
                    </div>
                    <div class="bg-white/80 dark:bg-slate-950/50 shadow-sm backdrop-blur p-4 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                        <div class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                            Source file
                        </div>
                        <div class="mt-2 font-semibold text-lg">
                            sdlt-rates.json
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white/90 dark:bg-slate-950/70 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur p-6 border border-slate-200/80 dark:border-slate-800 rounded-4xl">
                <div class="space-y-5">
                    <div>
                        <h2 class="font-semibold text-xl">Purchase details</h2>
                        <p class="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-6">
                            Change the inputs and the totals recalculate instantly from the imported JSON rate data.
                        </p>
                    </div>

                    {#if purchasePriceField}
                        <div class="gap-2 grid">
                            <Label for="purchase-price">{purchasePriceField.label}</Label>
                            <Input
                                id="purchase-price"
                                type="text"
                                inputmode={purchasePriceField.inputMode}
                                placeholder={purchasePriceField.placeholder}
                                value={purchasePriceInput}
                                oninput={updatePurchasePrice}
                            />
                            <p class="text-slate-500 dark:text-slate-400 text-sm leading-6">
                                {purchasePriceField.help}
                            </p>
                        </div>
                    {/if}

                    <div class="gap-4 grid">
                        {#each checkboxFields as field (field.key)}
                            <Label
                                for={field.key}
                                class="flex items-start gap-3 bg-slate-50/80 dark:bg-slate-900/60 p-4 border border-slate-200/80 dark:border-slate-800 rounded-2xl leading-6"
                            >
                                {#if field.key === 'firstTimeBuyer'}
                                    <Checkbox
                                        id={field.key}
                                        bind:checked={firstTimeBuyer}
                                    />
                                {:else}
                                    <Checkbox
                                        id={field.key}
                                        bind:checked={additionalProperty}
                                    />
                                {/if}
                                <span class="gap-1 grid">
                                    <span class="font-medium text-slate-950 dark:text-slate-50">
                                        {field.label}
                                    </span>
                                    <span class="text-slate-500 dark:text-slate-400 text-sm">
                                        {field.help}
                                    </span>
                                </span>
                            </Label>
                        {/each}
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <Button type="button" variant="outline" onclick={resetForm}>
                            Reset inputs
                        </Button>
                        <span class="text-slate-500 dark:text-slate-400 text-sm">
                            Rates sourced from GOV.UK guidance and encoded in JSON.
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <section class="gap-6 grid lg:grid-cols-[0.9fr_1.1fr]">
            <div class="bg-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.18)] p-6 border border-slate-200/80 dark:border-slate-800 rounded-4xl text-white">
                <div class="space-y-3">
                    <p class="font-semibold text-amber-300 text-xs uppercase tracking-[0.2em]">
                        Calculation summary
                    </p>

                    {#if !started}
                        <div class="space-y-3">
                            <h2 class="font-semibold text-3xl">Ready when you are.</h2>
                            <p class="max-w-xl text-slate-300 text-sm leading-7">
                                Enter a purchase price and choose the buyer circumstances to see the SDLT total, effective rate, and line-by-line tax breakdown.
                            </p>
                        </div>
                    {:else if calculation.validationErrors.length > 0}
                        <div class="space-y-4">
                            <h2 class="font-semibold text-3xl">Calculation needs attention.</h2>
                            <ul class="gap-3 grid text-rose-200 text-sm leading-6">
                                {#each calculation.validationErrors as error (error)}
                                    <li class="bg-rose-500/10 px-4 py-3 border border-rose-400/30 rounded-2xl">
                                        {error}
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {:else}
                        <div class="space-y-5">
                            <div>
                                <h2 class="font-semibold text-4xl tracking-tight">
                                    {formatCurrency(calculation.totalTax)}
                                </h2>
                                <p class="mt-2 text-slate-300 text-base">
                                    Total SDLT based on {calculation.scenarioLabel.toLowerCase()}.
                                </p>
                            </div>

                            <div class="gap-4 grid sm:grid-cols-2">
                                <div class="bg-white/5 p-4 border border-white/10 rounded-2xl">
                                    <div class="font-semibold text-slate-400 text-xs uppercase tracking-[0.2em]">
                                        Effective rate
                                    </div>
                                    <div class="mt-2 font-semibold text-2xl">
                                        {formatPercent(calculation.effectiveRate)}
                                    </div>
                                </div>
                                <div class="bg-white/5 p-4 border border-white/10 rounded-2xl">
                                    <div class="font-semibold text-slate-400 text-xs uppercase tracking-[0.2em]">
                                        Rate basis
                                    </div>
                                    <div class="mt-2 font-semibold text-2xl">
                                        {calculation.scenarioLabel}
                                    </div>
                                </div>
                            </div>

                            {#if calculation.notes.length > 0}
                                <div class="gap-3 grid">
                                    {#each calculation.notes as note (note)}
                                        <div class="bg-amber-400/10 px-4 py-3 border border-amber-400/20 rounded-2xl text-amber-100 text-sm leading-6">
                                            {note}
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>

            <div class="bg-white/90 dark:bg-slate-950/70 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur p-6 border border-slate-200/80 dark:border-slate-800 rounded-4xl">
                <div class="flex flex-col gap-5">
                    <div>
                        <h2 class="font-semibold text-xl">Breakdown</h2>
                        <p class="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-6">
                            The breakdown uses plain language so a client can see how each slice of the price is taxed.
                        </p>
                    </div>

                    {#if calculation.breakdown.length === 0}
                        <div class="bg-slate-50/80 dark:bg-slate-900/50 px-4 py-5 border border-slate-300 dark:border-slate-700 border-dashed rounded-2xl text-slate-500 dark:text-slate-400 text-sm leading-6">
                            No breakdown to show yet.
                        </div>
                    {:else}
                        <div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                            <table class="divide-y divide-slate-200 dark:divide-slate-800 min-w-full text-sm">
                                <thead class="bg-slate-50 dark:bg-slate-900/80">
                                    <tr>
                                        <th class="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-left">
                                            Portion
                                        </th>
                                        <th class="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-right">
                                            Taxable amount
                                        </th>
                                        <th class="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-right">
                                            Rate
                                        </th>
                                        <th class="px-4 py-3 font-medium text-slate-600 dark:text-slate-300 text-right">
                                            SDLT
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                                    {#each calculation.breakdown as line (line.label)}
                                        <tr class="align-top">
                                            <td class="px-4 py-4 text-slate-700 dark:text-slate-200 leading-6">
                                                {line.label}
                                            </td>
                                            <td class="px-4 py-4 font-medium text-slate-900 dark:text-slate-50 text-right">
                                                {formatCurrency(line.taxableAmount)}
                                            </td>
                                            <td class="px-4 py-4 text-slate-600 dark:text-slate-300 text-right">
                                                {formatRate(line.rate)}
                                            </td>
                                            <td class="px-4 py-4 font-semibold text-slate-900 dark:text-slate-50 text-right">
                                                {formatCurrency(line.tax)}
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    {/if}

                    <div class="bg-slate-50/80 dark:bg-slate-900/50 p-4 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 text-sm leading-7">
                        <p class="font-medium text-slate-900 dark:text-slate-50">
                            Source-of-truth rules included in the JSON file
                        </p>
                        <ul class="gap-2 grid mt-3">
                            <li>
                                Standard bands: {sdltConfig.rates.standard.bands.length}
                            </li>
                            <li>
                                First-time buyer cap: {formatCurrency(sdltConfig.rates.firstTimeBuyer.maximumEligiblePrice)}
                            </li>
                            <li>
                                Additional property surcharge: {formatRate(sdltConfig.rates.additionalProperty.flatRate)}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>