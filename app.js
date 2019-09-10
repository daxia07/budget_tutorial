var budgetModel = (() => {
  var data = {
    expenseList: [],
    incomeList: [],
    totalExpense: 0,
    totalIncome: 0
  }

  class Expense {
    constructor(des, value) {
      this.des = des;
      this.value = value;
    };
  }

  class Income {
    constructor(des, value) {
      this.des = des;
      this.value = value;
    };
  }

  const addElement = (type, des, value) => {
    var item, id;
    incomeList = data.incomeList;
    if (type === 'inc') {
      item = new Income(des, value);
      if (incomeList.length > 0) {
        id = incomeList[incomeList.length - 1].id + 1;
      } else {
        id = 0
      }
      item.id = id;
      incomeList.push(item);
      data.totalIncome += value;
    } else if (type === 'exp') {
      item = new Expense(des, value);
      if (expenseList.length > 0) {
        id = expenseList[expenseList.length - 1].id + 1;
      } else {
        id = 0
      }
      item.id = id;
      expenseList.push(item);
      data.totalExpense += value;
    } else {
      throw new Error('type not expected!')
    }
  };

  return {
    data,
    addElement,
  }
})();


var budgetUI = (() => {
  return {
    updateUI: () => {
      console.log('updated')
    },
  }
})();


var controller = (model, ui) => {
  return {
    init: () => {
      console.log('Application launched!');
      // change display to default
      // add listeners
    },
    publicTestAddElement: model.addElement,
    publicTestData: model.data,
  }
};


ctl = controller(budgetModel, budgetUI);
ctl.init();
ctl.publicTestAddElement('inc', 'wd', 2000);
console.log(ctl.publicTestData.totalIncome);