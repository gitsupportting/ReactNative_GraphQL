import { FC as ReactFC } from 'react';
import { Options } from '../navigation';

interface ScreenProps {
    componentId: string;
}

export type FC<Props = {}> = ReactFC<Props>;

export type ScreenComponent<Props = {}> = FC<Props & ScreenProps> & { options?: Options | ((props: Props) => Options) };

export type PropsWithoutScreen<P> = Omit<P, keyof ScreenProps>;
