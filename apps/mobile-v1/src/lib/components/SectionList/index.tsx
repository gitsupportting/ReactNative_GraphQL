import { SectionListData as OriginalSectionListData, SectionListProps as OriginalSectionListProps } from 'react-native';

export { SectionList as default } from 'react-native';

export type SectionListData<T> = OriginalSectionListData<T>;
export type SectionListProps<T> = OriginalSectionListProps<T>;
