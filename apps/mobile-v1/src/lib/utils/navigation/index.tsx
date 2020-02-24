import { Options as OriginalOptions } from './_navigation';
import { Route as OriginalRoute, RouteOptions as OriginalRouteOptions } from './_route';

export { default as Navigation } from './_navigation';
export { default as push } from './_push';
export { default as register, getRegisteredScreens } from './_register';
export { default as replaceRoot } from './_replaceRoot';
export { default as route } from './_route';

export type Options = OriginalOptions;
export type Route = OriginalRoute;
export type RouteOptions = OriginalRouteOptions;
