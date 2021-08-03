import test, { ExecutionContext }  from "ava";
import { calculate } from "../src/arithimetics";

test("parse a single number", assert => {
  assert.is(calculate("( 1 )"), 1);
});

function testCalculate(assert: ExecutionContext, input: string, expected: number) {
  assert.is(calculate(input), expected);  
}

testCalculate.title = (title: string, input: string, expected: number) => `${title} ${input} ${expected}`;

parametrisedTest("parse sum operation", testCalculate, 
  { input: "( 1 + 1 )", expected: 2 },
  { input: "( 2 + 2 )", expected: 4 },
  { input: "( 4 + 3 )", expected: 7 },
  { input: "( 10 + 3 )", expected: 13 }
);

parametrisedTest("parse subtraction operation", testCalculate, 
  { input: "( 1 - 1 )", expected: 0  },
  { input: "( 5 - 4 )", expected: 1  },
  { input: "( 2 - 5 )", expected: -3 },
  { input: "( 150 - 50 )", expected: 100 }
);

parametrisedTest("parse multipication operation", testCalculate, 
  { input: "( 5 * 2 ) ", expected: 10 },
  { input: "( 4 * 4 )", expected: 16 },
);

parametrisedTest("parse division operation", testCalculate, 
  { input: "( 10 / 2 )", expected: 5 },
  { input: "( 100 / 100 )", expected: 1},
);

test("Division by zero should throw error", assert => {
  assert.throws(() => calculate("( 100 / 0 )"));
});

parametrisedTest("calculate result when operation have multiple number with same signal", testCalculate, 
  { input: "( 10 + 10 + 10 )", expected: 30 },
  { input: "( 5 + 10 + 10 + 40 )", expected: 65 },
  { input: "( 10 - 4 - 1 )", expected: 5 }
);

interface TestData<InputType, ExpectedType> {
  input: InputType,
  expected: ExpectedType,
}

function parametrisedTest(title: string, macro: typeof testCalculate, ...data: TestData<string, number>[]): void {
  data.forEach(testData => test(`${title}: ${testData}`, macro, testData.input, testData.expected));
}

