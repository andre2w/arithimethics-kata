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
  const values = parse(operation.split(" "), 0).parsedOperation;

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

interface ParseResult {
  parsedOperation: ParsedOperation;
  endingIndex: number;
}

function parse(operation: string[], startingIndex: number): ParseResult {
  const values: ParsedOperation = [];

  for (let i = startingIndex; i < operation.length; i++) {
    const char = operation[i];

    if (char === "(" && i > startingIndex) {
      if (Number.isInteger(values[values.length - 1])) {
        values.push("*");
      }
      const parsed = parse(operation, i);
      values.push(parsed.parsedOperation);

      // Jump to the end of nested parenthesis
      i = parsed.endingIndex;
    }  
    
    if (char === ")") {
      return { parsedOperation: values, endingIndex: i };
    } 
    
    if (isNumberOrSignal(char)) {
      const value = parseInt(char);
      if (Number.isInteger(parseInt(char))) {
        values.push(value);
      } else if (signals.has(char)) {
        values.push(char);
      }
    }
  }

  return { parsedOperation: values, endingIndex: operation.length };
}

function isNumberOrSignal(char: string) {
  return signals.has(char) || Number.isInteger(parseInt(char));
}

function getValue(value: (string | number | ParsedOperation)): number {
  return Array.isArray(value) ? calculateTotal(value) : value as number;
}