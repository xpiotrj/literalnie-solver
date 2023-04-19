let word_data = {notpresent: [], present: [], present_wlocation: []}
const alphabet = 'ieaonzsrwyctdkpmłjlubghężąóśćfńź'.split('');


function lookForWords(){
    const NOTPRESENT_WORDS = WORDS.filter(element => !word_data['notpresent'].some(notpresent => element.includes(notpresent.toLowerCase())))
    const PRESENT_WORDS = WORDS.filter(element => word_data['present'].every(present => element.includes(present.toLowerCase())))
    const PRESENTTWLOC_WORDS = WORDS.filter(element => word_data['present_wlocation'].every(presentwloc => element[presentwloc[1] - 1] == presentwloc[0].toLowerCase()))

    showResults(parseArrays(NOTPRESENT_WORDS, PRESENT_WORDS, PRESENTTWLOC_WORDS))
}


function parseArrays(arr1, arr2, arr3){
    if(arr3.length == 0 && arr2.length == 0){
        return arr1
    }
    
    if(arr3.length == 0){
        return arr1.filter(element => arr2.includes(element));
    }

    if(arr2.length == 0){
        return arr1.filter(element => arr3.includes(element));
    }

    let temp = arr1.filter(element => arr2.includes(element));
    return temp.filter(element => arr3.includes(element))
}

function proposeWord(){
    let chars_used = [];
    word_data['notpresent'].forEach(notpresent => {chars_used.push(notpresent.toLowerCase())})
    word_data['present'].forEach(present => {chars_used.push(present.toLowerCase())})
    word_data['present_wlocation'].forEach(presentwloc => {chars_used.push(presentwloc[0].toLowerCase())})

    
    const chars_left = alphabet.filter(val => !chars_used.includes(val))

    console.log(chars_left)

    for(let i = 5; i > 0; i--){
        let chars = chars_left.slice(0, i)

        const inputElements = [...document.querySelectorAll('input.word-letter')]

        const PRESENT_WORDS = WORDS.filter(element => chars.every(present => element.includes(present)))
        if(PRESENT_WORDS.length != 0){
            
            const word = PRESENT_WORDS[Math.floor(Math.random() * PRESENT_WORDS.length)]
            inputElements.forEach((input, index) => {
                input.value = word[index].toUpperCase()
                input.style.backgroundColor = "var(--notpresent)"
                input.setAttribute("data-type", "notpresent")
            })
            return
        }
    }
}

function showResults(arr){
    const results_div = document.getElementById('results')
    results_div.innerHTML = ''
    alert(arr.length)
    arr.forEach(element => {
        results_div.innerHTML += element + '<br>'
    });
}

function calculatePossibilities(){
    const NOTPRESENT_WORDS = WORDS.filter(element => !word_data['notpresent'].some(notpresent => element.includes(notpresent.toLowerCase())))
    const PRESENT_WORDS = WORDS.filter(element => word_data['present'].every(present => element.includes(present.toLowerCase())))
    const PRESENTTWLOC_WORDS = WORDS.filter(element => word_data['present_wlocation'].every(presentwloc => element[presentwloc[1] - 1] == presentwloc[0].toLowerCase()))

    let x = parseArrays(NOTPRESENT_WORDS, PRESENT_WORDS, PRESENTTWLOC_WORDS).length

    console.log(word_data)

    document.getElementById('possibilities').innerHTML = 'Possibilities: ' + x.toString()
}

function removeChar(element){
    const char = element.getAttribute('data-char')
    const type = element.getAttribute('data-type')

    if(type == 'present_wlocation'){
        const index = parseInt(element.getAttribute('data-index'))
        let arrindex = word_data[type].indexOf([char, index])
        word_data[type].splice(arrindex, 1)
        updateTable()
        return
    }

    word_data[type].splice(word_data[type].indexOf(char), 1)
    updateTableNew()
}

window.onload = () => {
    const inputElements = [...document.querySelectorAll('input.word-letter')]

    inputElements.forEach((ele,index)=>{
        ele.addEventListener('keydown',(e)=>{
          // if the keycode is backspace & the current field is empty
          // focus the input before the current. Then the event happens
          // which will clear the "before" input box.
          if(e.keyCode === 8 && e.target.value==='') inputElements[Math.max(0,index-1)].focus()
        })
        ele.addEventListener('input',(e)=>{
          // take the first character of the input
          // this actually breaks if you input an emoji like 👨‍👩‍👧‍👦....
          // but I'm willing to overlook insane security code practices.
          const [first,...rest] = e.target.value
          e.target.value = first ?? '' // first will be undefined when backspace was entered, so set the input to ""
          const lastInputBox = index===inputElements.length-1
          const didInsertContent = first!==undefined
          if(didInsertContent && !lastInputBox) {
            // continue to input the rest of the string
            inputElements[index+1].focus()
            inputElements[index+1].value = rest.join('')
            inputElements[index+1].dispatchEvent(new Event('input'))
          }
        })
      })   
}

async function addCharNew(){
    const inputElements = [...document.querySelectorAll('input.word-letter')]
    
    let chars_used = []
    word_data['present'].forEach(element => {chars_used.push(element)})
    word_data['notpresent'].forEach(element => {chars_used.push(element)})
    word_data['present_wlocation'].forEach(element => {chars_used.push(element[0])})

    inputElements.forEach((element, index) => {
        let char = element.value.toUpperCase()
        index = index + 1
        let type = element.getAttribute('data-type')

        console.log(char, index, type)

        if(char.length < 1){
            alert('cannot add empty')
            return
        }

        if(!chars_used.some(element => element == char)) {  
    
            if(type != 'present_wlocation'){   
                word_data[type].push(char) 
            }         
        }
        if (type == 'present_wlocation')
        {
            if(word_data['notpresent'].some(used => char == used[0])){
                alert('used as not present')
                return 
            }
            if(word_data['present'].includes(char)){
                word_data['present'] = word_data['present'].splice(word_data['present'].indexOf(char), 1)
            }
            word_data[type].push([char, index])
        }
        
    })
}


function changeCharType(element){
    let input = element.parentNode.children[0]
    let attribute_before = element.parentNode.children[0].getAttribute('data-type')

    let attribute;

    switch (attribute_before){
        case 'notpresent':
            attribute = 'present'
            input.style.backgroundColor = "var(--present)"
            break
        case 'present':
            attribute = 'present_wlocation'
            input.style.backgroundColor = "var(--present_wlocation)"
            break
        case 'present_wlocation':
            attribute = 'notpresent'
            input.style.backgroundColor = "var(--notpresent)"
            break;
    }

    input.setAttribute('data-type', attribute)
}

function updateTableNew(){
    let np = document.getElementById('chars-notpresent')
    let p = document.getElementById('chars-present')
    let pwl = document.getElementById('keyword-show')

    np.innerHTML = ''
    p.innerHTML = ''

    word_data['notpresent'].forEach(element => {
        np.innerHTML += `<div class='letter-sub' data-type="notpresent" data-char="${element}" onclick='removeChar(this);'>${element.toUpperCase()}</div>`
    })
    word_data['present'].forEach(element => {
        p.innerHTML += `<div class='letter-sub' data-type="present" data-char="${element}" onclick='removeChar(this);'>${element.toUpperCase()}</div>`
    })
    word_data['present_wlocation'].forEach(element => {
        pwl.children[element[1]-1].innerHTML = element[0].toUpperCase()
        pwl.children[element[1] - 1].style.backgroundColor = 'var(--present_wlocation)'
    })
}
