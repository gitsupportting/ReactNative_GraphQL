import { AllowVoidIfEmpty } from 'app-utils';
import route, { RouteOptions } from './_route';
import React from 'react';

const screens: [string, React.ComponentType<any>][] = [];

const register = <T extends {}>(name: string, component: React.ComponentType<T>, options: RouteOptions = {}) => {
    screens.push([name, component]);

    return route<AllowVoidIfEmpty<Omit<T, 'componentId'>>>(name, options);
};

export const getRegisteredScreens = () => screens;

export default register;
