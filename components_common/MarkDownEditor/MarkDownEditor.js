import React, { Component } from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import Dropzone from 'react-dropzone';
import style from './MarkDownEditor.css';
import { Row, Col, Card, message } from 'antd';
import MDEditor from './MDEditor';
import { hostNameBackEnd } from '../../config/app';

/**
 * @desc this is a editor supports markdown and drop image to upload
 * auth: lvyao
 */
class MarkDownEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            files: [],
            editor: {},
            dropzoneActive: false,
            pasteModal: false,
            uploadUrl: this.props.uploadUrl ? this.props.uploadUrl : ''
        };
        this.onDrop = this.onDrop.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onCursor = this.onCursor.bind(this);
    }

    /**
     * @param {object} editor - drop files to upload.
     * @param {string} data - drop files to upload.
     * @param {string} value - drop files to upload.
     */
    onChange = (editor, data, value) => {
        this.props.onChange(value);
        this.setState({
            value
        });
    };

    onDragEnter() {
        this.setState({
            dropzoneActive: true
        });
    }

    onDragLeave() {
        this.setState({
            dropzoneActive: false
        });
    }

    /**
     * drop file to upload
     * @param {files} files - drop files to upload.
     */
    onDrop(files) {
        const { editor, uploadUrl } = this.state;
        Object.getPrototypeOf(this)
            .constructor.uploadFiles(files, uploadUrl)
            .then(convert => {
                editor.replaceSelection(convert);
                this.setState({
                    files,
                    dropzoneActive: false
                });
            });
    }

    /**
     * Cursor edit
     * @param {object} editor - Cursor.
     */
    onCursor = editor => {
        if (editor.getDoc().somethingSelected()) {
            this.setState({
                selectActive: true,
                editor: editor.getDoc()
            });
        } else {
            this.setState({
                selectActive: false
            });
        }
    };

    /**
     * change to drag statue
     * @param {object} editor - Cursor.
     */
    cmDragEnter = editor => {
        this.setState({
            dropzoneActive: true,
            editor: editor.getDoc()
        });
    };

    /**
     * markdow image format to html and replace the 'enter' key to html
     * @param {string} content - edit markdown content.
     * @returns {string} content
     */
    markdownToHtmlImg = content => {
        let replaceParama =
            '<div class="divImg"><img src="$2" alt="$1"></div></div><div align="center"><a href="$2" target="_blank">查看原图</a></div>';

        return content.replace(/!\[([\s\S]*?)\]\(([\s\S]*?)\)/g, replaceParama);
    };

    static async uploadFiles(files, uploadUrl) {
        if (uploadUrl) {
            var formData = new FormData();
            formData.append('file', files[0]);
            const res = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    Token: `Bearer ${localStorage.token}`,
                    enctype: 'multipart/form-data'
                },
                body: formData
            }).then(response => {
                return response.json();
            });
            if (res.success) {
                let imgUrl = `${hostNameBackEnd}/art-outsource/demand/images/${
                    res.data.id
                }`;
                return `![${res.data.name}](${imgUrl})\n\n`;
            } else {
                message.error('上传失败');
                return '';
            }
        } else {
            message.error('未设定上传URL');
            return '';
        }
    }

    /**
     * markdow image format to html and replace the 'enter' key to html
     * @param {object} editor - edit markdown content.
     * @param {event} e - paste event.
     */
    OnPaste = (editor, e) => {
        var data = e.clipboardData;
        var pushFiles = [];
        if (data.files.length > 0) {
            let file = data.files[0];
            if (file.type.indexOf('image') !== -1) {
                e.preventDefault();
            }
            pushFiles.push(file);
            this.setState({
                editor: editor.getDoc()
            });
            this.onDrop(pushFiles);
        }
    };

    render() {
        const { dropzoneActive } = this.state;
        const overlayStyle = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            padding: '2.5em 0',
            background: 'rgba(0,0,0,0.5)',
            textAlign: 'center',
            color: '#fff',
            zIndex: 999999
        };

        return (
            <div key="main" className={style.markdownEditor} id="test">
                <Row>
                    <Col span={6} className={style.left}>
                        <Card
                            bordered={true}
                            style={
                                this.props.showEditorError
                                    ? {
                                        borderLeft: ' 1px solid red',
                                        borderTop: ' 1px solid red',
                                        borderBottom: ' 1px solid red'
                                    }
                                    : { borderRadius: '4px 0 0 4px' }
                            }
                            bodyStyle={{ padding: 0 }}
                        >
                            <Dropzone
                                accept="image/jpeg, image/png"
                                disableClick
                                style={{ position: 'relative' }}
                                onDrop={this.onDrop}
                                onDragEnter={this.onDragEnter}
                                onDragLeave={this.onDragLeave}
                            >
                                {dropzoneActive && (
                                    <div style={overlayStyle}>
                                        Drop files...
                                    </div>
                                )}
                                <MDEditor
                                    onChange={this.onChange}
                                    onCursor={this.onCursor}
                                    onDragEnter={this.cmDragEnter}
                                    theme={this.props.theme}
                                    value={this.props.value}
                                    onPaste={this.OnPaste}
                                />
                            </Dropzone>
                        </Card>
                    </Col>
                    <Col span={11} className={style.right}>
                        <Card
                            bordered={true}
                            style={
                                this.props.showEditorError
                                    ? {
                                        borderRight: ' 1px solid red',
                                        borderTop: ' 1px solid red',
                                        borderBottom: ' 1px solid red',
                                        marginLeft: '-2px'
                                    }
                                    : { borderRadius: '0 4px 4px 0' }
                            }
                            bodyStyle={{ padding: 0 }}
                        >
                            <div
                                style={{ height: 475 }}
                                className={style.preview}
                                dangerouslySetInnerHTML={{
                                    __html: marked(
                                        this.markdownToHtmlImg(
                                            this.state.value
                                        ),
                                        { breaks: true }
                                    )
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

MarkDownEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    uploadUrl: PropTypes.string.isRequired
};

export default MarkDownEditor;
