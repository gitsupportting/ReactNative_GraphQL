import { gramsPerKilometer, gramsPerKwh, kwhPerKilometer, Length, Mass, Measure, toMeters } from 'lib/utils/units';
import { wrapUnaryFn } from 'safe-units';

// CO2e g/kWh
const co2ePerKWh = Measure.of(296, gramsPerKwh);

const co2PerMeter = {
    walking: Measure.of(0, gramsPerKilometer),
    cycling: Measure.of(5, gramsPerKilometer),
    moped: Measure.of(73, gramsPerKilometer),
    motorcycle: Measure.of(94, gramsPerKilometer),
    electric: Measure.of(43, gramsPerKilometer),
    hybrid: Measure.of(84, gramsPerKilometer),
    car: Measure.of(200, gramsPerKilometer),
    bus: Measure.of(68, gramsPerKilometer),
    taxi: Measure.of(170, gramsPerKilometer),
    metro: Measure.of(65, gramsPerKilometer),
    tram: Measure.of(42, gramsPerKilometer),
    scooter: Measure.of(1.12 / 100, kwhPerKilometer).times(co2ePerKWh), // 1.12 kWh/100 km
    eBike: Measure.of(3.33 / 100, kwhPerKilometer).times(co2ePerKWh), // 3.33 kWh/100 km
    tesla: Measure.of(17.25 / 100, kwhPerKilometer).times(co2ePerKWh), // 17.25 kWh/100 km
};

export const co2e = (distance: Length, type: keyof typeof co2PerMeter): Mass => distance.times(co2PerMeter[type]);

export const formatCo2 = (kgCo2e: Mass) => `${kgCo2e.value.toFixed(2)} ${kgCo2e.unit.mass![0]}`;

interface Distances {
    walkingDistance?: number;
    cyclingDistance?: number;
}

export const co2Saved = ({ walkingDistance = 0, cyclingDistance = 0 }: Distances) => {
    const totalDistance = walkingDistance + cyclingDistance;
    const carCo2 = co2e(toMeters(totalDistance), 'car');
    const footprint = co2Footprint({ walkingDistance, cyclingDistance });

    return carCo2.minus(footprint);
};

export const co2Footprint = ({ walkingDistance = 0, cyclingDistance = 0 }: Distances) => {
    const walkingCo2 = co2e(toMeters(walkingDistance), 'walking');
    const cyclingCo2 = co2e(toMeters(cyclingDistance), 'cycling');
    // Round out to full grams
    const measureRound = wrapUnaryFn((num: number) => Math.round(num * 1000) / 1000);

    return measureRound(walkingCo2.plus(cyclingCo2));
};
