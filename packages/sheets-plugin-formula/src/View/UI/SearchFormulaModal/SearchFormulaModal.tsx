import { BaseComponentProps, Component, Modal } from '@univerjs/base-ui';
import { SearchFormulaModalData } from '../../../Basics/Interfaces/IFormula';

interface IProps extends BaseComponentProps {}

interface IState {
    modalData: SearchFormulaModalData[];
}

export class SearchFormulaModal extends Component<IProps, IState> {
    override initialize() {
        this.state = {
            modalData: [],
        };
    }

    override componentDidMount() {
        this.props.getComponent?.(this);
    }

    setModal(modalData: SearchFormulaModalData[]) {
        const componentManager = this.context.componentManager;

        modalData.forEach((item) => {
            const Label = componentManager?.get(item.children.name!);
            if (Label) {
                const props = item.children.props ?? {};
                item.modal = <Label {...props} />;
            }
        });

        this.setState({
            modalData,
        });
    }

    render() {
        const { modalData } = this.state;
        // Set Provider for entire Container
        return (
            <>
                {modalData.map((item) => {
                    if (!item.show) return;
                    return (
                        <Modal isDrag={true} mask={item.mask} title={item.label?.funParams.n} visible={item.show} group={item.group} onCancel={item.onCancel}>
                            {item.modal}
                        </Modal>
                    );
                })}
            </>
        );
    }
}
