const domainsContainer = document.getElementById('domains-container')
const submit = document.getElementById('submit')
const checker = document.getElementsByClassName('checker')
const type1Checker = document.getElementById('type1')
const type2Checker = document.getElementById('type2')
const type3Checker = document.getElementById('type3')

const domainInputs = document.getElementsByClassName('domain-input')

const removeDuplictes = (array) => {
    return [... new Set(array)]
}
const removeDuplicateObjects=(objArray)=> {
    {
        let uniqueArray = objArray.filter((obj, index, self) => 
            index === self.findIndex((t) => (
                t.baseUrl === obj.baseUrl && t.landingUrl === obj.landingUrl // Add more conditions if necessary
            ))
        );
        return uniqueArray;
    }
    
}

const setToStorage = async (key, data) => {
    let obj = {}
    obj[key] = data
    await chrome.storage.local.set(obj)
}

const getFromStorage = async (key) => {
    let sres = await chrome.storage.local.get(key)
    return sres[key]
}

const main = async () => {
    let prototype = await getFromStorage('prototype')
    console.log(prototype);
    let ExistingList = document.querySelector('.domain-list')
    if (ExistingList) ExistingList.remove()
    let ExistingTable=document.querySelector('.domain-table')
    if (ExistingTable) ExistingTable.remove()
    switch (prototype) {
        case 1:
            type1Checker.checked = true
            domainInputs[0].disabled = true
            domainInputs[1].disabled = true
            break;
        case 2:
            type2Checker.checked = true
            domainInputs[0].disabled = false
            domainInputs[1].disabled = true

            let domainArr = await getFromStorage('domainArr')
            let domainList = document.createElement('ul')
            domainList.setAttribute('class', 'domain-list')
            domainArr.forEach(e => {
                let li = document.createElement('li')
                li.innerText = e
                domainList.appendChild(li)
            })
            domainsContainer.appendChild(domainList)
            break;
        case 3:
            type3Checker.checked = true
            domainInputs[0].disabled = false
            domainInputs[1].disabled = false
            let domainsTable=document.createElement('table')
            domainsTable.setAttribute('class','domain-table')
            let domainObjArr=await getFromStorage('domainObjArr')
            console.log((domainObjArr));
            domainObjArr.forEach(e=>{
                let tr=document.createElement('tr')
                let td1=document.createElement('td')
                let td2=document.createElement('td')
                td1.innerText=e.baseUrl
                td2.innerText=e.landingUrl
                tr.appendChild(td1)
                tr.appendChild(td2)
                domainsTable.appendChild(tr)
            })
            domainsContainer.appendChild(domainsTable)
    }
}
main()
const handleType1Checker = async () => {
    console.log('prototype1');
    await setToStorage('prototype', 1)
    main()
}
const handleType2Checker = async () => {
    console.log('prototype2');
    await setToStorage('prototype', 2)
    main()

}
const handleType3Checker = async () => {
    console.log('prototype3');
    await setToStorage('prototype', 3)
    main()
}

type1Checker.addEventListener('click', handleType1Checker)
type2Checker.addEventListener('click', handleType2Checker)
type3Checker.addEventListener('click', handleType3Checker)


const handleSubmit = async () => {
    console.log("submit");
    let prototype = await getFromStorage('prototype')
    switch (prototype) {
        case 1:
            main()
            break;
        case 2:
            let domainArr = await getFromStorage('domainArr')
            domainInputs[0].value ? domainArr.push(domainInputs[0].value) : console.log('hello')
            let shortedArray = removeDuplictes(domainArr)
            await setToStorage('domainArr', shortedArray)
            main()
            break;
        case 3:
            let obj=new Object()
            domainInputs[0].value ? obj.baseUrl= domainInputs[0].value: console.log('base')
            domainInputs[1].value ? obj.landingUrl= domainInputs[1].value : console.log('landing')
            if(obj.baseUrl && obj.landingUrl){
                let domainObjArr=await getFromStorage('domainObjArr')
                domainObjArr.push(obj)
                console.log(domainObjArr,"domainObjArr");
                let shortedObjArr=removeDuplicateObjects(domainObjArr)
                console.log(shortedObjArr,"shortedObjArr");
                await setToStorage('domainObjArr',shortedObjArr)
                main()
            }
            break;
    }
}
submit.addEventListener('click', handleSubmit)


