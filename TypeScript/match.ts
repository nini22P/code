type Matcher<T> = (value: T) => boolean;
type Action<T, R> = (value: T) => R;

class Match<T, R> {
  private patterns: { matcher: Matcher<T>; action: Action<T, R> }[] = [];

  constructor(private value: T) { }

  with(pattern: Partial<T>, action: Action<T, R>): this {
    const matcher: Matcher<T> = (value) => {
      for (const key in pattern) {
        if (pattern[key] !== value[key]) {
          return false;
        }
      }
      return true;
    };
    this.patterns.push({ matcher, action });
    return this;
  }

  exhaustive(): R {
    for (const { matcher, action } of this.patterns) {
      if (matcher(this.value)) {
        return action(this.value);
      }
    }
    throw new Error('No match found');
  }
}

function match<T, R>(value: T): Match<T, R> {
  return new Match(value);
}

type Result = string;

const result: Result = 'close';

match(result)
  .with('open', () => console.log('Open'))
  .with('close', () => console.log('Close'))
  .exhaustive();
