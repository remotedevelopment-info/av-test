<script lang="ts">
    import AppHead from '@/components/AppHead.svelte';
    import {
        calculateSdlt,
        formatCurrency,
        formatPercent,
        sdltConfig,
    } from '@/lib/sdlt';

    let pastedText = $state('');
    let hmrcResultInput = $state('');
    let firstTimeBuyerOverride: 'auto' | 'yes' | 'no' = $state('auto');

    const fieldCandidates = {
        propertyTenure: ['freehold or leasehold', 'tenure'],
        residential: [
            'residential or non-residential',
            'residential or non residential',
            'property type',
        ],
        effectiveDate: [
            'effective date of transaction',
            'effective date',
            'date of transaction',
        ],
        nonUkResident: ['non-uk resident', 'non uk resident'],
        individual: ['individual'],
        additionalProperty: [
            'additional residential property',
            'additional property',
        ],
        ownedOtherProperty: ['owned other property', 'own other property'],
        mainResidence: ['main residence'],
        firstTimeBuyer: [
            'first time buyer',
            'first-time buyer',
            'first time buyer relief',
            'all buyers are first-time buyers',
        ],
        purchasePrice: ['purchase price', 'price'],
        hmrcResult: [
            'sdlt due',
            'total sdlt',
            'tax due',
            'you must pay',
            'amount to pay',
            'stamp duty due',
        ],
    } as const;

    const knownLabels = Object.values(fieldCandidates)
        .flat()
        .sort((left, right) => right.length - left.length);

    type ParsedSummary = {
        entries: string[];
        keyValues: Array<{ key: string; value: string }>;
        issues: string[];
        warnings: string[];
        residential: boolean | null;
        additionalProperty: boolean | null;
        firstTimeBuyer: boolean | null;
        purchasePrice: number | null;
        hmrcResult: number | null;
        propertyTenure: 'freehold' | 'leasehold' | null;
        effectiveDate: string | null;
        effectiveDateSupported: boolean | null;
        nonUkResident: boolean | null;
        individual: boolean | null;
        ownedOtherProperty: boolean | null;
        mainResidence: boolean | null;
    };

    const entries = $derived.by(() =>
        pastedText
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0),
    );

    const hasEntries = $derived(entries.length > 0);

    const parsedSummary = $derived.by<ParsedSummary>(() => {
        const ignoredLines = new Set([
            'check your answers',
            'start again',
            'calculate your sdlt',
        ]);

        const lines = entries.filter(
            (line) => !ignoredLines.has(normalize(line)),
        );

        const keyValues = lines
            .map((line) => parseKeyValueLine(line))
            .filter((item): item is { key: string; value: string } => item !== null);

        const issues: string[] = [];
        const warnings: string[] = [];

        const propertyTenureValue = findValue(
            keyValues,
            fieldCandidates.propertyTenure,
        );
        const residentialValue = findValue(keyValues, fieldCandidates.residential);
        const effectiveDateValue = findValue(keyValues, fieldCandidates.effectiveDate);
        const nonUkResidentValue = findValue(
            keyValues,
            fieldCandidates.nonUkResident,
        );
        const individualValue = findValue(keyValues, fieldCandidates.individual);
        const additionalPropertyValue = findValue(
            keyValues,
            fieldCandidates.additionalProperty,
        );
        const ownedOtherPropertyValue = findValue(
            keyValues,
            fieldCandidates.ownedOtherProperty,
        );
        const mainResidenceValue = findValue(
            keyValues,
            fieldCandidates.mainResidence,
        );
        const firstTimeBuyerValue = findValue(
            keyValues,
            fieldCandidates.firstTimeBuyer,
        );
        const purchasePriceValue = findValue(keyValues, fieldCandidates.purchasePrice);
        const hmrcResultValue = findValue(keyValues, fieldCandidates.hmrcResult);

        const propertyTenure = parseTenure(propertyTenureValue);
        const residential = parseResidential(residentialValue);
        const effectiveDate = effectiveDateValue;
        const effectiveDateSupported = isSupportedEffectiveDate(effectiveDateValue);
        const nonUkResident = parseYesNo(nonUkResidentValue);
        const individual = parseYesNo(individualValue);
        const additionalProperty = parseYesNo(additionalPropertyValue);
        const ownedOtherProperty = parseYesNo(ownedOtherPropertyValue);
        const mainResidence = parseYesNo(mainResidenceValue);
        const firstTimeBuyer = parseYesNo(firstTimeBuyerValue);
        const purchasePrice = parseCurrency(purchasePriceValue);
        const hmrcResult = parseCurrency(hmrcResultValue);

        if (residential === false) {
            issues.push(
                'This checker expects a residential transaction; non-residential scenarios are not currently supported.',
            );
        }

        if (residential === null) {
            issues.push(
                'Could not read "Residential or non-residential" from the pasted HMRC summary.',
            );
        }

        if (propertyTenure === 'leasehold') {
            issues.push(
                'Leasehold-specific SDLT is not currently modeled in this exercise; use a freehold residential scenario for parity checks.',
            );
        }

        if (nonUkResident === true) {
            issues.push(
                'Non-UK resident surcharge is not currently modeled, so this scenario is out of scope for exact parity.',
            );
        }

        if (individual === false) {
            issues.push(
                'Non-individual buyers are not currently modeled, so this scenario is out of scope for exact parity.',
            );
        }

        if (effectiveDate !== null && effectiveDateSupported === false) {
            issues.push(
                `The effective date appears to be before ${sdltConfig.meta.effectiveFrom}, so the current rates file may not apply.`,
            );
        }

        if (effectiveDate === null) {
            warnings.push(
                'Effective date was not parsed; comparison assumes the current rates file applies.',
            );
        }

        if (purchasePrice === null) {
            issues.push('Could not parse a purchase price from the HMRC summary.');
        }

        if (additionalProperty === null) {
            issues.push(
                'Could not read "Additional residential property" as Yes/No from the HMRC summary.',
            );
        }

        if (firstTimeBuyer === null) {
            warnings.push(
                'First-time buyer status was not found in the HMRC summary; confirm it manually before comparing results.',
            );
        }

        if (
            firstTimeBuyer === true &&
            (ownedOtherProperty === true || mainResidence === false)
        ) {
            warnings.push(
                'The pasted summary looks inconsistent with first-time buyer relief. Check the copied HMRC answers before comparing results.',
            );
        }

        if (
            additionalProperty === true &&
            ownedOtherProperty === false
        ) {
            warnings.push(
                'HMRC summary says this is an additional property but also says no other property is owned. Check the pasted answers for formatting or copy issues.',
            );
        }

        return {
            entries: lines,
            keyValues,
            issues,
            warnings,
            residential,
            additionalProperty,
            firstTimeBuyer,
            purchasePrice,
            hmrcResult,
            propertyTenure,
            effectiveDate,
            effectiveDateSupported,
            nonUkResident,
            individual,
            ownedOtherProperty,
            mainResidence,
        };
    });

    const resolvedFirstTimeBuyer = $derived.by(() => {
        if (parsedSummary.firstTimeBuyer !== null) {
            return parsedSummary.firstTimeBuyer;
        }

        if (firstTimeBuyerOverride === 'yes') {
            return true;
        }

        if (firstTimeBuyerOverride === 'no') {
            return false;
        }

        return null;
    });

    const comparisonBlockers = $derived.by(() => {
        const blockers = [...parsedSummary.issues];

        if (resolvedFirstTimeBuyer === null) {
            blockers.push(
                'Confirm whether all buyers are first-time buyers before comparing this scenario.',
            );
        }

        return blockers;
    });

    const canCalculate = $derived(comparisonBlockers.length === 0);

    const derivedHmrcResult = $derived.by(() => {
        if (parsedSummary.hmrcResult !== null) {
            return parsedSummary.hmrcResult;
        }

        return parseCurrency(hmrcResultInput);
    });

    const calculatorInput = $derived.by(() => ({
        purchasePrice: canCalculate ? parsedSummary.purchasePrice : null,
        firstTimeBuyer: resolvedFirstTimeBuyer ?? false,
        additionalProperty: parsedSummary.additionalProperty ?? false,
    }));

    const calculation = $derived.by(() => calculateSdlt(calculatorInput));

    const difference = $derived.by(() => {
        if (derivedHmrcResult === null || !canCalculate) {
            return null;
        }

        return calculation.totalTax - derivedHmrcResult;
    });

    const isMatch = $derived.by(() =>
        difference === null ? null : Math.abs(difference) < 0.000001,
    );

    function clearText(): void {
        pastedText = '';
        hmrcResultInput = '';
        firstTimeBuyerOverride = 'auto';
    }

    function parseKeyValueLine(line: string): { key: string; value: string } | null {
        const withoutChange = line.replace(/\s*Change\s*$/i, '').trim();

        if (withoutChange.includes('\t')) {
            const parts = withoutChange
                .split('\t')
                .map((part) => part.trim())
                .filter((part) => part.length > 0);

            if (parts.length >= 2) {
                return { key: parts[0], value: parts[1] };
            }
        }

        const match = withoutChange.match(/^(.+?)\s{2,}(.+)$/);

        if (match) {
            return { key: match[1].trim(), value: match[2].trim() };
        }

        for (const label of knownLabels) {
            const labelMatch = withoutChange.match(
                new RegExp(`^(${escapeRegExp(label)})\\s+(.+)$`, 'i'),
            );

            if (labelMatch) {
                return {
                    key: labelMatch[1].trim(),
                    value: labelMatch[2].trim(),
                };
            }
        }

        return null;
    }

    function findValue(
        keyValues: Array<{ key: string; value: string }>,
        candidates: readonly string[],
    ): string | null {
        const candidateSet = new Set(candidates.map((item) => normalize(item)));

        const found = keyValues.find((item) =>
            candidateSet.has(normalize(item.key)),
        );

        return found ? found.value : null;
    }

    function parseYesNo(value: string | null): boolean | null {
        if (!value) {
            return null;
        }

        const normalized = normalize(value);

        if (normalized === 'yes') {
            return true;
        }

        if (normalized === 'no') {
            return false;
        }

        return null;
    }

    function parseResidential(value: string | null): boolean | null {
        if (!value) {
            return null;
        }

        const normalized = normalize(value);

        if (normalized === 'residential') {
            return true;
        }

        if (normalized === 'non residential') {
            return false;
        }

        return null;
    }

    function parseTenure(value: string | null): 'freehold' | 'leasehold' | null {
        if (!value) {
            return null;
        }

        const normalized = normalize(value);

        if (normalized === 'freehold') {
            return 'freehold';
        }

        if (normalized === 'leasehold') {
            return 'leasehold';
        }

        return null;
    }

    function parseCurrency(value: string | null): number | null {
        if (!value) {
            return null;
        }

        const match = value.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);

        if (!match) {
            return null;
        }

        const amount = Number(match[0]);

        return Number.isNaN(amount) ? null : amount;
    }

    function isSupportedEffectiveDate(value: string | null): boolean | null {
        if (!value) {
            return null;
        }

        const parsedDate = new Date(value);

        if (Number.isNaN(parsedDate.getTime())) {
            return null;
        }

        return parsedDate >= new Date(sdltConfig.meta.effectiveFrom);
    }

    function escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function normalize(value: string): string {
        return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    }
