declare module 'react-native-navigation-hooks' {
    import {
        BottomTabSelectedEvent,
        CommandCompletedEvent,
        ComponentDidAppearEvent,
        ComponentDidDisappearEvent,
        ModalDismissedEvent,
        NavigationButtonPressedEvent,
        PreviewCompletedEvent,
        SearchBarCancelPressedEvent,
        SearchBarUpdatedEvent,
    } from 'react-native-navigation';

    type Handler<T> = (event: T) => void;

    export function useNavigationComponentDidAppear(
        handler: Handler<ComponentDidAppearEvent>,
        componentId?: string,
    ): void;

    export function useNavigationComponentDidDisappear(
        handler: Handler<ComponentDidDisappearEvent>,
        componentId?: string,
    ): void;

    export function useNavigationCommand(handler: (name: string, params: unknown) => void, componentId?: string): void;

    export function useNavigationCommandComplete(handler: Handler<CommandCompletedEvent>, componentId?: string): void;

    export function useNavigationModalDismiss(handler: Handler<ModalDismissedEvent>, componentId?: string): void;

    export function useNavigationBottomTabSelect(handler: Handler<BottomTabSelectedEvent>): void;

    export function useNavigationButtonPress(
        handler: Handler<NavigationButtonPressedEvent>,
        componentId?: string,
        buttonId?: string,
    ): void;

    export function useNavigationSearchBarUpdate(handler: Handler<SearchBarUpdatedEvent>, componentId?: string): void;

    export function useNavigationSearchBarCancelPress(
        handler: Handler<SearchBarCancelPressedEvent>,
        componentId?: string,
    ): void;

    export function useNavigationPreviewComplete(handler: Handler<PreviewCompletedEvent>, componentId?: string): void;
}
