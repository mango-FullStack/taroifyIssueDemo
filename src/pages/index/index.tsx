import { Component } from "react";
import { View } from '@tarojs/components';
import { ActionSheet, Button } from '@taroify/core';
import List from "../../component/list";
import resmock from './assets/mock';

import "./index.scss";

type PageStateProps = {
    counter: {
        num: number;
    };
};

type PageOwnProps = {};

type IProps = PageStateProps & PageOwnProps;

interface Index {
    props: IProps;
}

class Index extends Component {
    state = {
        query: {},
        visible: false,
    }

    componentWillUnmount() {}

    componentDidShow() {}

    componentDidHide() {}

    onAction = ({ name }) => {
        this.setState({ query: { name } })
    }

    onLoading = async (previous: any[], _query) => {
        const { length: offset } = previous;
        const res = await resmock({}, { limit: 10, offset }) as any;
        const data = [ ...previous, ...res.data.list ];
        const done = data.length >= 30;
        return { data, done };
    };

    renderItem = (item) => {
        return (
            <View key={item.id}>
                {item.name}
            </View>
        );
    }

    render() {
        const { query, visible } = this.state;
        const { renderItem, onLoading, onAction } = this;
        return (
            <View>
                <Button onClick={() => this.setState({ visible: true })} >切换筛选项</Button>
                <List query={query} onLoading={onLoading} renderItem={renderItem}></List>
                <ActionSheet open={visible} onSelect={onAction} onCancel={() => this.setState({ visible: false })} >
                <ActionSheet.Header>这是一段描述信息</ActionSheet.Header>
                <ActionSheet.Action name='选项一' />
                <ActionSheet.Action name='选项二' />
                <ActionSheet.Action name='选项三' />
                <ActionSheet.Button type='cancel'>取消</ActionSheet.Button>
                </ActionSheet>
            </View>
        );
    }
}

export default Index;
