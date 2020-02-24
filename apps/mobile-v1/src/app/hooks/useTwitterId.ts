import useGraphqlMutation from 'app/hooks/useGraphqlMutation';
import useGraphqlQuery from 'app/hooks/useGraphqlQuery';
import { account as accountQuery, AccountQuery, updateTwitterId } from 'kora-api';
import { useCallback, useMemo } from 'react';
import { gql } from 'app/utils/graphql';

const updateTwitterIdGql = gql(updateTwitterId);
const accountQueryGql = gql(accountQuery);

type Service = Exclude<AccountQuery['account'], null>['services'][0];
const fallback: Service[] = [];

const useTwitterId = () => {
    const { data: account } = useGraphqlQuery<AccountQuery>(accountQueryGql);
    const [updateTwitter] = useGraphqlMutation<Service>(updateTwitterIdGql);
    const services = account?.account?.services ?? fallback;

    const setTwitterId = useCallback(
        async (userId: string) => {
            await updateTwitter({ twitterId: userId });
        },
        [updateTwitter],
    );

    const twitterId = useMemo(() => {
        const service = services.find(s => s.__typename === 'TwitterService');

        // We do this check again for typescript to narrow down union
        if (service && service.__typename === 'TwitterService') {
            return service.twitterId;
        }

        return undefined;
    }, [services]);

    return useMemo(() => ({ twitterId, setTwitterId }), [twitterId, setTwitterId]);
};

export default useTwitterId;
