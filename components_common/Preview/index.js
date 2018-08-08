import React, { Component } from 'react';
import style from './index.css';
import { Modal } from 'antd';
import Slider from 'react-slick';

/**
 * this is the component that pictures can display popup after clicked.
 * author:yangmengqing, lvyao
 * @param {array} dataSource - a array of image urls to show
 * @param {object} settings - a object sets use slider[https://react-slick.neostack.com/docs/api]
 * @access public
 * @extends {Component}
 *
 */

/**
 *
 * @param {object} props - props
 * @returns {*} nodeobject
 * @constructor
 */
const SampleNextArrow = props => {
    const { className, styles, onClick } = props;
    return (
        <button
            className={`slick-arrow ${style.nextArrow}`}
            style={{ ...styles, display: 'block' }}
            onClick={onClick}
        >
            <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-icon_PreviewRight" />
            </svg>
        </button>
    );
};

/**
 *
 * @param {object} props - props
 * @returns {*} nodeobject
 * @constructor
 */
const SamplePrevArrow = props => {
    const { className, styles, onClick } = props;
    console.log(className);
    return (
        <button
            className={`slick-arrow ${style.previewArrow}`}
            style={{ ...styles, display: 'block' }}
            onClick={onClick}
        >
            <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-icon_PreviewLeft" />
            </svg>
        </button>
    );
};

class Preview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    /**
     * show modal
     *
     * @protected
     */
    showModal = () => {
        this.setState({
            visible: true
        });
    };

    /**
     * hide modal
     *
     * @protected
     */
    hideModal = () => {
        this.setState({
            visible: false
        });
    };

    render() {
        const bodyStyle = {
            padding: 0,
            overflow: 'hidden'
        };

        const settings = {
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            ...this.props.settings
        };

        return (
            <div>
                <div
                    onClick={this.showModal}
                    className={`${style.previewClick} ${this.props.className ||
                        ''}`}
                    style={this.props.style}
                >
                    {this.props.children}
                </div>
                <Modal
                    className={style.preview}
                    visible={this.state.visible}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    maskClosable={true}
                    footer={null}
                    width={'100%'}
                    style={{ height: '100%' }}
                    bodyStyle={bodyStyle}
                    wrapClassName="vertical-center-modal"
                >
                    <Slider
                        ref={slider => (this.slider = slider)}
                        {...settings}
                    >
                        {this.props.dataSource.map((item, index) => {
                            return (
                                <div key={index} className={style.imgDiv}>
                                    <img src={item} />
                                </div>
                            );
                        })}
                    </Slider>
                </Modal>
            </div>
        );
    }
}

export default Preview;
