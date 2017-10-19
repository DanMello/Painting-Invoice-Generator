let form = document.getElementById('estimateForm');
let errorContainer = form.querySelector('#errorContainer');
let addButton = form.querySelector('#addButton');
let deleteButton = form.querySelector('#deleteButton');
let heightCalc = Math.round(window.innerHeight - 231);
let heightOfSpreedSheet = heightCalc.toString();
let tableOverFlow = document.getElementById('tableOverflow');
let errorIcon;

tableOverFlow.style.height = heightOfSpreedSheet + "px";

let buttons = form.querySelectorAll("#nextButton, #previousButton").forEach(button => {

  button.addEventListener('click', navigate)
  
});

let numberInputs = document.querySelectorAll("input[name='price']").forEach(input => {

  input.addEventListener('input', sum)

});

addButton.addEventListener('click', addColumn);
deleteButton.addEventListener('click', deleteColumn);

function navigate(e) {

  let activeContainer = form.querySelector('.active');
  let activeInputs = activeContainer.querySelectorAll('input');
  let buttonType = e.target.parentElement.id;
  let errorIcons = document.querySelectorAll('.fa-exclamation-circle');
  let customerInfo = form.querySelectorAll('#customerName, #customerAddress, #customerAddressPart2');
  let sibling;

  if (activeContainer.id === 'reviewEnd' && buttonType === 'nextButton') {

    window.print()

    return false
  };

  try {

    // Did this so if button previous i dont want to validate to allow user to go back before finishing current
    if (buttonType !== 'previousButton') {

      let empyFields = []
      
      for (i = 0; i < activeInputs.length; i++) {

        if (!activeInputs[i].value) {

          if (!errorIcons[i]) {
            
            errorIcon = document.createElement('i');

            errorIcon.className = 'fa fa-exclamation-circle'
            errorIcon.style.position = 'absolute';
            errorIcon.style.right = '10px';
            errorIcon.style.bottom = '50%';
            errorIcon.style['margin-bottom'] = '-11.5px';
            errorIcon.style['font-size'] = '20px';
            errorIcon.style.color = 'red';

          };

          activeInputs[i].parentElement.appendChild(errorIcon)

          activeInputs[i].style['border-color'] = 'red';
          activeInputs[i].addEventListener('focus', resetColor)
          activeInputs[i].addEventListener('blur', resetColor)

          empyFields.push('anotherOne')

        };

      };

      if (empyFields.length > 0) throw new Error('All fields required *')


    }

    addButton.classList.add('hidden')
    deleteButton.classList.add('hidden')

  } catch (e) {

    errorContainer.innerHTML = e;

    return false;

  };

  let customerName = form.querySelector("input[name='name']");
  let customerStreet = form.querySelector("input[name='street']");
  let customerTown = form.querySelector("input[name='town']");
  let customerState = form.querySelector("input[name='state']");
  let customerZip = form.querySelector("input[name='zip']");

  customerInfo.forEach(info => {

    if (info.id === 'customerName') {

      info.innerHTML = customerName.value;

    } else if (info.id === 'customerAddress') {

      info.innerHTML = customerStreet.value;

    } else if (info.id === 'customerAddressPart2' ) {

      info.innerHTML = `${customerTown.value} ${customerState.value} ${customerZip.value}`

    }

  })

  if (buttonType === 'nextButton') {

    sibling = activeContainer.nextElementSibling;

    errorContainer.innerHTML = ''; 

    let siblingInputs = sibling.querySelectorAll('input');

    for (i = 0; i < siblingInputs.length; i++) {

      if (siblingInputs[i].parentElement.children.length > 1) {

        errorContainer.innerHTML = 'You left an empty field behind *'; 

        break;

      };

    };

    activeInputs.forEach(input => {

      if (input.parentElement.children.length > 1) {

        input.removeEventListener('focus', resetColor)
        input.removeEventListener('blur', resetColor)
        input.parentElement.removeChild(input.nextElementSibling)

      };

    })

  } else if (buttonType === 'previousButton') {

    sibling = activeContainer.previousElementSibling;

    errorContainer.innerHTML = ''; 

  }

  if (sibling.id === 'clientAddress') previousButton.classList.add('invisible')
  else previousButton.classList.remove('invisible')

  if (sibling.id === 'tableContainer') {

    document.body.style.width = '100%';
    form.style.width = '100%';
    addButton.classList.remove('hidden')
    deleteButton.classList.remove('hidden')

    sum()

  } else {

    document.body.style.width = 'initial';
    form.style.width = 'initial';
  }

  if (sibling.id === 'reviewEnd') {

    document.body.style.width = '100%';
    form.style.width = '100%';

    let nextButtonParent = e.target.parentElement;
    
    nextButtonParent.firstElementChild.innerHTML = 'Done Print'
    nextButtonParent.lastElementChild.className = 'fa fa-print'

    let finalResults = form.querySelectorAll('input[name="total"], input[name="timeFrame"]');
    let finalTimeFrame = form.querySelector('#finalTime');
    let finalValue = form.querySelector('#finalValue');

    finalResults.forEach(input => {

      if (input['name'] === 'timeFrame') finalTimeFrame.innerHTML = 'Completion of the job should take around: ' + input.value
      else if (input['name'] === 'total') finalValue.innerHTML = input.value

    })

    tableRowRecursion()

  } else {

    let nextButtonParent = form.querySelector('#nextButton');

    nextButtonParent.firstElementChild.innerHTML = 'Next'

    nextButtonParent.lastElementChild.className = 'fa fa-chevron-circle-right' 

  }

  activeContainer.classList.remove('active');
  activeContainer.classList.add('hidden');
  sibling.classList.remove('hidden');
  sibling.classList.add('active');

};

