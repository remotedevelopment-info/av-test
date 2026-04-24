import rawSdltConfig from '@/data/sdlt-rates.json';

type SdltFieldKey = 'purchasePrice' | 'firstTimeBuyer' | 'additionalProperty';

type SdltField = {
    key: SdltFieldKey;
    label: string;
    type: 'currency' | 'checkbox';
    help: string;
    inputMode?: 'decimal';
    min?: number;
    step?: number;
    placeholder?: string;
};

type SdltBand = {
    upTo: number | null;
    rate: number;
    label: string;
};

type SdltConfig = {
    meta: {
        name: string;
        jurisdiction: string;
        effectiveFrom: string;
        sources: string[];
    };
    fields: SdltField[];
    rates: {
        standard: {
            name: string;
            bands: SdltBand[];
        };
        firstTimeBuyer: {
            name: string;
            maximumEligiblePrice: number;
            bands: SdltBand[];
        };
        additionalProperty: {
            name: string;
            flatRate: number;
            minimumPurchasePrice: number;
            label: string;
        };
    };
};

export type SdltCalculationInput = {
    purchasePrice: number | null;
    firstTimeBuyer: boolean;
    additionalProperty: boolean;
};

export type SdltBreakdownLine = {
    label: string;
    taxableAmount: number;
    rate: number;
    tax: number;
};

export type SdltCalculationResult = {
    validationErrors: string[];
    notes: string[];
    scenarioLabel: string;
    totalTax: number;
    effectiveRate: number;
    breakdown: SdltBreakdownLine[];
};

export const sdltConfig = rawSdltConfig as SdltConfig;

export function calculateSdlt(
    input: SdltCalculationInput,
): SdltCalculationResult {
    const validationErrors: string[] = [];
    const notes: string[] = [];

    if (input.purchasePrice === null || Number.isNaN(input.purchasePrice)) {
        validationErrors.push('Enter a purchase price to calculate SDLT.');
    }

    if (input.purchasePrice !== null && input.purchasePrice <= 0) {
        validationErrors.push('Purchase price must be greater than £0.');
    }

    if (input.firstTimeBuyer && input.additionalProperty) {
        validationErrors.push(
            'First-time buyer relief cannot be combined with an additional property purchase.',
        );
    }

    if (validationErrors.length > 0 || input.purchasePrice === null) {
        return {
            validationErrors,
            notes,
            scenarioLabel: sdltConfig.rates.standard.name,
            totalTax: 0,
            effectiveRate: 0,
            breakdown: [],
        };
    }

    const purchasePrice = roundToPennies(input.purchasePrice);
    const standardScenario = sdltConfig.rates.standard;
    const firstTimeBuyerScenario = sdltConfig.rates.firstTimeBuyer;
    const additionalPropertyScenario = sdltConfig.rates.additionalProperty;

    const usesFirstTimeBuyerRates =
        input.firstTimeBuyer &&
        purchasePrice <= firstTimeBuyerScenario.maximumEligiblePrice;

    if (input.firstTimeBuyer && !usesFirstTimeBuyerRates) {
        notes.push(
            `First-time buyer relief stops above ${formatCurrency(firstTimeBuyerScenario.maximumEligiblePrice)}, so standard residential rates are used.`,
        );
    }

    const scenario = usesFirstTimeBuyerRates
        ? firstTimeBuyerScenario
        : standardScenario;

    const breakdown = calculateBands(purchasePrice, scenario.bands);

    if (
        input.additionalProperty &&
        purchasePrice >= additionalPropertyScenario.minimumPurchasePrice
    ) {
        breakdown.push({
            label: additionalPropertyScenario.label,
            taxableAmount: purchasePrice,
            rate: additionalPropertyScenario.flatRate,
            tax: roundToPennies(
                purchasePrice * additionalPropertyScenario.flatRate,
            ),
        });
    }

    if (
        input.additionalProperty &&
        purchasePrice < additionalPropertyScenario.minimumPurchasePrice
    ) {
        notes.push(
            `The additional property surcharge does not apply below ${formatCurrency(additionalPropertyScenario.minimumPurchasePrice)}.`,
        );
    }

    const rawTotalTax = roundToPennies(
        breakdown.reduce((total, line) => total + line.tax, 0),
    );
    const totalTax = roundDownToPounds(rawTotalTax);

    return {
        validationErrors: [],
        notes,
        scenarioLabel: scenario.name,
        totalTax,
        effectiveRate: purchasePrice === 0 ? 0 : totalTax / purchasePrice,
        breakdown,
    };
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatPercent(value: number, fractionDigits = 2): string {
    return new Intl.NumberFormat('en-GB', {
        style: 'percent',
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value);
}

export function formatRate(value: number): string {
    const percentage = value * 100;
    const fractionDigits = Number.isInteger(percentage) ? 0 : 2;

    return formatPercent(value, fractionDigits);
}

function calculateBands(
    purchasePrice: number,
    bands: SdltBand[],
): SdltBreakdownLine[] {
    let lowerBound = 0;

    return bands.flatMap((band) => {
        const upperBound = band.upTo ?? purchasePrice;
        const taxableAmount = Math.max(
            Math.min(purchasePrice, upperBound) - lowerBound,
            0,
        );

        lowerBound = upperBound;

        if (taxableAmount === 0) {
            return [];
        }

        return {
            label: band.label,
            taxableAmount,
            rate: band.rate,
            tax: roundToPennies(taxableAmount * band.rate),
        };
    });
}

function roundToPennies(value: number): number {
    return Math.round(value * 100) / 100;
}

function roundDownToPounds(value: number): number {
    return Math.floor(roundToPennies(value));
}