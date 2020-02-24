import { textLight } from 'app/theme/colors';
import spacing from 'app/theme/spacing';
import SectionList, { SectionListData as OriginalSectionListData, SectionListProps } from 'lib/components/SectionList';
import Text from 'lib/components/Text';
import { AccordionContext } from 'lib/hooks/useAccordionContext';
import { Mode, styled, useDarkModeContext } from 'lib/stylesheet';
import React from 'react';

export type SectionListData<T> = OriginalSectionListData<T>;

const HeaderText = styled(Text)`
    color: ${({ mode }: { mode: Mode }) => textLight[mode]};
    font-size: 13px;
    padding: ${spacing(1)}px;
    align-content: center;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const DashboardSectionList = <T extends any>(props: SectionListProps<T>) => {
    const mode = useDarkModeContext();

    return (
        <AccordionContext>
            <SectionList
                {...props}
                renderSectionHeader={info =>
                    info.section.title && info.section.data.length ? (
                        <HeaderText mode={mode}>{info.section.title}</HeaderText>
                    ) : null
                }
            />
        </AccordionContext>
    );
};

export default DashboardSectionList;
