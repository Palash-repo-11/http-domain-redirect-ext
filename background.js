// chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
//   const msg = `Navigation to ${e.request.url} redirected on tab ${e.request.tabId}.`;
//   console.log(msg);
// });

// console.log('Service worker started.');

const setToStorage = async (key, data) => {
  let obj = {}
  obj[key] = data
  await chrome.storage.local.set(obj)
}

const getFromStorage = async (key) => {
  let sres = await chrome.storage.local.get(key)
  return sres[key]
}


// let httpDomain = "http://*/*";

// chrome.declarativeNetRequest.updateDynamicRules({
//   addRules: [
//     {
//       id: 9931,
//       priority: 99999,
//       action: {
//         "type": "redirect",
//         "redirect": {
//           "transform": {
//             "scheme": "https"
//           }
//         }
//       },
//       condition: {
//         urlFilter: httpDomain,
//         resourceTypes: [
//           "main_frame"
//         ]
//       }
//     }
//   ],
//   removeRuleIds: [9931],
// });

const removeAllRules = async () => {
  chrome.declarativeNetRequest.getDynamicRules((e) => {
    e.forEach(i => {
      let ids = i.id
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [ids]
      })
    })
  })
}
chrome.runtime.onInstalled.addListener(async () => {
  await setToStorage('prototype', 3)
  let a = await getFromStorage('prototype')
  console.log(a)
  await setToStorage('domainArr', [])
  let c = await getFromStorage('domainArr')
  console.log(c);
  await setToStorage('domainObjArr', [])
  let d = await getFromStorage('domainObjArr')
  console.log(d);
})

const x = async (obj) => {
  await removeAllRules()
  let httpDomain = "http://*/*";
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: 3,
        priority: 3,
        action: {
          "type": "redirect",
          "redirect": {
            "transform": {
              "scheme": "https"
            }
          }
        },
        condition: {
          urlFilter: httpDomain,
          resourceTypes: [
            "main_frame"
          ]
        }
      }
    ],
    removeRuleIds: [3],
  });
}

removeAllRules()
const handlePrototype2 = async (domainArr) => {
  await removeAllRules()
  console.log('handlePrototype2')
  id = 5677
  priority = 5993
  let rule = []
  let idArray = []
  for (let i = 0; i < domainArr.length; i++) {
    let domain = domainArr[i]
    let modifiedUrl =`https://${domain}`
      rule.push({
        id: id,
        priority: priority,
        action: {
          "type": "redirect",
          "redirect": {
            "url":modifiedUrl
          }
        },
        condition: {
          urlFilter: domain,
          resourceTypes: [
            "main_frame"
          ]
        }
      })
    idArray.push(id)
    id++
    priority++
  }
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rule,
    removeRuleIds: idArray,
  });
}

const handlePrototype3 = async (domainObjArr) => {
  await removeAllRules()
  console.log('handlePrototype3')
  id = 8765
  priority = 7654
  let rule = []
  let idArray = []
  for (let i = 0; i < domainObjArr.length; i++) {
    const e = domainObjArr[i];
    rule.push({
      "id": id,
      "priority": priority,
      "action": {
        "type": "redirect",
        "redirect": {
          "url": e.landingUrl
        }
      },
      "condition": {
        "urlFilter": e.baseUrl,
        "resourceTypes": [
          "main_frame"
        ]
      }
    })
    idArray.push(8765)
    id++
    priority++
  }
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rule,
    removeRuleIds: idArray,
  });
}
const main = async () => {
  let prototype = await getFromStorage('prototype')
  let domainArr = await getFromStorage('domainArr')
  let domainObjArr = await getFromStorage('domainObjArr')
  switch (prototype) {
    case 1:
      handlePrototype1({})
      break;
    case 2:
      handlePrototype2(domainArr)
      handlePrototype3(domainObjArr)
      break;
    case 3:
      handlePrototype2(domainArr)
      handlePrototype3(domainObjArr)
      break;
  }
}



chrome.tabs.onUpdated.addListener((tabId, changeinfo, tab) => {
  main()
})
chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
  main()
})