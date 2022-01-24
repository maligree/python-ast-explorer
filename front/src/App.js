import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import JSONTree from 'react-json-tree';
import snippets from './snippets';

var defaultCode = `
def foo(a, b=10):
  return a + b
`;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { ast: {}, code: defaultCode, showNull: true };
    this.onCodeChange = this.onCodeChange.bind(this);
    this.onShowNullChange = this.onShowNullChange.bind(this);
    this.setCodeSnippet = this.setCodeSnippet.bind(this);
    this.fetchAst = this.fetchAst.bind(this);
  }


  onKeyDown(event) {
    var keyCode = event.keyCode || event.which; 
    if (keyCode === 9) { 
      // Prevent focus change
      // TODO: insert some spaces instead... 
      event.preventDefault(); 
    }
  }

  fetchAst(code) {
    var self = this;
    fetch('/api/_parse', {
      method: 'POST',
      body: code,
    }).then(function(response) {
      response.json().then((json) => {
        console.log(json);
        self.state.ast = __process__(json.ast, self.state);
        self.forceUpdate();
      });
    });
  }

  componentDidMount() {
    this.fetchAst(this.state.code);
  }

  setCodeSnippet(name) {
    this.setState({ code: snippets[name] });
    this.fetchAst(this.state.code);
  }

  example(name) {
    var self = this;
    return function() {
      self.setCodeSnippet(name);
    };
  }

  onCodeChange(event) {
    this.setState({ code: event.target.value });
    this.fetchAst(event.target.value);
  }

  onShowNullChange(event) {
    this.setState({ showNull: !this.state.showNull });
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Python AST explorer</h1>
          <div style={{marginBottom:20,textAlign:'center'}}>
            <div style={{display:'inline-block'}}>
            <iframe src="https://ghbtns.com/github-btn.html?user=maligree&repo=python-ast-explorer&type=star&count=true" frameBorder="0" scrolling="0" width="90px" height="20px"></iframe>
            <iframe src="https://ghbtns.com/github-btn.html?user=maligree&repo=python-ast-explorer&type=fork&count=true" frameBorder="0" scrolling="0" width="90px" height="20px"></iframe>
            </div>
          </div>
        </div>

        <div style={{fontSize:14,fontFamily:'courier',marginTop:10,marginBottom:7}}>
          <span>Examples: </span>
          <span onClick={this.example('simpleClass')} className='example'>Simple class</span>
          &nbsp;
          <span onClick={this.example('decorator')} className='example'>Decorator</span>
          &nbsp;
          <span onClick={this.example('lambda')} className='example'>Lambda</span>
          &nbsp;
          <span onClick={this.example('withblock')} className='example'>with ... as</span>
          <span>&nbsp;</span>
          <span style={{marginLeft:25}}>Options:</span>
          <label htmlFor="sn">
          <input id="sn" type="checkbox" onChange={this.onShowNullChange} defaultChecked={true} />
          Show null attrs
        </label>
        </div>
        <table style={{width:'100%'}}>
          <tbody>
          <tr>
            <td id="lefty" >
                <textarea value={this.state.code} onKeyDown={this.onKeyDown} onChange={this.onCodeChange} />
            </td>
            <td id="righty">
              <JSONTree data={this.state.ast} hideRoot={true} shouldExpandNode={shouldExpandNode} />
            </td>
          </tr>
          </tbody>
        </table>
        <div className='footer'>

          <div style={{marginBottom:20}}>
          <iframe src="https://ghbtns.com/github-btn.html?user=maligree&repo=python-ast-explorer&type=star&count=true" frameBorder="0" scrolling="0" width="90px" height="20px"></iframe>
          <iframe src="https://ghbtns.com/github-btn.html?user=maligree&repo=python-ast-explorer&type=fork&count=true" frameBorder="0" scrolling="0" width="90px" height="20px"></iframe>
          </div>
          <p>Be sure to check out <a href="https://hackattic.com">hackattic - no nonsense, real-world challenges</a> as well.</p>
          <p>Motorsports fan, by any chance? Take a look at a <a href="https://whenvroom.com">motorsports calendar</a> I'm developing.</p>
          <p><a href="https://whenvroom.com/calendar/2021/imsa-weathertech">IMSA WeatherTech 2021 Calendar</a>, <a href="https://whenvroom.com/calendar/2021/adac-gt-masters">ADAC GT Masters 2021 Calendar</a></p>
        </div>
      </div>
    );
  }
}

function shouldExpandNode(a, b, c) {
  return c < 10;
}

function __process__(ast, state) {
  var ast_ = ast;
  if (!state.showNull) { ast_ = filterNull(ast) };
  return ast_;
};

function filterNull(obj) {
  var newObj = {};
  for (var k in obj) {
    if (obj[k] !== null) {
      if (typeof obj[k] === 'object') {
        newObj[k] = filterNull(obj[k]);
      } else if (obj[k] instanceof Array) {
        newObj[k] = obj[k].map((v) => filterNull(v));
      } else {
        newObj[k] = obj[k];
      }
    }
  }
  return newObj;
}

export default App;
