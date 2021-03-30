"use strict";

const regBrkt = new RegExp(String.raw`\(([^\(|\)]+)\)`);
const regReplaceMinusOnPlusMinus = new RegExp(String.raw`(?!^)(-)(?=\d(?:\.\d)?(?:\*|\/))`,"g");
const regMultDiv = new RegExp(String.raw`\*|\/`, "g");
const regSumMin = new RegExp(String.raw`\b(?:(?!^|\*|\/))-(?!\d\/|\*)|\b(?:(?!^|\*|\/))\+`,"g");

class Solver {
  constructor() {
    if (this instanceof Solver) {
      throw Error('A static class cannot be instantiated.');
    }
  }

  static solveExpression(expr) {
    expr = expr.replace(/\s/g,'');
    expr = Solver.replacePlusMinus(expr);
  
    while (expr.match(regBrkt)) {
      
      const subExprMatch = expr.match(regBrkt);
      const subExpr = subExprMatch[1];      
      expr = expr.replace(subExprMatch[0], Solver.solvePrimitive(subExpr));
      expr = Solver.replacePlusMinus(expr);
      
    }
    return Solver.solvePrimitive(expr);
  }

  static solvePrimitive(expr) {

    expr = expr.replace(regReplaceMinusOnPlusMinus, "+-");  
    let arrMulDiv = expr.match(regMultDiv) || false; //Записываем * и / в порядке выполнения иначе null
    let arrPlusMinus = expr.match(regSumMin) || false; //Записываем + и - в порядке выполнения иначе null
  
    //Если нашли +- и /*
    if (arrPlusMinus && arrMulDiv) {
      let arrSubExpr = expr.split(regSumMin); //тут  получаем массив вида ["1*2", "-7/-7", "5/5*7*2"]

      for (let i in arrSubExpr) {
        arrSubExpr[i] = Solver.solveMulDiv(arrSubExpr[i]);
      } 
      return Solver.solvePlusMinus(arrSubExpr, arrPlusMinus);
    } //Если есть только + или -
    else if (arrPlusMinus) {      
      return Solver.solvePlusMinus(expr);
    } //Если есть только * или /
    else if (arrMulDiv) {     
      return Solver.solveMulDiv(expr);
    } //если поступает только одно число
    else if (parseFloat(expr)) {
      return parseFloat(expr);
    }
  
    return 0;
  }

  static solvePlusMinus(...args) {
    let numbers, actions;

    if(args[1]){
        numbers = args[0];
        actions = args[1];
        
    }else{
        numbers = args[0].split(regSumMin);
        actions = args[0].match(regSumMin) || [];
    }

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
    return numbers[0] || 0;
  }

  static solveMulDiv(...args) {
    let numbers, actions;
    
    if(args[1]){
        numbers = args[0];
        actions = args[1];
        
    }else{
        numbers = args[0].split(regMultDiv);
        actions = args[0].match(regMultDiv) || [];
    }
    // console.log(args, numbers, actions)

    numbers = numbers.map((e) => {
      return parseFloat(e);
    });
  
    for (let act of actions) {
      if (act === "*") {
        // console.log(numbers[0], act, numbers[1]);
        numbers[1] = numbers[0] * numbers[1];
        numbers.shift();
      } else if (act === "/") {
        // console.log(numbers[0], act, numbers[1]);
        numbers[1] = numbers[0] / numbers[1];
        numbers.shift();
      }
    }
    return numbers[0] || 0;
  }

  static replacePlusMinus(expr) {
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
}