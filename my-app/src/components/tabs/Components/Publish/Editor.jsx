import React from 'react'
import { Button, InputItem, Toast } from 'antd-mobile';

import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
export default class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      text: '' ,
      title: ''
    }
    this.modules = {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [ 'image']
      ],
    }
  
    this.formats = [
      'header',
      'bold', 'italic', 'underline',
      'list', 'bullet', 'indent',
      'image'
    ]
  }
  handleChange(value) {
    this.setState({ text: value })
  }
  render() {
    return(
      <div>
        <InputItem
          clear
          placeholder="auto focus"
          ref={el => this.autoFocusInst = el}
          onChange={this.changeTitle}
          value={this.state.title}
        >
          标题
        </InputItem>
        <ReactQuill
            value={this.state.text}
            onChange={this.handleChange} modules={this.modules}
            formats={this.formats} 
        />
        <Button onClick={this.submit}>提交</Button>
      </div>
    ) 
  }

  submit = () => {
    let data = {
      title: this.state.title,
      article: this.state.text
    }
    this.$axios.post('/publishArticle', data).then(res => {
      if(res.data.status === 200) {
        Toast.success(res.data.msg, 1, () => {
          this.props.history.push('/publish')
        });
      }
    })

  }
  changeTitle =(val) => {
    this.setState({
      title: val
    })
  }

}
