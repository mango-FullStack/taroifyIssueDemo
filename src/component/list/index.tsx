import React from 'react';
import Taro from '@tarojs/taro';
import { Loading, List as TaroifyList, Divider } from '@taroify/core';
import { isEqual } from 'lodash';

import "@taroify/core/index.scss"

interface ListProps {
    query: any;
    onLoading: any;
    renderItem: React.FC<any>;
}

interface ListState {
    loading: boolean;
    hasMore: boolean;
    source: any[];
}

export default class List extends React.PureComponent<Partial<ListProps>, ListState> {
    constructor (props) {
        super(props);
        const onHideEventId = this.$instance?.router?.onHide;
        const onShowEventId = this.$instance?.router?.onShow;
        onShowEventId && Taro.eventCenter.on(onShowEventId, () => this.onComponentShow());
        onHideEventId && Taro.eventCenter.on(onHideEventId, () => this.onComponentHide());
    }

    state: ListState = {
        loading: false,
        hasMore: true,
        source: [],
    }

    componentDidUpdate (props) {
        const { query } = this.props;
        if (!isEqual(props.query, query)) this.reset();
    }

    componentWillUnmount () {
        if (this.debounce) clearTimeout(this.debounce);
    }

    $instance = Taro.getCurrentInstance();

    visible: boolean = false;
 
    debounce: NodeJS.Timeout;

    onComponentShow () {
        this.visible = true;
    }

    onComponentHide () {
        this.visible = false;
        if (this.debounce) clearTimeout(this.debounce);
    }

    asyncState = (state: Partial<ListState>) => {
        return new Promise((result) => {
            this.setState(state as ListState, () => {
                result(state);
            });
        });
    }

    reset = async () => {
        this.setState({ source: [], hasMore: true });
    }

    refresh = async () => {
        const { query } = this.props;
        const { source: preview } = this.state;
        const res = await this.props.onLoading?.(preview, query);
        const { data: source = [], done } = res ?? {}; 
        await this.asyncState({ source });

        Taro.nextTick(() => { this.setState({ hasMore: !done, source, loading: false }); });
    }

    onLoad = async () => {
        if (!this.visible) return;
        this.setState({ loading: true });
        if (this.debounce) clearTimeout(this.debounce);
        this.debounce = setTimeout(() => this.refresh(), 600);
    }

    render () {
        const { onLoad } = this;
        const { renderItem } = this.props;
        const { loading, hasMore, source } = this.state;
        return (
            <TaroifyList {...{ loading, hasMore, onLoad }}>
                {renderItem && source.map(renderItem)}
                <TaroifyList.Placeholder>
                    {loading && <Loading>加载中...</Loading>}
                    {(!loading && hasMore === false) && <Divider>已经到底啦</Divider>}
                </TaroifyList.Placeholder>
            </TaroifyList>
        );
    }
}
