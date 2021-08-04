const operations: Record<string, (left: number, right:number) => number> = {
  "+": (left: number, right: number) => left + right,
  "-": (left: number, right: number) => left - right,
  "/": (left: number, right: number) => {
    if (right === 0) throw new Error("Division by 0");
    return left / right;
  },
  "*": (left: number, right: number) => left * right,
}

const signals = new Set(["+", "-", "/", "*"]);

const priorities = [["*", "/"], ["+", "-"]];

export function calculate(operation: string): number {
  const values = parse(operation, 0);

  if (values.length === 1) {
    return values[0] as number;
  }
  

  return calculateTotal(values);
}

type Operation<T> = (string | number | T)[];
interface ParsedOperation extends Operation<ParsedOperation> {};

function calculateTotal(values: ParsedOperation) {
  for (const priority of priorities) {
    calculateTotalForSymbols(values, priority);
  }
  return values[0] as number;
}

function calculateTotalForSymbols(values: ParsedOperation, symbols: string[]) {
  for (let i = 0; i < values.length; i++) {
    const curr = values[i];

    if (typeof curr === "string") {

      if (symbols.includes(curr)) {
        const left = getValue(values[i - 1]);
        const right = getValue(values[i + 1]);
        const result = operations[curr](left, right);
        values.splice(i - 1, 3, result);
        i--;
      }

    }
  }
}

function parse(operation: string, startingIndex: number) {
  const values: ParsedOperation = [];

  let currentValue = "";

  for (let i = startingIndex; i < operation.length; i++) {
    const char = operation.charAt(i);

    if (isOperationSignal(char, operation.charAt(i + 1))) {
      values.push(char);
    } else if (char === " ") {
      pushValue(currentValue, values);
      currentValue = "";
    } else if (char !== "(" && char !== ")") {
      currentValue += char;
    } else if (char === "(" && i > startingIndex) {
      const parsed = parse(operation, i);
      values.push(parsed)
    } else if (char === ")") {
      return values;
    }
  }

  return values;
}

function pushValue(currentValue: string, values: ParsedOperation) {
  const value = parseInt(currentValue);
  if (Number.isInteger(value)) {
    values.push(value);
  }
}

function isOperationSignal(char: string, nextChar: string) {
  return signals.has(char) && nextChar === " ";
}

function getValue(value: (string | number | ParsedOperation)): number {
  if (Array.isArray(value)) {
    return calculateTotal(value);
  } else {
    return value as number; 
  }
}