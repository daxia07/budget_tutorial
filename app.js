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
    budgetValue: '.budget__value',
    budgetIncome: '.budget__income--value',
    budgetExpense: '.budget__expenses--value',
    budgetMonth: '.budget__title--month',
    item_add: '.add__btn',
    item_delete: '.container',
    btn_delete: '.ion-ios-close-outline',
    item_html: ({
        type,
        id,
        des,
        value
      }) =>
      `<div class="item clearfix" id="${type}-${id}"><div class="item__description">${des}</div><div class="right clearfix"><div class="item__value">${value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
  };

  const addElement = (type, des, value, id) => {
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
    // clean up
    document.querySelector(DOM.input.des).value = '';
    document.querySelector(DOM.input.value).value = '';
  };

  const updateTotal = (totalIncome, totalExpense) => {
    document.querySelector(DOM.budgetValue).textContent = totalIncome - totalExpense;
    document.querySelector(DOM.budgetIncome).textContent = totalIncome;
    document.querySelector(DOM.budgetExpense).textContent = totalExpense;
  };

  const updateMonth = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date();
    document.querySelector(DOM.budgetMonth).textContent = monthNames[d.getMonth()]
  }


  return {
    updateUI: (type, des, value) => {
      console.log(`updated entry for ${type} ${des} ${value}`)
    },
    DOM,
    addElement,
    updateTotal,
    updateMonth,
  }
})();


var controller = (model, ui) => {
  let DOM = ui.DOM;
  const addItem = () => {
    let type, des, value;
    type = document.querySelector(DOM.input.type).value;
    des = document.querySelector(DOM.input.des).value;
    try {
      value = parseFloat(document.querySelector(DOM.input.value).value);
    } catch (err) {
      console.log(err);
      return
    }
    // check input
    if (des === '') {
      console.log('description should not be empty!');
      return
    }
    id = model.addElement(type, des, value);
    ui.addElement(type, des, value, id);
    ui.updateTotal(model.data.totalIncome, model.data.totalExpense);
    console.log('item added!');
    console.log(model.data)
    // fetch value and add to model, update UI
  };

  const deleteItem = (event) => {
    if (event.target.className !== DOM.butDelete) {
      return
    }
    itemDelete = event.target.parentNode.parentNode.parentNode.parentNode;
    let [type, id] = itemDelete.id.split('-');
    id = parseInt(id);
    // remove by id
    if (type === 'inc') {
      index = model.data.incomeList.findIndex((node, index, array) => node.id === id);
      model.data.totalIncome -= model.data.incomeList[index].value;
      model.data.incomeList = model.data.incomeList.filter(node => node.id !== id);
    } else if (type === 'exp') {
      index = model.data.expenseList.findIndex((node, index, array) => node.id === id);
      model.data.totalExpense -= parseFloat(model.data.expenseList[index].value);
      model.data.expenseList = model.data.expenseList.filter(node => node.id !== id);
    } else {
      throw new Error('unexpected type!');
    }
    // update ui
    itemDelete.parentNode.removeChild(itemDelete);
    // update total
    ui.updateTotal(model.data.totalIncome, model.data.totalExpense);
    console.log(event);
  };

  const setupListeners = () => {
    document.querySelector(DOM.item_add).addEventListener('click', addItem);
    document.addEventListener('keypress', e => {
      if (e.keyCode === 13) {
        addItem();
      }
    });
    document.querySelector(DOM.item_delete).addEventListener('click', deleteItem);
  };

  return {
    init: () => {
      console.log('Application launched!');
      setupListeners();
      ui.updateTotal(0, 0);
      ui.updateMonth();
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