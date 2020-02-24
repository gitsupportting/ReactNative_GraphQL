import { Length, Measure, meters, grams, Mass, kilo, watts, hours, GenericMeasure, Unit } from 'safe-units';

export const toMeters = (m: number) => toDistance(m, meters);

export const toGrams = (g: number) => toWeight(g, grams);

export const toNumber = (num: number) => Measure.dimensionless(num);

export const toDistance = (m: number, units = meters) => Measure.of(m, units);

export const toWeight = (g: number, units = grams) => Measure.of(g, units);

export const km = kilo(meters);

export const kg = kilo(grams);

export const gramsPerKilometer = grams.per(km);

export const kwh = kilo(watts).per(hours);

export const gramsPerKwh = grams.per(kwh);

export const kwhPerKilometer = kwh.per(km);

export { Length, Mass, Measure, meters };

export const getBestUnit = (measure: Measure<any>): GenericMeasure<number, any> | undefined => {
    if ('length' in measure.unit) {
        // Distance base unit is meters
        return measure.value >= 800 ? km : meters;
    } else if ('mass' in measure.unit) {
        // Mass base unit is kg
        return measure.value >= 0.8 ? kg : grams;
    } else {
        return undefined;
    }
};

export const formatDistance = (distance: number, inUnits = km) =>
    toMeters(distance).in(inUnits, { formatValue: value => value.toFixed(2) });

export const formatWeight = (mass: number, inUnits = kg) =>
    toGrams(mass).in(inUnits, { formatValue: value => value.toFixed(2) });

export const prettyFormatDistance = (distance: number) => {
    const inUnits = distance > 1000 ? km : meters;

    return toMeters(distance).in(inUnits, { formatValue: value => value.toFixed(2).replace(/(\.0+$)|(0+$)/, '') });
};

export const prettyFormatWeight = (weight: number) => {
    const inUnits = weight > 500 ? kg : grams;

    return toGrams(weight).in(inUnits, { formatValue: value => value.toFixed(2).replace(/(\.0+$)|(0+$)/, '') });
};

const formatter = new Intl.NumberFormat();
export const prettyFormatNumber = (num: number) => formatter.format(num);

export const prettyFormat = <U extends Unit>(measure: Measure<U>): string => {
    const bestIn = getBestUnit(measure);

    return bestIn
        ? measure.in(bestIn, { formatValue: value => value.toFixed(2).replace(/(\.0+$)|(0+$)/, '') })
        : `${measure.value}`;
};
