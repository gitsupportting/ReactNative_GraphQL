import { DeepPartial } from 'app-utils';
import { commsHomeScreen } from 'app/features/communication';
import { dashboardScreen } from 'app/features/dashboard';
import { marketplaceScreen } from 'app/features/marketplace';
import { profileScreen } from 'app/features/user';
import { walletScreen } from 'app/features/wallet';
import iconAwareness from 'app/resources/Icon/Awareness/Outline/24px.png';
import iconAwarenessActive from 'app/resources/Icon/Awareness/Solid/24px.png';
import iconDashboard from 'app/resources/Icon/Home/Outline/24px.png';
import iconDashboardActive from 'app/resources/Icon/Home/Solid/24px.png';
import iconMarketplace from 'app/resources/Icon/Marketplace/Outline/24px.png';
import iconMarketplaceActive from 'app/resources/Icon/Marketplace/Solid/24px.png';
import iconProfile from 'app/resources/Icon/Profile/Outline/24px.png';
import iconProfileActive from 'app/resources/Icon/Profile/Solid/24px.png';
import iconWallet from 'app/resources/Icon/Wallet/Outline/24px.png';
import iconWalletActive from 'app/resources/Icon/Wallet/Solid/24px.png';
import {
    appBackground,
    menuSecondaryTextActive,
    menuTextActive,
    menuTextInactive,
    tabBarBackground,
} from 'app/theme/colors';
import { initialMode, Mode, subscribeToThemeChange } from 'lib/stylesheet';
import { Navigation, Options, register } from 'lib/utils/navigation';
import Root from './Root';

const icons = {
    marketplace: {
        inactive: iconMarketplace,
        selected: iconMarketplaceActive,
    },
    wallet: {
        inactive: iconWallet,
        selected: iconWalletActive,
    },
    dashboard: {
        inactive: iconDashboard,
        selected: iconDashboardActive,
    },
    awareness: {
        inactive: iconAwareness,
        selected: iconAwarenessActive,
    },
    profile: {
        inactive: iconProfile,
        selected: iconProfileActive,
    },
};

const getSettings = (mode: Mode): DeepPartial<Options> => ({
    statusBar: {
        style: mode,
        visible: true,
    },
    topBar: {
        noBorder: true,
        drawBehind: true,
        title: {
            color: menuTextActive[mode],
        },
        subtitle: {
            color: menuSecondaryTextActive[mode],
            fontFamily: 'System',
            fontSize: 13,
            fontWeight: 'regular',
        },
        background: {
            color: appBackground[mode],
            translucent: true,
        },
        largeTitle: {
            visible: true,
            color: menuTextActive[mode],
        },
    },
    bottomTab: {
        iconColor: menuTextInactive[mode],
        textColor: menuTextInactive[mode],
        selectedIconColor: menuTextActive[mode],
        selectedTextColor: menuTextActive[mode],
    },
    bottomTabs: {
        drawBehind: true,
        translucent: true,
        backgroundColor: tabBarBackground[mode],
    },
    layout: {
        backgroundColor: appBackground[mode],
        componentBackgroundColor: appBackground[mode],
    },
});

export const rootScreen = register('Root', Root);

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setDefaultOptions(getSettings(initialMode) as any);

    let currentComponentId: string;
    Navigation.events().registerComponentDidAppearListener(event => {
        currentComponentId = event.componentId;
    });

    subscribeToThemeChange(newMode => {
        const newSettings = getSettings(newMode) as any;
        Navigation.setDefaultOptions(newSettings);
        if (!currentComponentId) {
            return;
        }
        Navigation.mergeOptions(currentComponentId, newSettings);
    });
});

export const appRoot = async () =>
    Navigation.setRoot({
        root: {
            bottomTabs: {
                options: {
                    bottomTabs: {
                        currentTabIndex: 2,
                    },
                },
                children: [
                    {
                        stack: {
                            children: [
                                {
                                    component: {
                                        name: `${marketplaceScreen}`,
                                    },
                                },
                            ],
                            options: {
                                bottomTab: {
                                    text: 'Marketplace',
                                    icon: icons.marketplace.inactive,
                                    selectedIcon: icons.marketplace.selected,
                                },
                            },
                        },
                    },
                    {
                        stack: {
                            children: [{ component: { name: `${walletScreen}` } }],
                            options: {
                                bottomTab: {
                                    text: 'Wallet',
                                    icon: icons.wallet.inactive,
                                    selectedIcon: icons.wallet.selected,
                                },
                                topBar: {
                                    largeTitle: {
                                        visible: true,
                                        fontSize: 17,
                                        fontWeight: 'regular',
                                    },
                                },
                            },
                        },
                    },
                    {
                        stack: {
                            children: [{ component: { name: `${dashboardScreen}` } }],
                            options: {
                                bottomTab: {
                                    text: 'Dashboard',
                                    icon: icons.dashboard.inactive,
                                    selectedIcon: icons.dashboard.selected,
                                },
                            },
                        },
                    },
                    {
                        stack: {
                            children: [{ component: { name: `${commsHomeScreen}` } }],
                            options: {
                                bottomTab: {
                                    text: 'Awareness',
                                    icon: icons.awareness.inactive,
                                    selectedIcon: icons.awareness.selected,
                                },
                            },
                        },
                    },
                    {
                        stack: {
                            children: [{ component: { name: `${profileScreen}` } }],
                            options: {
                                bottomTab: {
                                    text: 'Profile',
                                    icon: icons.profile.inactive,
                                    selectedIcon: icons.profile.selected,
                                },
                            },
                        },
                    },
                ],
            },
        },
    });
