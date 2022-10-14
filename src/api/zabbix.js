const methods = {
  async fetchGroup(type){
    var axios = require('axios').default;
    var data = JSON.stringify({
      "jsonrpc": "2.0",
      "method": "hostgroup.get",
      "params": {
        "output": "extend",
        "search": {
          "name": [
            `${type}/*`
          ]
        },
        "searchWildcardsEnabled": true
      },
      "auth": "9070aae6ed7f6f41f91552afbe8b68f7",
      "id": 0
    });

    var config = {
      method: 'post',
      url: 'http://192.168.168.12/api_jsonrpc.php',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    const companies = [];
    await axios(config)
    .then(function (response) {
      const data = response.data.result;
      data.forEach(company => {
        companies.push({
          id: company.groupid,
          name: company.name,
        })
      });
    })
    .catch(function (error) {
      console.log(error);
    });
    return companies;
  },
  async fetchTemplatesId(templateType, company){
    console.log(templateType + ' - ' + company)
    var axios = require('axios').default;
    var data = JSON.stringify({
      "jsonrpc": "2.0",
      "method": "template.get",
      "params": {
          "output": "extend",
          "filter": {
              "name": [
                  `${templateType === 'ICMP Ping - Routery MAIN' ? templateType : templateType + ' - ' + company}`
              ]
          }
      },
      "auth": "9070aae6ed7f6f41f91552afbe8b68f7",
      "id": 1
  });

    var config = {
      method: 'post',
      url: 'http://192.168.168.12/api_jsonrpc.php',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    let templateID = '';
    await axios(config)
    .then(function (response) {
      const data = response.data.result;
      templateID = data[0].templateid;
    })
    .catch(function (error) {
      console.log('Dana firma nie posiada tej Templatki!\n' + error );
      templateID = 'Dana firma nie posiada tej Templatki!'
    });
    return templateID;
  },
  async fetchGroupIds(groupNames){
    var axios = require('axios').default;
    var data = JSON.stringify({
      "jsonrpc": "2.0",
      "method": "hostgroup.get",
      "params": {
          "output": "extend",
          "filter": {
              "name": [
                  `${groupNames[0]}`,
                  `${groupNames[1]}`
              ]
          }
      },
      "auth": "9070aae6ed7f6f41f91552afbe8b68f7",
      "id": 1
  });
  let groupIDs = [];
    var config = {
      method: 'post',
      url: 'http://192.168.168.12/api_jsonrpc.php',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    await axios(config)
    .then(function (response) {
      const data = response.data.result;
      groupIDs.push(parseInt(data[0].groupid));
      groupIDs.push(parseInt(data[1].groupid));
    })
    .catch(function (error) {
      console.log('Dana firma nie posiada tej Grupy!\n' + error );
      groupIDs = 'Dana firma nie posiada tej Grupy!'
    });
    return groupIDs;
  }
}

export default methods;