</script>

<AppHead title="HMRC Scenario Check" />

<div class="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_60%,#fef3c7_100%)] dark:bg-[linear-gradient(180deg,#0b1120_0%,#0f172a_60%,#1e293b_100%)] px-6 py-8 border border-slate-200/80 dark:border-slate-800 rounded-3xl text-slate-900 dark:text-slate-100">
    <main class="flex flex-col gap-6 mx-auto w-full max-w-5xl">
        <section class="bg-white/90 dark:bg-slate-950/70 shadow-sm p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
            <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                Scenario
            </p>
            <h1 class="mt-2 font-serif text-3xl">HMRC Calculator Input: £500,000</h1>
            <p class="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-7">
                Paste the HMRC check-your-answers summary and, if needed, the HMRC SDLT result. The checker now validates whether the pasted scenario is inside the exercise scope before running the calculator.
            </p>
        </section>

        <section class="gap-6 grid lg:grid-cols-3">
            <div class="bg-white/90 dark:bg-slate-950/70 shadow-sm p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
                <label for="hmrc-paste" class="font-semibold text-sm">Paste HMRC text</label>
                <textarea
                    id="hmrc-paste"
                    class="bg-white dark:bg-slate-900 mt-3 p-3 border border-slate-300 focus:border-slate-500 dark:border-slate-700 rounded-2xl outline-none w-full min-h-80 text-sm leading-6"
                    bind:value={pastedText}
                    placeholder="Paste HMRC calculator lines here..."
                ></textarea>
                <label for="hmrc-result" class="block mt-4 font-semibold text-sm">
                    HMRC SDLT result (optional)
                </label>
                <input
                    id="hmrc-result"
                    type="text"
                    class="bg-white dark:bg-slate-900 mt-2 p-3 border border-slate-300 focus:border-slate-500 dark:border-slate-700 rounded-2xl outline-none w-full text-sm leading-6"
                    bind:value={hmrcResultInput}
                    placeholder="e.g. £12,500"
                />
                <p class="mt-2 text-slate-500 dark:text-slate-400 text-xs leading-6">
                    Leave blank if the pasted summary already contains SDLT due.
                </p>

                {#if parsedSummary.firstTimeBuyer === null}
                    <div class="bg-slate-50 dark:bg-slate-900/60 mt-4 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p class="font-semibold text-sm">First-time buyer confirmation</p>
                        <p class="mt-1 text-slate-500 dark:text-slate-400 text-xs leading-6">
                            HMRC did not provide this field in the pasted summary. Confirm it before comparing results.
                        </p>
                        <div class="flex flex-wrap gap-2 mt-3">
                            <button
                                type="button"
                                class="rounded-full border px-4 py-2 text-sm font-medium transition {firstTimeBuyerOverride === 'yes'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-100'
                                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900'}"
                                onclick={() => (firstTimeBuyerOverride = 'yes')}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                class="rounded-full border px-4 py-2 text-sm font-medium transition {firstTimeBuyerOverride === 'no'
                                    ? 'border-cyan-500 bg-cyan-50 text-cyan-900 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-100'
                                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900'}"
                                onclick={() => (firstTimeBuyerOverride = 'no')}
                            >
                                No
                            </button>
                            <button
                                type="button"
                                class="rounded-full border px-4 py-2 text-sm font-medium transition {firstTimeBuyerOverride === 'auto'
                                    ? 'border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-100'
                                    : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900'}"
                                onclick={() => (firstTimeBuyerOverride = 'auto')}
                            >
                                Unset
                            </button>
                        </div>
                    </div>
                {/if}

                <div class="flex justify-end items-center mt-3">
                    <button
                        type="button"
                        class="hover:bg-slate-100 dark:hover:bg-slate-900 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-full font-medium text-sm transition"
                        onclick={clearText}
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div class="bg-white/90 dark:bg-slate-950/70 shadow-sm p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
                <h2 class="font-semibold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-[0.2em]">
                    Parsed summary fields
                </h2>

                {#if hasEntries}
                    <dl class="space-y-2 mt-4 text-sm leading-6">
                        {#if parsedSummary.keyValues.length > 0}
                            {#each parsedSummary.keyValues as field (`${field.key}:${field.value}`)}
                                <div class="gap-3 grid grid-cols-[1fr_auto] bg-slate-50 dark:bg-slate-900/60 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl">
                                    <dt class="font-medium text-slate-700 dark:text-slate-200">
                                        {field.key}
                                    </dt>
                                    <dd>{field.value}</dd>
                                </div>
                            {/each}
                        {:else}
                            <p class="bg-slate-50 dark:bg-slate-900/40 px-4 py-5 border border-slate-300 dark:border-slate-700 border-dashed rounded-2xl text-slate-500 dark:text-slate-400 text-sm">
                                No structured key/value lines found yet. Use HMRC summary lines that include a label, value, and optional Change text.
                            </p>
                        {/if}
                    </dl>
                {:else}
                    <p class="bg-slate-50 dark:bg-slate-900/40 mt-4 px-4 py-5 border border-slate-300 dark:border-slate-700 border-dashed rounded-2xl text-slate-500 dark:text-slate-400 text-sm">
                        No entries yet. Paste HMRC text on the left to parse the summary.
                    </p>
                {/if}
            </div>

            <div class="bg-white/90 dark:bg-slate-950/70 shadow-sm p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
                <h2 class="font-semibold text-slate-500 dark:text-slate-400 text-sm uppercase tracking-[0.2em]">
                    Calculator comparison
                </h2>

                <div class="space-y-3 mt-4 text-sm leading-6">
                    <div class="bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p>
                            Tenure:
                            <span class="font-semibold">
                                {parsedSummary.propertyTenure === null
                                    ? 'Unknown'
                                    : parsedSummary.propertyTenure === 'freehold'
                                      ? 'Freehold'
                                      : 'Leasehold'}
                            </span>
                        </p>
                        <p>
                            Residential:
                            <span class="font-semibold">
                                {parsedSummary.residential === null
                                    ? 'Unknown'
                                    : parsedSummary.residential
                                      ? 'Residential'
                                      : 'Non-residential'}
                            </span>
                        </p>
                        <p>
                            Non-UK resident:
                            <span class="font-semibold">
                                {parsedSummary.nonUkResident === null
                                    ? 'Unknown'
                                    : parsedSummary.nonUkResident
                                      ? 'Yes'
                                      : 'No'}
                            </span>
                        </p>
                        <p>
                            Individual buyer:
                            <span class="font-semibold">
                                {parsedSummary.individual === null
                                    ? 'Unknown'
                                    : parsedSummary.individual
                                      ? 'Yes'
                                      : 'No'}
                            </span>
                        </p>
                        <p>
                            Additional property:
                            <span class="font-semibold">
                                {parsedSummary.additionalProperty === null
                                    ? 'Unknown'
                                    : parsedSummary.additionalProperty
                                      ? 'Yes'
                                      : 'No'}
                            </span>
                        </p>
                        <p>
                            Owned other property:
                            <span class="font-semibold">
                                {parsedSummary.ownedOtherProperty === null
                                    ? 'Unknown'
                                    : parsedSummary.ownedOtherProperty
                                      ? 'Yes'
                                      : 'No'}
                            </span>
                        </p>
                        <p>
                            Main residence:
                            <span class="font-semibold">
                                {parsedSummary.mainResidence === null
                                    ? 'Unknown'
                                    : parsedSummary.mainResidence
                                      ? 'Yes'
                                      : 'No'}
                            </span>
                        </p>
                        <p>
                            First-time buyer:
                            <span class="font-semibold">
                                {resolvedFirstTimeBuyer === null
                                    ? 'Needs confirmation'
                                    : resolvedFirstTimeBuyer
                                      ? 'Yes'
                                      : 'No'}
                            </span>
                        </p>
                        <p>
                            Effective date:
                            <span class="font-semibold">
                                {parsedSummary.effectiveDate ?? 'Unknown'}
                            </span>
                        </p>
                        <p>
                            Purchase price:
                            <span class="font-semibold">
                                {parsedSummary.purchasePrice === null
                                    ? 'Unknown'
                                    : formatCurrency(parsedSummary.purchasePrice)}
                            </span>
                        </p>
                    </div>

                    {#if parsedSummary.issues.length > 0}
                        <ul class="space-y-2">
                            {#each parsedSummary.issues as issue (issue)}
                                <li class="bg-amber-50 dark:bg-amber-900/25 px-3 py-2 border border-amber-300/70 dark:border-amber-700/60 rounded-xl text-amber-900 dark:text-amber-100">
                                    {issue}
                                </li>
                            {/each}
                        </ul>
                    {/if}

                    {#if parsedSummary.warnings.length > 0}
                        <ul class="space-y-2">
                            {#each parsedSummary.warnings as warning (warning)}
                                <li class="bg-sky-50 dark:bg-sky-900/25 px-3 py-2 border border-sky-300/70 dark:border-sky-700/60 rounded-xl text-sky-900 dark:text-sky-100">
                                    {warning}
                                </li>
                            {/each}
                        </ul>
                    {/if}

                    {#if comparisonBlockers.length > 0}
                        <div class="bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
                            <p class="font-semibold">Comparison paused</p>
                            <p class="mt-1 text-slate-600 dark:text-slate-300 text-sm leading-6">
                                This scenario is either out of scope for the current exercise or needs missing input confirmed before exact-parity comparison can begin.
                            </p>
                        </div>
                    {:else if calculation.validationErrors.length > 0}
                        <ul class="space-y-2">
                            {#each calculation.validationErrors as error (error)}
                                <li class="bg-rose-50 dark:bg-rose-900/25 px-3 py-2 border border-rose-300/70 dark:border-rose-700/60 rounded-xl text-rose-900 dark:text-rose-100">
                                    {error}
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <div class="bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
                            <p>
                                Calculator SDLT result:
                                <span class="font-semibold">{formatCurrency(calculation.totalTax)}</span>
                            </p>
                            <p>
                                Effective rate:
                                <span class="font-semibold">{formatPercent(calculation.effectiveRate)}</span>
                            </p>
                            <p>
                                HMRC SDLT result:
                                <span class="font-semibold">
                                    {derivedHmrcResult === null
                                        ? 'Not provided'
                                        : formatCurrency(derivedHmrcResult)}
                                </span>
                            </p>

                            {#if isMatch !== null}
                                <p class="mt-2 rounded-xl px-3 py-2 font-semibold {isMatch
                                    ? 'border border-emerald-300/70 bg-emerald-50 text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-900/25 dark:text-emerald-100'
                                    : 'border border-rose-300/70 bg-rose-50 text-rose-900 dark:border-rose-700/60 dark:bg-rose-900/25 dark:text-rose-100'}">
                                    {#if isMatch}
                                        Exact match found. Does this match HMRC result? Yes.
                                    {:else}
                                        Difference found ({formatCurrency(Math.abs(difference ?? 0))}). Does this match HMRC result? No.
                                    {/if}
                                </p>
                            {:else}
                                <p class="bg-white dark:bg-slate-950 mt-2 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200">
                                    Provide HMRC SDLT result to complete the comparison.
                                </p>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        </section>
    </main>
</div>