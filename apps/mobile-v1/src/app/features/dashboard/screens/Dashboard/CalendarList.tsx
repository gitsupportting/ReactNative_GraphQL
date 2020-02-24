import { appBackground, elevatedBackground, menuTextActive } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import { isFuture, subDays } from 'date-fns';
import SectionList from 'lib/components/SectionList';
import Text from 'lib/components/Text';
import View from 'lib/components/View';
import { Mode, styled, useDarkModeContext } from 'lib/stylesheet';
import { FC } from 'lib/utils/component';
import { format } from 'lib/utils/date';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, TouchableHighlight } from 'react-native';

const circleSize = 40;
const marginSize = 0.5;
const margin = 2 * (spacing(marginSize) as number);
const pageNumberSize = circleSize + margin;
const sectionHeaderWidth = pageNumberSize;

interface CircleProps {
    current: boolean;
    mode: Mode;
}

const oppositeMode = (mode: Mode) => (mode === 'light' ? 'dark' : 'light');

const circleColor = ({ current, mode }: CircleProps, color: 'background' | 'text') =>
    color === 'background'
        ? current
            ? menuTextActive[mode]
            : mode === 'light'
            ? menuTextActive[oppositeMode(mode)]
            : elevatedBackground.dark
        : current
        ? menuTextActive[oppositeMode(mode)]
        : menuTextActive[mode];

const Circle = styled(View)`
    height: ${circleSize}px;
    aspect-ratio: 1;
    background: ${(props: CircleProps) => circleColor(props, 'background')};
    border-radius: 1000px;
    align-items: center;
    justify-content: center;
    margin: ${spacing(0, marginSize)};
`;

const CircleText = styled(Text)`
    color: ${(props: CircleProps) => circleColor(props, 'text')};
    font-size: 18px;
`;

const ListHeaderContainer = styled(View)`
    margin-right: -${sectionHeaderWidth}px;
    margin-top: -10px;
    background: ${({ mode }: { mode: Mode }) => appBackground[mode]};
`;
const ListHeaderComponent = styled(Text)`
    color: ${(props: CircleProps) => circleColor(props, 'text')};
    width: ${sectionHeaderWidth}px;
    text-align: center;
    text-decoration-line: underline;
`;

const DatesContainer: new <T>() => SectionList<T> = styled(SectionList)`
    padding-vertical: 10px;
    flex-shrink: 1;
    flex-grow: 0;
    margin-bottom: ${spacing(1)}px;
` as any;

const keyExtractor = (date: Date) => `${date.valueOf()}`;

interface Props {
    onChangeDate?: (date: Date) => void;
}

const CalendarList: FC<Props> = ({ onChangeDate }) => {
    const mode = useDarkModeContext();

    const dates = useMemo(() => [...Array(40)].map((_, index) => subDays(new Date(), index)).reverse(), []);
    const [date, setDate] = useState(dates[dates.length - 1]);
    const { width } = Dimensions.get('window');
    const { inset, snapInterval } = useMemo(
        () => ({ inset: Math.floor(width / 2 - pageNumberSize / 2), snapInterval: pageNumberSize }),
        [width],
    );

    useEffect(() => {
        if (onChangeDate) {
            onChangeDate(date);
        }
    }, [onChangeDate, date]);

    const handleScrollEnd = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const page = Math.round(
                (event.nativeEvent.contentInset.left + event.nativeEvent.contentOffset.x) / pageNumberSize,
            );
            setDate(dates[page]);
        },
        [dates],
    );

    const sections = useMemo(
        () =>
            Object.values(
                dates.reduce((current, next) => {
                    const month = next.getFullYear() + '/' + format(next, 'LLL');
                    if (!current[month]) {
                        current[month] = [];
                    }

                    current[month].push(next);

                    return current;
                }, {} as { [key: string]: Date[] }),
            ).map(sectionData => ({ data: sectionData, title: format(sectionData[0], 'LLL') })),
        [dates],
    );

    const scrollRef = useRef<SectionList<Date>>(null);
    const selectDate = useCallback(
        (newDate: Date) => {
            setDate(newDate);
            if (scrollRef.current) {
                const sectionIndex = sections.findIndex(section => section.data.includes(newDate));
                const itemIndex = sections[sectionIndex].data.indexOf(newDate) + 1;
                scrollRef.current.scrollToLocation({
                    sectionIndex,
                    itemIndex,
                    animated: true,
                    // This is somewhat magic but we're offsetting view if the number is below
                    viewOffset: !sectionIndex && itemIndex < 4 ? pageNumberSize * (4.5 - itemIndex) : 0,
                    viewPosition: 0.5,
                });
            }
        },
        [sections],
    );

    const getRealIndex = useMemo(() => {
        const entries: Record<string, number> = {};
        let currentIndex = 0;
        let currentRealIndex = 0;
        sections.forEach(section => {
            // Header
            entries[currentIndex] = currentRealIndex;
            currentIndex++;
            // Items
            section.data.forEach(_ => {
                entries[currentIndex] = currentRealIndex;
                currentIndex++;
                currentRealIndex++;
            });
            // Footer
            entries[currentIndex] = currentRealIndex;
            currentIndex++;
        });

        return (index: number) => {
            return entries[index] || 0;
        };
    }, [sections]);

    const renderItem = useCallback(
        ({ item }: { item: Date }) =>
            isFuture(item) ? (
                <Circle key={item.toString()} current={item === date} mode={mode}>
                    <CircleText current={item === date} mode={mode}>
                        {format(item, 'dd')}
                    </CircleText>
                </Circle>
            ) : (
                <TouchableHighlight onPress={() => selectDate(item)} underlayColor="transparent">
                    <Circle key={item.toString()} current={item === date} mode={mode}>
                        <CircleText current={item === date} mode={mode}>
                            {format(item, 'dd')}
                        </CircleText>
                    </Circle>
                </TouchableHighlight>
            ),
        [date, mode, selectDate],
    );
    const renderSectionHeader = useCallback(
        ({ section: { title } }) => (
            <ListHeaderContainer mode={mode}>
                <ListHeaderComponent mode={mode} current={false}>
                    {title}
                </ListHeaderComponent>
            </ListHeaderContainer>
        ),
        [mode],
    );

    return (
        <DatesContainer<Date>
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            decelerationRate="fast"
            snapToAlignment="center"
            snapToInterval={snapInterval}
            contentInset={{ left: inset, right: inset, top: 0, bottom: 0 }}
            getItemLayout={(data, index) => ({
                length: pageNumberSize,
                offset: pageNumberSize * getRealIndex(index),
                index,
            })}
            onMomentumScrollEnd={handleScrollEnd}
            sections={sections}
            extraData={date}
            initialScrollIndex={dates.indexOf(date)}
            centerContent
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
        />
    );
};

export default CalendarList;
