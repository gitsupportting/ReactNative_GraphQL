export const unit = 8;

const spacing = (size: number, ...rest: number[]) =>
    rest.length ? `${size * unit}px ${rest.map(pos => pos * unit).join('px ')}px` : unit * size;

export default spacing;
