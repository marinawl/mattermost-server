// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useRef} from 'react';
import {useIntl} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

import IconButton from '@mattermost/compass-components/components/icon-button'; // eslint-disable-line no-restricted-imports

import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {getInt} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {setProductMenuSwitcherOpen} from 'actions/views/product_menu';
import {isSwitcherOpen} from 'selectors/views/product_menu';

import {
    GenericTaskSteps,
    OnboardingTaskCategory,
    OnboardingTasksName,
    TaskNameMapToSteps,
    useHandleOnBoardingTaskData, VisitSystemConsoleTour,
} from 'components/onboarding_tasks';
import {FINISHED, TutorialTourName} from 'components/tours';
import {PlaybooksTourTip} from 'components/tours/onboarding_explore_tools_tour';
import Menu from 'components/widgets/menu/menu';
import MenuWrapper from 'components/widgets/menu/menu_wrapper';

import {useGetPluginsActivationState} from 'plugins/useGetPluginsActivationState';
import {ExploreOtherToolsTourSteps, suitePluginIds} from 'utils/constants';
import {useCurrentProductId, useProducts, isChannels} from 'utils/products';

import type {GlobalState} from 'types/store';

import ProductBranding from './product_branding';
import ProductMenuItem from './product_menu_item';
import ProductMenuList from './product_menu_list';
import {Permissions} from 'mattermost-redux/constants';
import {ApplicationCogIcon} from '@mattermost/compass-icons/components';
import SystemPermissionGate from '../../../permissions_gates/system_permission_gate';
import {getIsMobileView} from '../../../../selectors/views/browser';
import {Props} from "./product_menu_list/product_menu_list";
import {Link} from "react-router-dom";

import {useClickOutsideRef} from '../../hooks';

export const ProductMenuContainer = styled.nav`
    display: flex;
    align-items: center;
    cursor: pointer;

    > * + * {
        margin-left: 12px;
    }
`;

export const ProductMenuButton = styled(IconButton).attrs(() => ({
    id: 'product_switch_menu',
    icon: 'products',
    size: 'sm',

    // we currently need this, since not passing a onClick handler is disabling the IconButton
    // this is a known issue and is being tracked by UI platform team
    // TODO@UI: remove the onClick, when it is not a mandatory prop anymore
    onClick: () => {},
    inverted: true,
    compact: true,
}))`
    > i::before {
        font-size: 20px;
        letter-spacing: 20px;
    }
`;

const ProductMenu = (): JSX.Element => {
    const {formatMessage} = useIntl();
    const products = useProducts();
    const dispatch = useDispatch();
    const switcherOpen = useSelector(isSwitcherOpen);
    const menuRef = useRef<HTMLDivElement>(null);
    const currentProductID = useCurrentProductId();

    const enableTutorial = useSelector(getConfig).EnableTutorial === 'true';
    const currentUserId = useSelector(getCurrentUserId);
    const tutorialStep = useSelector((state: GlobalState) => getInt(state, TutorialTourName.EXPLORE_OTHER_TOOLS, currentUserId, 0));
    const triggerStep = useSelector((state: GlobalState) => getInt(state, OnboardingTaskCategory, OnboardingTasksName.EXPLORE_OTHER_TOOLS, FINISHED));
    const exploreToolsTourTriggered = triggerStep === GenericTaskSteps.STARTED;

    const {playbooksPlugin} = useGetPluginsActivationState();

    const showPlaybooksTour = enableTutorial && tutorialStep === ExploreOtherToolsTourSteps.PLAYBOOKS_TOUR && exploreToolsTourTriggered && playbooksPlugin;

    const handleClick = () => dispatch(setProductMenuSwitcherOpen(!switcherOpen));

    const handleOnBoardingTaskData = useHandleOnBoardingTaskData();

    const visitSystemConsoleTaskName = OnboardingTasksName.VISIT_SYSTEM_CONSOLE;
    const handleVisitConsoleClick = () => {
        const steps = TaskNameMapToSteps[visitSystemConsoleTaskName];
        handleOnBoardingTaskData(visitSystemConsoleTaskName, steps.FINISHED, true, 'finish');
        localStorage.setItem(OnboardingTaskCategory, 'true');
    };

    useClickOutsideRef(menuRef, () => {
        if (exploreToolsTourTriggered || !switcherOpen) {
            return;
        }
        dispatch(setProductMenuSwitcherOpen(false));
    });

    const productItems = products?.map((product) => {
        let tourTip;

        // playbooks
        if (product.pluginId === suitePluginIds.playbooks && showPlaybooksTour) {
            tourTip = (<PlaybooksTourTip singleTip={true}/>);
        }

        return (
            <ProductMenuItem
                key={product.id}
                destination={product.switcherLinkURL}
                icon={product.switcherIcon}
                text={product.switcherText}
                active={product.id === currentProductID}
                onClick={handleClick}
                tourTip={tourTip}
                id={`product-menu-item-${product.pluginId || product.id}`}
            />
        );
    });

    return (
        <div ref={menuRef}>
            <MenuWrapper
                open={switcherOpen}
            >
                <ProductMenuContainer onClick={handleClick}>
                    {/*
                        최상단 메뉴버튼을 관리자만 볼 수 있게 변경 ( 관리자 도구, 플러그인, 정보 등등 )
                        메뉴버튼 상단에 SystemPermissionGate 태그 추가
                    */}
                    <SystemPermissionGate permissions={Permissions.SYSCONSOLE_READ_PERMISSIONS}>
                        <ProductMenuButton
                            active={switcherOpen}
                            aria-expanded={switcherOpen}
                            aria-label={formatMessage({id: 'global_header.productSwitchMenu', defaultMessage: 'Product switch menu'})}
                            aria-controls='product-switcher-menu'
                        />
                    </SystemPermissionGate>

                    {/*
                        상단 채널 로고 숨김처리
                    */}
                    {/*<ProductBranding/>*/}
                </ProductMenuContainer>
                <Menu
                    listId={'product-switcher-menu-dropdown'}
                    className={'product-switcher-menu'}
                    id={'product-switcher-menu'}
                    ariaLabel={'switcherOpen'}
                >

                    {/*
                        상단 메뉴 클릭시 나오는 Boards, Channels 탭 숨김처리
                    */}
                    {/*<ProductMenuItem
                        destination={'/'}
                        icon={'product-channels'}
                        text={'Channels'}
                        active={isChannels(currentProductID)}
                        onClick={handleClick}
                    />
                    {productItems}*/}
                    <ProductMenuList
                        isMessaging={isChannels(currentProductID)}
                        onClick={handleClick}
                        handleVisitConsoleClick={handleVisitConsoleClick}
                    />
                </Menu>
            </MenuWrapper>
        </div>
    );
};

export default ProductMenu;
