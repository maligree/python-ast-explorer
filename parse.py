import ast
import json

def classname(cls):
    return cls.__class__.__name__

def jsonify_ast(node, level=0):
    fields = {}
    for k in node._fields:
        fields[k] = '...'
        v = getattr(node, k)
        if isinstance(v, ast.AST):
            if v._fields:
                fields[k] = jsonify_ast(v)
            else:
                fields[k] = classname(v)

        elif isinstance(v, list):
            fields[k] = []
            for e in v:
                fields[k].append(jsonify_ast(e))

        elif isinstance(v, str):
            fields[k] = v

        elif isinstance(v, int) or isinstance(v, float):
            fields[k] = v

        elif v is None:
            fields[k] = None

        else:
            fields[k] = 'unrecognized'

    ret = { classname(node): fields }
    return ret

def make_ast(code):
    tree = ast.parse(code)
    return jsonify_ast(tree)

