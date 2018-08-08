import React from 'react';

import { UnControlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import './MarkDownEditor.css';
import 'codemirror/addon/display/placeholder';

require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

const textPlaceholder =
    '这里支持 markdown 语法哦～\n' +
    '\n' +
    '# 一级标题\n' +
    '## 二级标题\n' +
    '### 三级标题\n' +
    '\n' +
    '我是正文格式\n' +
    '\n' +
    '1. 有序列表\n' +
    '2. 有序列表\n' +
    '\n' +
    '\n' +
    '- 无序列表\n' +
    '- 无序列表\n' +
    ' \n' +
    '图片可以直接拖到这里哦～ \n' +
    '\n' +
    '[我是链接](https://pencil.tap4fun.com/)';

const preventCM = (editor, event) => {
    event.preventDefault();
};

export default props => (
    <CodeMirror
        {...props}
        className="CodeMirrorCode"
        onDrop={preventCM}
        onDragOver={preventCM}
        autoCursor={false}
        options={{
            mode: 'markdown',
            theme: props.theme ? props.theme : 'material',
            lineNumbers: true,
            lineWrapping: true,
            placeholder: textPlaceholder
        }}
    />
);
