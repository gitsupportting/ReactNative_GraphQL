import { ServiceConfig, Services } from 'app/features/integrations/constants';
import { createAction } from 'typesafe-actions';

export const enable = createAction(
    'integration/ENABLE',
    <T extends Services>(service: T, config: ServiceConfig[T]) => ({ service, config }),
)();
