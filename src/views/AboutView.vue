<template>
  <div class="about">
    <div class="zabbixAdder">
    <div v-if="visible" class="addhost__modal">
      <div class="input__group">
        <h1>HostName</h1>
        <input v-model="device.hostname" type="text" placeholder="wprowadź nazwę hosta" />
      </div>
      <div class="input__group">
        <h1>Name</h1>
        <input v-model="device.name" type="text" placeholder="wprowadź nazwę" />
      </div>
      <div class="input__group">
        <h1>IP</h1>
        <input v-model="device.ip" type="text" placeholder="wprowadź IP hosta" />
      </div>
      <div class="input__group">
        <h1>Description</h1>
        <textarea  v-model="device.description" name="description" id="" cols="30" rows="10" placeholder="wprowadź opis"></textarea>
      </div>
      <div class="input__group">
        <h1>Company</h1>
        <select v-model="device.company" name="companiesBox" id="companiesBox">
          <option 
            v-for="company in companies" 
            :key="company.id" :value="company.name">
            {{company.name}}
          </option>
        </select>
      </div>
      <div class="device">
        <div 
          v-for="device in devicesTypes" 
          :key="device.id" @click="deviceHandler($event.target)" 
          class="device__box"><h1>{{device.name.split('DevicesTypes/')[1]}}</h1></div>
      </div>
      <div class="line"></div>
      <div class="protocol">
        <div @click="changeProtocol($event.target)" class="snmp protocol__box"><h1>SNMP</h1></div>
      </div>
    </div>
    <div v-if="visible" class="modalBottom">
        <button @click="addhost">Dodaj</button>
        <button @click="clear">Wyczyść</button>
      </div>
    </div>
  </div>
</template>
<script>
import methods from '../api/zabbix.js';
import methodsCreate from '../api/zabbixCreate.js';
export default {
    data() {
        return {
            visible: true,
            companies: [],
            devicesTypes: [],
            groups: [],
            groupsIDs: [],
            tags: [],
            device: {
                type: "",
                hostname: "",
                name: "",
                ip: "",
                company: "",
                templateId: "",
                templateName: "",
                description: "",
                protocols: {
                    snmp: false
                },
            },
        };
    },
    methods: {
        async updateTemplateId() {
            this.templateNameSwitch(this.device.type);
            this.device.templateId = await methods.fetchTemplatesId(this.device.templateName, this.device.company.split("Companies/")[1]);
        },
        async updateGroups() {
            this.groups.push(this.device.type);
            this.groups.push(this.device.company);
            this.tags.push(this.device.type.split("DevicesTypes/")[1]);
            this.tags.push(this.device.company.split("Companies/")[1]);
            this.groupsIDs = await methods.fetchGroupIds(this.groups);
        },
        async addhost() {
            await this.updateTemplateId();
            await this.updateGroups();
            await methodsCreate.createHost(this.device.name, this.device.ip, this.tags, this.groupsIDs, this.device.templateId, this.device.protocols.snmp, this.device.description);
            this.clear();
            console.log(this.device.templateId)
            console.log(this.groupIDs)
        },
        clear() {
            this.device.type = "";
            this.device.hostname = "";
            this.device.name = "";
            this.device.ip = "";
            this.device.company = "";
            this.device.templateId = "";
            this.device.templateName = "";
            this.device.description = "";
            this.device.protocols.snmp = false;
        },
        templateNameSwitch(type) {
            switch (type) {
                case "DevicesTypes/Routery":
                    this.device.templateName = "ICMP Ping - Routery MAIN";
                    break;
                case "DevicesTypes/Serwery":
                    this.device.templateName = "Windows by Zabbix agent";
                    break;
                case "DevicesTypes/Switche":
                    this.device.templateName = "Cisco IOS SNMP";
                    break;
                default:
                    this.device.templateName = "ICMP Ping";
                    break;
            }
        },
        openModal() {
            this.visible = !this.visible;
        },
        changeProtocol(el) {
            if (el.querySelector("h1").innerText === "SNMP") {
                this.device.protocols.snmp = !this.device.protocols.snmp;
            }
            else if (el.querySelector("h1").innerText === "AGENT") {
                this.device.protocols.agent = !this.device.protocols.agent;
            }
            else {
                console.log("cant set protocol!");
            }
            console.log(this.device.protocols);
            el.classList.toggle("active");
        },
        deviceHandler(el) {
            this.device.type = "DevicesTypes/" + el.querySelector("h1").innerText;
            const devices = document.querySelectorAll(".device__box");
            devices.forEach(device => {
                device.classList.remove("active");
            });
            el.classList.toggle("active");
            console.log(this.device);
        },
    },
    async mounted() {
        this.companies = await methods.fetchGroup("Companies");
        this.devicesTypes = await methods.fetchGroup("DevicesTypes");
    },
}
</script>
<style scoped>
h1{
  font-size: 1.5rem;
}
.about{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zabbixAdder{
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  overflow: hidden;
}
.addhost__modal{
  width: auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  height: auto;
  border: 1px grey solid;
  z-index: 2;
  background-color: white;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.25);
}
.device{
  max-width: 300px;
  flex-wrap: wrap;
  justify-content: space-around !important;
}
button{
  width: 30%;
  height: 30px;
  font-size: 1rem;
  font-weight: 400;
  margin: 3.5% 10%;
  text-transform: uppercase;
  background-color: #42b983;
  border: 1px white solid;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: 0.2s all cubic-bezier(0.42, 0, 0.55, 1.61);
}
button:hover{
  scale: 1.07;
  border-radius: unset !important;
  background-color: white;
  color: #42b983;
}
.line{
  width: 80%;
  height: 2px;
  background-color: #42b983;
}
.active{
  background-color: #42b983;
  color: white;
}
.modalBottom{
  width: 100%;
  height: 60px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  background-color: #42b983;
  transform: translateY(-8px);
  border-radius: 0 0 10px 10px;
}
.device,
.protocol{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}
.device__box{
  width: 100px;
  margin: 2px;
  padding: 0.2rem 0.5rem;
  height: 30px;
  border: 1px grey solid;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.5s all;
}
.protocol__box{
  min-width: 70px;
  height: 20px;
  border: 1px grey solid;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.3rem;
  cursor: pointer;
  transition: 0.5s all;
}
.device__box h1,
.protocol__box h1{
  font-size: 0.8rem;
  margin: 0;
  font-weight: 600;
  pointer-events: none;
}
.openModal{
  cursor: pointer;
}

textarea{
  width: 100%;
  max-width: 200px;
  height: 5rem;
  max-height: 300px;
}
select,
input{
  height: 1.5rem;
  width: 100%;
}
.input__group{
  margin: 0.2rem 0;
  max-width: 200px;
}
.input__group h1{
  font-size: 0.9rem;
  text-align: left;
  margin: 0 0.3rem;
  font-weight: 600;
}
</style>