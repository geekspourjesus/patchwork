'use babel'
import React from 'react'
import classNames from 'classnames'
import app from '../lib/app'
import SearchPalette from './search-palette'
import Composer from './composer'

export default class TopNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isComposerOpen: false }

    // listen for events that should update our state
    app.on('focus:search', this.focusSearch.bind(this))
  }

  focusSearch() {
     this.refs.search.focus()
  }

  onClickCompose() {
    if (this.state.isComposerOpen) {
      this.setState({ isComposerOpen: false })
    } else {
      this.setState({ isComposerOpen: true }, () => {
        // focus the textarea
        if (this.props.recps) // if recps are provided, focus straight onto the textarea
          this.refs.composer.querySelector('textarea').focus()
        else
          this.refs.composer.querySelector('input[type=text], textarea').focus()

        // after the expand animation, remove the max-height limit so that the preview can expand
        setTimeout(() => this.refs.composer.style.maxHeight = '100%', 1e3)
      })
    }
  }

  onSend(msg) {
    this.setState({ isComposerOpen: false })
    if (this.props.onSend)
      this.props.onSend(msg)
  }

  render() {
    return <div className="topnav">
      <div className="flex topnav-bar">
        <div className="flex-fill"><SearchPalette ref="search"/></div>
        <a className="compose-btn" onClick={this.onClickCompose.bind(this)}>
          { this.state.isComposerOpen
            ? <span><i className="fa fa-times" /> Cancel </span>
            : <span><i className="fa fa-plus" /> New Post</span> }
        </a>
      </div>
      <div className="flex topnav-content">
        { (this.props.contentTypes||[]).map((ct, i) => {
          var cls = classNames({ selected: i===0 }) // TODO
          return <a key={ct} className={cls}>{ct}</a>
        }) }
      </div>
      { this.state.isComposerOpen ? <div ref="composer"><Composer {...this.props.composerProps} onSend={this.onSend.bind(this)} /></div> : '' }
    </div>
  }
}