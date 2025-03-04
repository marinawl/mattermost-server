// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import type {ComponentProps} from 'react';
import {Link} from 'react-router-dom';

import * as GlobalActions from 'actions/global_actions';

import OverlayTrigger from 'components/overlay_trigger';
import Timestamp, {RelativeRanges} from 'components/timestamp';
import Tooltip from 'components/tooltip';

import {Locations} from 'utils/constants';
import {isMobile} from 'utils/user_agent';
import moment from "moment-timezone";

const POST_TOOLTIP_RANGES = [
    RelativeRanges.TODAY_TITLE_CASE,
    RelativeRanges.YESTERDAY_TITLE_CASE,
];

type Props = {

    /*
     * If true, time will be rendered as a permalink to the post
     */
    isPermalink: boolean;

    /*
     * The time to display
     */
    eventTime: number;

    isMobileView: boolean;
    location: string;

    /*
     * The post id of posting being rendered
     */
    postId: string;
    teamUrl: string;
    timestampProps?: ComponentProps<typeof Timestamp>;

    // ils - 댓글 시간표현을 위해 추가
    isConsecutivePost: boolean;
}

export default class PostTime extends React.PureComponent<Props> {
    static defaultProps: Partial<Props> = {
        eventTime: 0,
        location: Locations.CENTER,
    };

    handleClick = () => {
        if (this.props.isMobileView) {
            GlobalActions.emitCloseRightHandSide();
        }
    };

    render() {
        const {
            eventTime,
            isPermalink,
            location,
            postId,
            teamUrl,
            timestampProps = {},
            isConsecutivePost,
        } = this.props;

        /* 메시지 전송시간 포멧 변경 */
        /*const postTime = (
            <Timestamp
                value={eventTime}
                className='post__time'
                useDate={false}
                {...timestampProps}
            />
        );*/

        const time = moment(eventTime).format(isConsecutivePost ? 'a h:mm' : 'MM월 DD일 (dd) a h:mm');

        // ils - 툴팁 시간 표현을 위해 생성
        const tooltipTime = moment(eventTime).format('YYYY. MM. DD (dd) a h:mm:ss');

        const postTime = (
            <time style={{fontSize: '0.9em', opacity: 0.6}}>{time}</time>
        );

        const content = isMobile() || !isPermalink ? (
            <div
                role='presentation'
                className='post__permalink post_permalink_mobile_view'
            >
                {postTime}
            </div>
        ) : (
            <Link
                id={`${location}_time_${postId}`}
                to={`${teamUrl}/pl/${postId}`}
                className='post__permalink'
                onClick={this.handleClick}
                aria-labelledby={eventTime.toString()}
            >
                {postTime}
            </Link>
        );

        return (
            <OverlayTrigger
                delayShow={500}
                placement='top'
                overlay={
                    <Tooltip
                        id={eventTime.toString()}
                        className='hidden-xs'
                    >
                        {tooltipTime}
                        {/*<Timestamp
                            value={eventTime}
                            ranges={POST_TOOLTIP_RANGES}
                            useSemanticOutput={false}
                        />*/}
                    </Tooltip>
                }
            >
                {content}
            </OverlayTrigger>
        );
    }
}
