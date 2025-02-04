import { Component } from '../../Framework';
import { Modal } from '../Modal';
import styles from './index.module.less';

interface BaseConfirmProps {
    title: string;
    content: string;
    onClick?: () => void;
    show?: boolean;
}

interface IState {
    show: boolean;
}

export class Prompt extends Component<BaseConfirmProps, IState> {
    constructor(props: BaseConfirmProps) {
        super();
        this.state = {
            show: props.show ?? false,
        };
    }

    showModal(show: boolean) {
        this.setState({
            show,
        });
    }

    handleClick() {
        const { onClick } = this.props;
        onClick?.();
        this.showModal(false);
    }

    getGroup() {
        const group = [
            {
                label: this.getLocale('button.confirm'),
                type: 'primary',
                onClick: () => this.handleClick(),
            },
            {
                label: this.getLocale('button.cancel'),
                onClick: () => this.showModal(false),
            },
        ];
        return group;
    }

    componentWillReceiveProps(props: BaseConfirmProps): void {
        if (props.show !== this.props.show) {
            this.setState({
                show: props.show,
            });
        }
    }

    render() {
        const { title, content } = this.props;
        const { show } = this.state;
        return (
            <div className={styles.confirmModal}>
                <Modal visible={show} isDrag={true} title={this.getLocale(title)} group={this.getGroup()}>
                    {this.getLocale(content)}
                </Modal>
            </div>
        );
    }
}
