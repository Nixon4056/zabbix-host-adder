const methods = {
    async createHost(name, ip, tags, groups, template, snmp, description){
        var axios = require('axios').default;
        var data = snmp ? JSON.stringify({
        "jsonrpc": "2.0",
        "method": "host.create",
        "params": {
            "host": `${name}`,
            "description": `${description}`,
            "interfaces": [
                {
                "type": 1,
                "main": 1,
                "useip": 1,
                "ip": `${ip}`,
                "dns": `${name}`,
                "port": "10050"
            },
            {
                "type": 2,
                "main": 1,
                "useip": 1,
                "ip": `${ip}`,
                "dns": `${name}`,
                "port": "161",
                "details": {
                    "version": 3,
                    "bulk": 1,
                    "securityname": "public",
                    "contextname": "",
                    "securitylevel": 1
                }
            }
            ],
            "groups": [
            {
                "groupid": `${groups[0]}`
            },
            {
                "groupid": `${groups[1]}`
            },
            ],
            "tags": [
            {
                "tag": "Company",
                "value": `${tags[1]}`
            },
            {
                "tag": "Device",
                "value": `${tags[0]}`
            },
            ],
            "templates": [
            {
                "templateid": `${template}`
            }
            ]
        },
        "auth": "9070aae6ed7f6f41f91552afbe8b68f7",
        "id": 1
        }) : JSON.stringify({
            "jsonrpc": "2.0",
            "method": "host.create",
            "params": {
                "description": `${description}`,
                "host": `${name}`,
                "interfaces": [
                    {
                    "type": 1,
                    "main": 1,
                    "useip": 1,
                    "ip": `${ip}`,
                    "dns": `${name}`,
                    "port": "10050"
                }
                ],
                "groups": [
                {
                    "groupid": `${groups[0]}`
                },
                {
                    "groupid": `${groups[1]}`
                },
                ],
                "tags": [
                {
                    "tag": "Company",
                    "value": `${tags}`
                }
                ],
                "templates": [
                {
                    "templateid": `${template}`
                }
                ]
            },
            "auth": "9070aae6ed7f6f41f91552afbe8b68f7",
            "id": 1
            })
        

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
        console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
        console.log(error);
        });
    }
}

export default methods ;