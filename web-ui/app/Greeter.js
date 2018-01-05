//Greeter,js
import React, {Component} from 'react';
import config from './config.json';
import styles from './Greeter.css';
import HTTPUtil from './js/actions/fetch/FetchUtils.js'


//添加或者修改json数据
function setJson(jsonStr,name,value) {
  if(!jsonStr)jsonStr="{}";
      var jsonObj = JSON.parse(jsonStr);
  jsonObj[name] = value;
      return JSON.stringify(jsonObj);
}

class Greeter extends Component{

  componentDidMount() {
      let urls = [
        "http://localhost:8900/upgrade/getTopicByName/pt_asc_all"
      ];

      let tableInfoAll;

      HTTPUtil.URLs(urls).then((text) => {
        if(text.size != 0 ){
          let tableInfo = JSON.parse(text[0]);
          console.log(tableInfo.id);
          console.log(tableInfo.table_name);
          console.log(tableInfo.table_type);
          console.log(tableInfo.table_status);
          tableInfoAll = setJson(null,"table_status","running");
          tableInfoAll = setJson(tableInfoAll,"id",tableInfo.id);
          tableInfoAll = setJson(tableInfoAll,"table_name",tableInfo.table_name);
          tableInfoAll = setJson(tableInfoAll,"upgrade_time","2018-01-04 18:31:29");
          tableInfoAll = setJson(tableInfoAll,"finish_time","2018-01-04 19:31:29");
          console.log("tableInfoAll " + tableInfoAll);

          HTTPUtil.post("http://localhost:8900/upgrade/update/sequenceToOrcInfo",tableInfoAll)
        }else{
            console.log("fetch exception " + text.code);
        }
      },(text)=>{
          console.log("fetch fail " + text.code);
      })
  }

  render() {
    return (
      <div className={styles.root}>
        {config.greetText}
      </div>
    );
  }
}

export default Greeter