import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Form/>
      </div>
    );
  }
}

const range1 = n => Array.apply(null, {length: n}).map(Number.call, Number);
const range = (from, to) => range1(to - from + 1).map(n => n + from);

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      competitors: [
        {
          id: 12345,
          name: 'Kampus Kalle',
          routes: [],
        },
        {
          id: 12346,
          name: 'Spider Man',
          routes: [],
        },
        {
          id: 12347,
          name: 'Super Man',
          routes: [],
        },
        {
          id: 12348,
          name: 'Flexi Girl',
          routes: [],
        },
        {
          id: 12349,
          name: 'Monkey Man',
          routes: [],
        },
      ],
    };

    const id = 12345;
    this.state = {
      ...this.state,
      active: id,
      routes: this.getRoutes(id),
    };
  }

  setActive(id) {
    this.setState({
      ...this.state,
      active: id,
      routes: this.getRoutes(id),
    });
  }

  getRoutes(id) {
    const routes = this.getCompetitor(id).routes || [];
    return range(1, 23).map((id, idx) => routes[idx] || {
      id,
      top: 0,
      bonus: 0,
    });
  }

  getCompetitor(id) {
    return this.state.competitors.find(c => c.id === parseInt(id, 10));
  }

  getActiveCompetitor() {
    return this.getCompetitor(this.state.active);
  }

  setTop(id, route, tries) {
  }

  setBonus(id, route, tries) {
  }

  render() {
    return (
      <React.Fragment>
        <p>
          Competitor:
            <Competitors
              competitors={this.state.competitors}
              onChange={id => this.setActive(id)}
            />
        </p>
        <Routes
          routes={this.state.routes}
        />
      </React.Fragment>
    );
  }
}

class Routes extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.routes.map((route, idx) =>
          <Ascents
            key={idx}
            route={idx + 1}
            top={route.top}
            bonus={route.bonus}
          />
        )}
      </React.Fragment>
    );
  }
}

class Competitors extends Component {
  render() {
    return (
      <select
        onChange={event => this.props.onChange(event.target.value)}
      >
        <optgroup>
          {this.props.competitors.map((competitor, idx) =>
            <option key={idx} value={competitor.id}>{competitor.name}</option>
          )}
        </optgroup>
      </select>
    );
  }
}

class Ascents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: this.props.top,
      bonus: this.props.bonus,
    };
  }

  setTop(tries) {
    const top = tries;
    const bonus = this.state.bonus ? Math.min(this.state.bonus, tries) : top;
    this.setState({
      top,
      bonus,
    });
  }

  setBonus(tries) {
    this.setState({
      bonus: tries,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <span className="field">
            {this.props.route}
          </span>
          <span className="field">
            Top:
              <Tries
                tries={this.state.top}
                setTries={tries => this.setTop(tries)}
              />
              <Button
                enabled={true}
                selected={this.state.top === 0}
                text="X" onClick={() => this.setTop(0)}
              />
          </span>
          <span className="field">
            Bonus:
              <Tries
                tries={this.state.bonus}
                max={this.state.top}
                setTries={tries => this.setBonus(tries)}
              />
          </span>
          <span className="field">
            <AscentText
              bonus={this.state.bonus}
              top={this.state.top}
            />
          </span>
          <span className="field">
            <AscentNotation
              bonus={this.state.bonus}
              top={this.state.top}
            />
          </span>
        </div>
      </React.Fragment>
    );
  }
}

class AscentText extends Component {
  render() {
    return (
      <div className="ascentText">
        {this.props.top ? 1 : 0}t{this.props.top} {this.props.bonus ? 1 : 0}b{this.props.bonus}
      </div>
    );
  }
}

class AscentNotation extends Component {
  render() {
    const {
      top,
      bonus,
    } = this.props;
    const lines = Math.max(top, bonus);
    const line = n =>
      <path key={n} stroke="black" strokeWidth="3" d={`M${n}0 5 ${n}0 28`}/>;
    const drawTop = n =>
      top && <path stroke="black" strokeWidth="3" d={`M${10 * n - 6} 6 ${10 * n + 6} 6`}/>
    const drawBonus = n =>
      bonus && <path stroke="black" strokeWidth="3" d={`M${10 * n - 4} 16 ${10 * n + 4} 16`}/>

    return (
      <svg className="ascentNotation">
        {range(1, lines).map(line)}
        {drawBonus(bonus)}
        {drawTop(top)}
      </svg>
    );
  }
}

class Tries extends Component {
  render() {
    return (
      <div className="tries">
        { range(1, 5).map((tries, idx) =>
          <Button
            key={idx}
            text={tries}
            selected={tries === this.props.tries}
            enabled={
              (this.props.max === undefined) ? true : this.props.max === 0 || tries <= this.props.max
            }
            onClick={() => this.props.setTries(tries)}
          />
        ) }
      </div>
    );
  }
}

class Button extends Component {
  render() {
    return (
      <div
        className={"button"
          + (this.props.enabled ? " button-enabled" : " button-disabled")
          + (this.props.selected ? " button-selected" : "")
        }
        onClick={() => this.props.enabled && this.props.onClick()}
      >
        {this.props.text}
      </div>
    );
  }
}

export default App;
