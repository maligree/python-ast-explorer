module.exports = {
  lambda: `
# Example: a lambda
f = lambda n: n * 2
`,
  decorator: `
# Example: decorating 
def outer(fn):
  def wrapped(p, n, s):
    return fn([p, n, s])

  return wrapped
`,
  simpleClass: `
# Example: simple classes
class Foo(object):
  def __init__(self):
    pass

class Bar:
  def __init__(self):
    pass
`,
 withblock: `
with open('foo.txt') as fp:
  print fp
`

};
