"use strict";
//Evaluate mathematical expression from string

//вызывается когда раскрыты все скобки
function solvePrimitive(expr) {
  const replaceMinusOnPlusMinus = new RegExp(
    String.raw`(?!^)(-)(?=\d(?:\.\d)?(?:\*|\/))`,
    "g"
  );
  expr = expr.replace(replaceMinusOnPlusMinus, "+-");

  const regMultDiv = new RegExp(String.raw`\*|\/`, "g");
  const regSumMin = new RegExp(
    String.raw`\b(?:(?!^|\*|\/))-(?!\d\/|\*)|\b(?:(?!^|\*|\/))\+`,
    "g"
  );
  // String.raw`\b(?:(?!^|\*|\/))-|\b(?:(?!^|\*|\/))\+`,"g");
  //выбираем все + и - кроме первого и если стоит * или /
  //   const contain = (e) => expr.indexOf(e) !== -1;

  let arrMulDiv = expr.match(regMultDiv) || false; //Записываем * и / в порядке выполнения иначе null
  let arrPlusMinus = expr.match(regSumMin) || false; //Записываем + и - в порядке выполнения иначе null

  //Если нашли +- и /*
  if (arrPlusMinus && arrMulDiv) {
    let arrNum = expr.split(regSumMin); //тут  получаем массив вида ["1*2", "-7/-7", "5/5*7*2"]

    for (let i in arrNum) {
      arrNum[i] = solveMulDiv(
        arrNum[i].split(regMultDiv),
        arrNum[i].match(regMultDiv) || []
      );
    }

    return solvePlusMinus(arrNum, arrPlusMinus);
  } //Если есть только + или -
  else if (arrPlusMinus) {
    const arrNum = expr.split(regSumMin);
    return solvePlusMinus(arrNum, arrPlusMinus);
  } //Если есть только * или /
  else if (arrMulDiv) {
    const arrNum = expr.split(regMultDiv);
    return solveMulDiv(arrNum, arrMulDiv);
  } //если поступает только одно число
  else if (parseFloat(expr)) {
    return parseFloat(expr);
  }

  return 0;
}

//принимает только массив строковых чисел и строковых операндов
function solvePlusMinus(numbers, actions) {
  numbers = numbers.map((e) => parseFloat(e));

  for (let act of actions) {
    if (act === "+") {
      numbers[1] = numbers[0] + numbers[1];
      numbers.shift();
    } else if (act === "-") {
      numbers[1] = numbers[0] - numbers[1];
      numbers.shift();
    }
  }
  return numbers[0] || 0; //если пришел пустой массив - возвращаем 0
}

//принимает только массив строковых чисел и строковых операндов
function solveMulDiv(numbers, actions) {
  numbers = numbers.map((e) => {
    return parseFloat(e);
  });

  for (let act of actions) {
    if (act === "*") {
      //   console.log(numbers[0], act, numbers[1]);
      numbers[1] = numbers[0] * numbers[1];
      numbers.shift();
    } else if (act === "/") {
      //   console.log(numbers[0], act, numbers[1]);
      numbers[1] = numbers[0] / numbers[1];
      numbers.shift();
    }
  }
  return numbers[0] || 0; //если пришел пустой массив - возвращаем 0
}

//Заменяем все --, +-, -+, ++ на один операнд + или -
function replacePlusMinus(expr) {
  const minMin = new RegExp("--", "g");
  const plusMin = new RegExp("/+-/", "g");
  const minPlus = new RegExp("-+", "g");
  const PlusPlus = new RegExp("/+/+", "g");

  while (
    minMin.test(expr) ||
    plusMin.test(expr) ||
    minPlus.test(expr) ||
    PlusPlus.test(expr)
  ) {
    expr = expr.replace(/--/g, "+");
    expr = expr.replace(/\+-/g, "-");
    expr = expr.replace(/-\+/g, "-");
    expr = expr.replace(/\+\+/g, "+");
  }
  return expr;
}

//валидно ли изначальное выражение
function isValidExpr(expr) {
  const e = (ex) => expr.indexOf(ex) !== -1;
  if (e("+ - ") || e("- - ") || e("* - ") || e("/ - ")) {
    return false;
  } else {
    return true;
  }
}

//простой счетчик символа в строк
function countSym(str, sym) {
  let count = 0;
  for (let i of str) {
    if (i === sym) {
      count++;
    }
  }
  return count;
}

//tests
let e = "-2-3-2-2-2*1-2-8-6-12";
// console.log("solvePlusMinus");
// console.log(solvePlusMinus([], []) === 0);
// console.log(solvePlusMinus([12], []) === 12);
// console.log(solvePlusMinus(["12.5", "0.5"], ["+"]) === 13);

// console.log("solveMulDiv");
// console.log(solveMulDiv([], []) === 0);
// console.log(solveMulDiv([12], []) === 12);
// console.log(solveMulDiv(["12.5", "2"], ["*"]) === 25);

console.log("solvePrimitive");
const testSolvePrimitive = (e) => console.log(solvePrimitive(e) === eval(e));

// e = "-12*2";
// testSolvePrimitive(e);
// e = "-12/2";
// testSolvePrimitive(e);
// e = "6/-12";
// testSolvePrimitive(e);
// e = "12";
// testSolvePrimitive(e);
// e = "-12/2+5";
// testSolvePrimitive(e);
e = "-2-3-2-2-1/-2-8-6-12";
testSolvePrimitive(e);
e = "-2*-12+5-7/-7+0.5*3";
testSolvePrimitive(e);

//\b(?:(?!^|\*|\/))-(?!\d\/|\*)|\b(?:(?!^|\*|\/))\+
//эта штука выделяет -, которые не первые и перед которыми нет знаков *или-,
//а также после которых нет делимого или множителя
//выделяет +, которые не первые и перед которыми нет знаков *или-,

//(?!^)(-)(?=\d(?:\.\d)?(?:\*|\/))
//для замены выражения вида -D/D на +-D/D.
