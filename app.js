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
    let {
      incomeList,
      expenseList
    } = data;
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
    return id;
  };

  return {
    data,
    addElement,
  }
})();


var budgetUI = (() => {
  const DOM = {
    input: {
      type: '.add__type',
      des: '.add__description',
      value: '.add__value',
    },
    incomeList: '.income__list',
    expenseList: '.expenses__list',
    item_html: ({
      type,
      id,
      des,
      value
    }) => `<div class="item clearfix" id="${type}-${id}"><div class="item__description">${des}</div><div class="right clearfix"><div class="item__value">${value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
  };

  const renderElement = (type, des, value, id) => {
    let prefix, targetEle, new_item;
    if (type === 'inc') {
      prefix = 'income';
      targetEle = document.querySelector(DOM.incomeList);
    } else if (type === 'exp') {
      prefix = 'expense';
      targetEle = document.querySelector(DOM.expenseList);
    } else {
      throw new Error('unexpected type!')
    }
    new_item = DOM.item_html({
      type,
      value,
      des,
      id
    });
    targetEle.insertAdjacentHTML('afterbegin', new_item);
  };


  return {
    updateUI: (type, des, value) => {
      console.log(`updated entry for ${type} ${des} ${value}`)
    },
    DOM,
    renderElement,
  }
})();


var controller = (model, ui) => {
  DOM = ui.DOM;
  const addItem = () => {
    let type, des, value;
    type = document.querySelector(DOM.input.type).value;
    des = document.querySelector(DOM.input.des).value;
    value = parseFloat(document.querySelector(DOM.input.value).value);
    id = model.addElement(type, des, value);
    ui.renderElement(type, des, value, id);
    console.log('item added!');
    console.log(model.data)
    // fetch value and add to model, update UI
  };

  const setupListeners = () => {
    document.querySelector('.add__btn').addEventListener('click', addItem);
    document.addEventListener('keypress', e => {
      if (e.keyCode === 13) {
        addItem();
      }
    })
  };

  return {
    init: () => {
      console.log('Application launched!');
      setupListeners();
      // change display to default
      // add listeners
    },
    publicTestAddElement: model.addElement,
    publicTestData: model.data,
  }
};


ctl = controller(budgetModel, budgetUI);
ctl.init();

// TEST
// ctl.publicTestAddElement('inc', 'wd', 2000);
// console.log(ctl.publicTestData.totalIncome);