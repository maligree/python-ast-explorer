# python-ast-explorer - a simple AST visualizer

The illustrous code behind [python-ast-explorer.com](https://python-ast-explorer.com), you can touch it.

## Making sense of it

See the `Dockerfile` for steps to get it up and running. It's basically a pretty bare `react-create-app` artifact that talks to a hacked up Flask app via repeated, desperate calls to `/api/_parse`.
