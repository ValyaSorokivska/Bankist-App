'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  
    movementsDates: [
      '2022-11-18T21:31:17.178Z',
      '2022-12-23T07:42:02.383Z',
      '2023-01-28T09:15:04.904Z',
      '2023-04-01T10:17:24.185Z',
      '2023-05-08T14:11:59.604Z',
      '2023-06-23T17:01:17.194Z',
      '2023-06-28T23:36:17.929Z',
      '2023-06-29T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  
    movementsDates: [
      '2022-11-01T13:15:33.035Z',
      '2022-11-30T09:48:16.867Z',
      '2022-12-25T06:04:23.907Z',
      '2023-05-25T14:18:46.235Z',
      '2023-05-05T16:33:06.386Z',
      '2023-06-23T14:43:26.374Z',
      '2023-06-28T18:49:59.371Z',
      '2023-06-29T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  
  const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////FUNCTIONS/////////////////////////////////////

////////////////TIME
const formatMovementDate= function(date, locale){
const calcDaysPassed=(date1,date2)=> Math.round (Math.abs(date2-date1)/
(1000*60*60*24))

const daysPassed= calcDaysPassed(new Date(), date)

if(daysPassed===0)return `Today`
if (daysPassed===1) return `Yesterday`
if (daysPassed<=7) return `${daysPassed} days ago`
return new Intl.DateTimeFormat(locale).format(date)
}

//////////////FORMAT
const formatCur=function(value, locale,currency){
    return new Intl.NumberFormat(locale, {
        style:`currency`,
        currency: currency
    }).format(value)
}

/////////////////DISPLAY MOVEMENTS
const displayMovements= function(acc, sort=false){
    containerMovements.innerHTML=``

    const movs= sort? acc.movements.slice().sort((a,b)=> a-b): acc.movements

    movs.forEach(function (mov, i)  {

    const date= new Date (acc.movementsDates[i])
    const now=new Date()
    const day=`${date.getDate()}`.padStart(2,0)
    const month= `${date.getMonth() +1}`.padStart(2,0)
    const year= date.getFullYear()
    let displayDate=formatMovementDate(date, acc.locale)

const formattedMov= formatCur(mov, acc.locale, acc.currency)

    const type= mov> 0? `deposit` : `withdrawal`
    const html=` 
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>`

    containerMovements.insertAdjacentHTML(`afterbegin`, html)
});
}

//////////////BALANCE 
const calcDisplayBalance= function(acc)
{acc.balance =acc.movements.reduce((acc, mov)=>acc+mov, 0)
labelBalance.textContent=formatCur(acc.balance, acc.locale, acc.currency)
}

////////////// SUMMARY
const calcDisplaySummary = function(acc){
    const incomes = acc.movements
    .filter(mov =>mov>0)
    .reduce((acc,mov)=>acc+mov,0)
    labelSumIn.textContent=formatCur(incomes, acc.locale, acc.currency)

    const outcomes= acc.movements
    .filter(mov=> mov<0)
    .reduce ((acc,mov)=> acc+mov,0)
    labelSumOut.textContent=formatCur(Math.abs(outcomes), acc.locale, acc.currency)

    const interest=acc.movements 
    .filter(mov =>mov>0)
    .map(deposit=> (deposit * acc.interestRate)/100)
    .filter((int, i, arr)=> int>=1)
    .reduce ((acc,int)=> acc+int,0)

    labelSumInterest.textContent=formatCur(interest, acc.locale, acc.currency)
}

/////////////USERNAMES
const createUsernames= function(accs){
    accs.forEach(function(acc){
         acc.username= acc.owner.toLowerCase().split(` `)
        .map( name=> name[0]).join(``)
    })
}
createUsernames(accounts)

///////////DISPLAY
const updateUI= function(acc){
    displayMovements(acc)
    calcDisplayBalance(acc)
    calcDisplaySummary(acc)
}

const startLogOutTimer=function(){
const tick=function(){
const min=String(Math.trunc(time / 60)).padStart(2,0)
const sec=String(time % 60).padStart(2,0)
labelTimer.textContent=`${min}:${sec}`;

if (time===0){
    clearInterval(timer);
    labelWelcome.textContent= `Log in to get started`
    containerApp.style.opacity=0  
 }
 time--}
 

 let time= 150
tick()
 let timer= setInterval( tick,1000 )
return timer
}
////////////// EVENT HANDLER/////////////////////////////////////

////////LOGIN
let currentAccount,timer

btnLogin.addEventListener(`click`, function (e){
    e.preventDefault()
   currentAccount= accounts.find(acc=> acc.username === inputLoginUsername.value)

   if(currentAccount?. pin === +inputLoginPin.value) {
   labelWelcome.textContent= `Welcome back,
    ${currentAccount.owner.split(` `)[0]}`
   containerApp.style.opacity=100 
  
const now=new Date()
const options={
    hour:`numeric`,
    minute: `numeric`,
    day:`numeric`,
    month:`numeric`,
    year:`2-digit`,
}

labelDate.textContent=new Intl.DateTimeFormat(
   currentAccount.locale, options).format(now)

   
inputLoginUsername.value =inputLoginPin.value=``
inputLoginPin.blur()
updateUI(currentAccount)

if(timer)clearInterval(timer)
timer=startLogOutTimer()
}
})


//////////TRANSFER
btnTransfer.addEventListener(`click`,function(e){
    e.preventDefault()
    const amount= +inputTransferAmount.value
    const receiverAcc = accounts
    .find(acc=>acc.username=== inputTransferTo.value) 
    inputTransferAmount.value= inputTransferTo.value= ``

    if(amount > 0
        && receiverAcc
        && currentAccount.balance>=amount 
        && receiverAcc.username !== currentAccount.username){
    setTimeout(function(){
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount)
        currentAccount.movementsDates.push(new Date().toISOString())
        receiverAcc.movementsDates.push(new Date().toISOString())
        updateUI(currentAccount)
        clearInterval(timer)
        timer=startLogOutTimer()
        })     
        }
})


///////////////LOAN
btnLoan.addEventListener(`click`, function(e){
    e.preventDefault()
    const amount= Math.floor( inputLoanAmount.value)

    if (amount>0
        &&currentAccount.movements.some(mov=> mov>= amount* 0.1)){
        
    setTimeout(function(){

        currentAccount.movements.push(amount)
        currentAccount.movementsDates.push(new Date().toISOString())
        updateUI(currentAccount)
        clearInterval(timer)
        timer=startLogOutTimer()})
    }
    inputLoanAmount.value=``
    
} )

////////////// SORT
let sorted= false

btnSort.addEventListener(`click`, function(e){
    e.preventDefault()
    displayMovements(currentAccount.movements, !sorted)
    sorted=!sorted
})

/////////CLOSE ACCOUNT
btnClose.addEventListener(`click`, function(e){
    e.preventDefault()

    if (inputCloseUsername.value ===currentAccount.username
       && +inputClosePin.value === currentAccount.pin){
        const index= accounts
        .findIndex(acc=>acc.username=== currentAccount.username)
        accounts.splice(index, 1)
        containerApp.style.opacity=0
       }
        inputCloseUsername.value= inputClosePin.value=``
       
})

//////////////////////////////////////////////
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//const movementsUSD= movements.map(mov=> mov*euroToUsd)

const movementsDepositions=movements.map((mov,i)=>
    `Movement ${i + 1}: You ${mov > 0 ? `deposited` : `withdrew`} 
    ${Math.abs(mov)}`
)


const deposits= movements.filter(function(mov){
    return mov>0
})

const withdrawal = movements.filter(mov=> mov<0)


////MAX VALUE
const maxx= movements.reduce((acc,mov)=> acc>mov? acc: mov, movements[0])

const euroToUsd= 1.1


const totalDepositsUSD= movements
.filter(mov=> mov> 0)
.map(mov=> mov*euroToUsd)
.reduce((acc,mov)=>acc+mov,0)


const firstWithdrawal= movements.find(mov=>mov<0)

