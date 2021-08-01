import test, { ExecutionContext }  from "ava";
import { calculate } from "../src/arithimetics";

test("parse a single number", assert => {
  assert.is(calculate("(1)"), 1);
});

function testCalculate(assert: ExecutionContext, input: string, expected: number) {
  assert.is(calculate(input), expected);  
}

testCalculate.title = (title: string = '', input: string, expected: number) => `${title} ${input} ${expected}`;

parametrisedTest("parse sum operation", testCalculate, 
  { input: "(1+1)", expected: 2 },
  { input: "(2+2)", expected: 4 },
  { input: "(4+3)", expected: 7 }
);

parametrisedTest("parse subtraction operation", testCalculate, 
  { input: "(1-1)", expected: 0 },
);

interface TestData<InputType, ExpectedType> {
  input: InputType,
  expected: ExpectedType,
}

function parametrisedTest(title: string, macro: typeof testCalculate, ...data: TestData<string, number>[]) {
  data.forEach(testData => test(`${title}: ${testData}`, macro, testData.input, testData.expected));
}