function resetColor(e) {

  if (e.type === "blur" && !this.value) {

    this.style['border-color'] = 'red';

    this.nextElementSibling.classList.remove('hidden');

  }

  if (e.type === "focus") {

    this.style['border-color'] = 'initial';

    this.nextElementSibling.classList.add('hidden');
    
  }

};

function sum() {

  let inputs = form.querySelectorAll('input[name="price"]');
  let totalValue = form.querySelector('#totalValue');
  let finalNumberPercent30 = form.querySelector('#finalNumberPercent30')
  let finalNumberPercent35 = form.querySelector('#finalNumberPercent35')

  let sum = 0;

  inputs.forEach(inputs => {

    if (inputs.value !== '') {
      
      let filteredNum = inputs.value.replace(/\,/g, '')

      sum += parseFloat(filteredNum)

    };

  });

  let sum30percent = Math.floor(sum * .30)

  let sum35percent = Math.floor(sum * .35)

  finalNumberPercent30.innerHTML = '$ ' + sum30percent.toLocaleString();
  finalNumberPercent35.innerHTML = '$ ' + sum35percent.toLocaleString();

  let moneymoney = sum.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  totalValue.value = 'Total: $ ' + moneymoney;

};

function addColumn() {

  let tbody = document.getElementById('mainData');
  let tr = document.createElement('tr');
  let tableCells = ['description', 'price'];

  tableCells.forEach(cell => {

    let tableCell = document.createElement('td');
    let inputContainer = document.createElement('span');
    let input = document.createElement('input');

    if (cell === 'price') {

      input.addEventListener('input', sum)
      inputContainer.className = 'errorIconContainer moneyIconsHere';

    } else {

      inputContainer.className = 'errorIconContainer';

    }

    input.name = cell;
    input.type = 'text';

    inputContainer.appendChild(input);
    tableCell.appendChild(inputContainer);
    tr.appendChild(tableCell);

  })

  tbody.appendChild(tr);

};

function deleteColumn() {

  let tableBody = form.querySelector('#mainData');

  let inputs = form.querySelectorAll("input[name='description'], input[name='price']");

  inputs.forEach(input => {

    input.style.cursor = 'crosshair'

  })

  Array.from(tableBody.rows).forEach(row => {

    row.style['border'] = '5px solid red';
    row.addEventListener('click', deleteMe);

  })

}

function deleteMe() {

  this.removeEventListener('click', deleteMe)
  this.parentElement.removeChild(this)

  let tableBody = form.querySelector('#mainData');

  let inputs = form.querySelectorAll("input[name='description'], input[name='price']");

  inputs.forEach(input => {

    input.style.cursor = 'initial';
  })

  Array.from(tableBody.rows).forEach(row => {

    row.style['border'] = 'initial';
    row.removeEventListener('click', deleteMe)

  })

  sum()

};

function tableRowRecursion() {

  let originalTbody = document.getElementById('mainData');
  let tbody = document.getElementById('finalData');
  let finalDescription = form.querySelectorAll('input[name="description"]');
  let finalPrice = form.querySelectorAll('input[name="price"]');
  let tableCells = ['description', 'price'];
  let totalValue = form.querySelector('#totalValue');
  let finalValueNumber = form.querySelector('#finalValueNumber');

  let filteredValue = totalValue.value.replace(/Total:/, '');

  finalValueNumber.innerHTML = filteredValue;

  Array.from(tbody.children).forEach(item => {

    tbody.removeChild(item)

  })

  for (i = 0; i < originalTbody.rows.length; i++) {

    var tr = document.createElement('tr');

    tr.style['font-size'] = '17px';

    for (j = 0; j < tableCells.length; j++) {

      let tableCell = document.createElement('td');

      tableCell.style['padding-left'] = '5px';

      if (tableCells[j] === 'description') {
       
        tableCell.innerHTML = finalDescription[i].value;

      } else if (tableCells[j] === 'price') {

        let priceString = finalPrice[i].value;

        let priceNumber = parseFloat(priceString);
       
        tableCell.innerHTML = '$ ' + priceNumber.toLocaleString();

      }

      tr.appendChild(tableCell);

    };

    tbody.appendChild(tr);

  };

};