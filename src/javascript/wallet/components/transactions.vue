<template>
  <div>
    <el-search-table-pagination
      type="local"
      :data="tableData"
      :columns="columns"
      :formOptions="formOptions"
      :empty-text="myText">
    </el-search-table-pagination>         
  </div>
</template>

<script>
  import axios from 'axios'
  import {store} from "../store/store"
  export default {
    data() {
      return {
        formOptions: {
          inline: true,
          submitBtnText: 'Search',
          forms: [
            { prop: 'hash', label: 'Hash' },
            { prop: 'from', label: 'From' },
            { prop: 'to', label: 'To' }
          ]
        },
        columns: [
          { prop: 'index', label: 'Index', width: 80 , align: 'center'},
          { prop: 'hash', label: 'Hash', width: 200 , align: 'center'},
          { prop: 'from', label: 'From', width: 200 , align: 'center'},
          { prop: 'to', label: 'TO', width: 200 , align: 'center'},
          { prop: 'timestamp', label: 'Timestamp', width: 220 , align: 'center'},
          { prop: 'amount', label: 'Amount', width: 200 , align: 'center'},
          { prop: 'status', label: 'Status', width: 160 , align: 'center'},
          { prop: 'gas', label: 'Fee', width: 200 , align: 'center'},          
        ],
        Slots: [

        ],
        tableData:[],
        account:'',
        myText: 'Oops! No transactions yet!'
      }
    },
    methods:{
      created(){
        var self = this
        var address = this.getAddress()
        var apiKeyToken = 'MEMJGJQEYX46UTTV7RSGUWAC4R8SCD5486'
        axios.get(`http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKeyToken}`)
        .then(function (response) {
            var block = response
            var a = []
            for(var i=0 ; i < block.data.result.length; i++){    
                a.push({
                  hash: block.data.result[i].hash,
                  timestamp: block.data.result[i].timeStamp,
                  from: block.data.result[i].from,
                  to: block.data.result[i].to,
                  amount: block.data.result[i].value ,
                  status: block.data.result[i].txreceipt_status,
                  gas: block.data.result[i].gasUsed,
                  gasprice: block.data.result[i].gasPrice,
                  index: i+1
                })
                self.setBlock(a,i)
            }
          self.$data.tableData = a
          console.log(a)
          console.log(self.tableData)
          self.getData()
          })
        .catch(function (error) {
          console.log(error)
        });
      },  
      setBlock(block,i) {
        block[i].timestamp = this.toDate(block[i].timestamp)
        block[i].amount = this.amount(block[i].amount)+' ETH'   
        block[i].status = this.getTranscationStatus(block[i].status)
        block[i].gas = this.amount(block[i].gas*block[i].gasprice)+' ETH'
      },
      toDate(unix_timestamp){
        var a = new Date(unix_timestamp * 1000)
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        var year = a.getFullYear()
        var month = months[a.getMonth()]
        var date = a.getDate()
        var hour = a.getHours()
        var min = a.getMinutes()
        var sec = a.getSeconds()
        var time = hour + ':' + min + ':' + sec + ' ' + month + '/' + date+ '/' + year 
        return time
      },
      amount(init_value){
        var value = (init_value/1e18)
        return value
      },
      getTranscationStatus(txreceipt_status){
        var status
        if(txreceipt_status === '1'){
          status = 'confirmed'
        } else if(txreceipt_status === '0'){
          status = 'rejected'
        } else{
          status = 'pending'
        }
        return status
      },
      getAddress(){
        this.account = store.state.web3.eth.accounts[0]
        return this.account
      },
      getData(){
        this.dataTotalCount = this.tableData.length
      }
    }
  }
</script>
<style>
  .el-pagination{
    text-align: left;
  }
</style>
