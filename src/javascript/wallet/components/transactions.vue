<template>
  <div>
    <el-table
      :data="arry"
      style="width: 100%">
      <h1 slot="empty">empty</h1>
      <el-table-column
        prop="index"
        label="Index"
        width="80"
        align="center">
      </el-table-column>      
      <el-table-column
        prop="hash"
        label="Hash"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="timestamp"
        label="Timestamp"
        width="220"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="from"
        label="From"
        align="center">
      </el-table-column>
      <el-table-column
        prop="to"
        label="To"
        align="center" >
      </el-table-column>
      <el-table-column
        prop="amount"
        label="Amount"
        align="center">
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        align="center">
      </el-table-column>
      <el-table-column
        prop="gas"
        label="Fee"
        align="center">
      </el-table-column>                                                 
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios'
  import {store} from "../store/store"
  export default {
    slot(){
      empty: "hi"
    },
    data() {
      return {
        arry:[],
        account:'',
      }
    },
    methods:{
      created: function(){
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
                  index: i
                })
                self.setBlock(a,i)
            }
          self.$data.arry = a
          console.log(a)
          })
        .catch(function (error) {
          console.log(error)
        });
      },  
      setBlock: function(block,i) {
        block[i].timestamp = this.toDate(block[i].timestamp)
        block[i].amount = this.amount(block[i].amount)+' ETH'   
        block[i].status = this.getTranscationStatus(block[i].status)
        block[i].gas = this.amount(block[i].gas*block[i].gasprice)+' ETH'
      },
      toDate: function(unix_timestamp){
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
      amount: function(init_value){
        var value = (init_value/1e18)
        return value
      },
      getTranscationStatus: function(txreceipt_status){
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
      getAddress: function(){
        this.account = store.state.web3.eth.accounts[0]
        return this.account
      }
    }         
  }    
</script>

