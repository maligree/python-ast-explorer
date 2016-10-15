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
            <iframe src="https://ghbtns.com/github-btn.html?user=exana&repo=python-ast-explorer&type=star&count=true" frameBorder="0" scrolling="0" width="90px" height="20px"></iframe>
            <iframe src="https://ghbtns.com/github-btn.html?user=exana&repo=python-ast-explorer&type=fork&count=true" frameBorder="0" scrolling="0" width="90px" height="20px"></iframe>
            <iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Ffacebook.com%2Fexana.io&width=450&layout=standard&action=like&size=small&show_faces=false&share=true&height=80&appId=1597939180472331" width="100" height="20" style={{border:'none',overflow:'hidden'}} scrolling="no" frameBorder="0" allowTransparency="true"></iframe>
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
          <iframe src="https://ghbtns.com/github-btn.html?user=exana&repo=python-ast-explorer&type=star&count=true" frameBorder="0" scrolling="0" width="90px" height="20px"></iframe>
          <iframe src="https://ghbtns.com/github-btn.html?user=exana&repo=python-ast-explorer&type=fork&count=true" frameBorder="0" scrolling="0" width="90px" height="20px"></iframe>
          </div>

          <iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Ffacebook.com%2Fexana.io&width=450&layout=standard&action=like&size=small&show_faces=true&share=true&height=80&appId=1597939180472331" width="450" height="80" style={{border:'none',overflow:'hidden'}} scrolling="no" frameBorder="0" allowTransparency="true"></iframe><br/>


          Want to suggest something? See <a href="https://github.com/exana/python-ast-explorer">GitHub</a> or hit <a href="mailto:hi@exana.io">hi@exana.io</a>, we're listening.<br/><br/>
         Hacked up by some random chap from <a href="https://exana.io">exana.io</a>. Very much inspired by <a style={{color:'#4b4b4b'}} href="https://astexplorer.net">astexplorer.net</a>, thank you!<br/>
        By the way, we <a href="https://exana.io/phabricator">Host Phabricator</a>, <a href="https://exana.io/statuspage">Free Status Pages</a>, <a href="https://exana.io/monitoring">Monitor Servers</a> and - soon - <a href="https://exana.io/buildbot">provide Buildbot Infrastructure</a>. Come visit?
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
