import { endOfDay, isToday, startOfDay } from 'date-fns';
import SafeAreaView from 'lib/components/SafeAreaView';
import View from 'lib/components/View';
import useScreenTitles from 'lib/hooks/useScreenTitles';
import { styled } from 'lib/stylesheet';
import { ScreenComponent } from 'lib/utils/component';
import { format } from 'lib/utils/date';
import React, { useCallback, useMemo, useState } from 'react';
import CalendarList from './CalendarList';
import History from './History';
import Today from './Today';

const BubblesContainer = styled(View)`
    flex-grow: 2;
    flex-flow: row;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 100%;
`;

const Container = styled(SafeAreaView)`
    align-items: center;
    justify-content: center;
    flex-flow: column;
    height: 100%;
`;

const Dashboard: ScreenComponent = ({ componentId }) => {
    const [date, setDate] = useState(new Date());

    const isTodayDate = isToday(date);
    useScreenTitles(isTodayDate ? 'Today' : format(date, 'eeee'), format(date, 'PPP'), componentId);

    const range = useMemo(
        () => (isTodayDate ? { start: startOfDay(date) } : { start: startOfDay(date), end: endOfDay(date) }),
        [isTodayDate, date],
    );

    const handleDateChange = useCallback((newDate: Date) => {
        setDate(newDate);
    }, []);

    return (
        <Container>
            <CalendarList onChangeDate={handleDateChange} />
            <BubblesContainer>
                {!range.end ? <Today componentId={componentId} /> : <History range={range} key={date.toString()} />}
            </BubblesContainer>
        </Container>
    );
};

Dashboard.options = {
    topBar: {
        title: {
            fontSize: 17,
            fontWeight: 'semibold',
        },
        largeTitle: {
            visible: false,
        },
    },
};

export default Dashboard;
