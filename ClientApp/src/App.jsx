import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { Home } from './pages/Home'
import NotFound from './pages/NotFound'
import './custom.scss'

export default class App extends Component {
  static displayName = App.name

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="*" component={NotFound} />
      </Switch>
    )
  }
}
