import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text,TextInput, View ,ScrollView} from 'react-native';


interface Table{
        tablehead: string[]
        tabledata: string[][]
        headcolor: string
        tablecolor: string
}

const defaulttable:Table = { 
        tablehead:["none","none","none"],
        tabledata:[["lol","lol","lol"],
                   ["grow","lol","lol"],
                   ["lol","lol","lol"]],
        headcolor:"White",
        tablecolor:"white",
}
function addDec(str:string):string{
        if(str.length <= 2) return '.' + str
        return str.substring(0,str.length-2)+'.'+str.substring(str.length-2)
}

function CreateTable(table:Table):JSX.Element{
        function CreateRow(row:string[],Backcolor:string):JSX.Element{
                var n = [];
                        for(var x:number = 0; x<row.length;x++){
                                n.push(<View style={{flex:1}}><Text style={{fontSize:24,flexGrow:1,flexShrink:1,padding:10,borderColor:'black',borderWidth:2}}>{row[x]}</Text></View>)
                        }
                return <View style={{backgroundColor:Backcolor,flexDirection:"row",flex:1,justifyContent:'space-evenly'}}>{n}</View>
}
        var n = []
        n.push(CreateRow(table.tablehead,table.headcolor));
        for(var x:number = 0; x<table.tabledata.length;x++){
                n.push(CreateRow(table.tabledata[x],table.tablecolor));
        }
        return <ScrollView style={{borderWidth:2,flex:.75}}>{n}</ScrollView>

}
function getColumnByHead(table:Table,headvalue:string):string[]{
        var columnIndex:number = table.tablehead.indexOf(headvalue);
        return table.tabledata.map(x=>x[columnIndex])
}

function listdiff(listA:string[],auditlist:string[]):string[]{
        return auditlist.filter((x,i)=>!(hasN(x,auditlist.slice(0,i+1))<=hasN(x,listA)));
}

function unmatchedValues(tableA:Table,auditValues:string[],columnchoice:string):string[]{
        return listdiff(getColumnByHead(tableA,columnchoice),auditValues);
}

function hasN(value:string,listA:string[]):number{
        return listA.filter(x=>x==value).length
}

function tableAudit(tableA:Table,auditValues:string[],columnchoice:string):Table{
        var columnIndex:number = tableA.tablehead.indexOf(columnchoice);
        var problemIndices:number[] = tableA.tabledata
                .map(x=> x[columnIndex])
                .map((x,i,zx)=> hasN(x,zx)==hasN(x,auditValues) ? -1 : i);
        console.log(problemIndices)
        var newtable:Table = tableA;
        newtable.tabledata = tableA.tabledata.filter((_,i)=> i == problemIndices[i]);
        return newtable;
}

export default function App() {
          const [filterv,setfilterv] = useState("Extended Cost");
          const [text,setText] = useState("");
          const [textI,setTextI] = useState("");
          const [diffs,setdiffs] = useState(["diffs"])
          const [tablehead,setTablehead] = useState(["none","none","none"]);
          const [tabledata,setTabledata] = useState([["lol","lol","lol"],
                                                   ["lol","lol","lol"],
                                                   ["lol","lol","lol"]]);
        console.log(filterv)
        console.log(addDec('ei'))
        function updateTable():void{
                var rows:string[] = textI
                        .split(/\r?\n/)
                        .filter((_,i)=> (i == 0)||(i%2 != 0));
                var headrow:string[]= rows[0]
                        .split(/\t */);
                var tailrows:string[][] = rows
                        .slice(1)
                        .map(r=>r.split(/\t */));
                var actualltable:Table = defaulttable;
                actualltable.tablehead=headrow
                actualltable.tabledata=tailrows
                setdiffs(unmatchedValues(actualltable,text.split(/\r?\n/).map(addDec),filterv))
                actualltable=tableAudit(actualltable,text.split(/\r?\n/).map(addDec),filterv)
                console.log(text)
                
                setTablehead(actualltable.tablehead);
                setTabledata(actualltable.tabledata);
        }

  return (
    <View style={styles.container}>
            <Text style={{color:'black',fontSize:70,padding:20,textShadowColor:'#673394',textShadowRadius:7,shadowRadius:20}}>{"RPM Toolkit"}</Text>
            <Text style={styles.vvvtext}>{diffs.join(' ')}</Text>
      <View style={styles.inboxes}>
        <TextInput
          style={{flex:.45,backgroundColor:'#287274', borderColor:'black',borderWidth:5,color:'white',fontSize:50}}
          onChangeText={text => setTextI(text)}
          defaultValue={text}
          numberOfLines={4}
          multiline={true}
        />
        <TextInput
          style={{flex:.45,backgroundColor:'#287274', borderColor:'black',borderWidth:5,color:'white',fontSize:50}}
          onChangeText={text =>{setText(text);updateTable()}}
          defaultValue={text}
          numberOfLines={4}
          multiline={true}
        />
      </View> 
      <View style={{justifyContent:"space-evenly",flexDirection:"row"}}>
                    <TextInput
        style={{flex:.45,backgroundColor:'#287274', borderColor:'black',borderWidth:5,color:'white',fontSize:50}}
        onChangeText={text => {setfilterv(text);updateTable()}}
        placeholder="Extended Cost"
      />

      </View>
      <View style={styles.inboxes}>
              
              <CreateTable 
                      tablehead={tablehead} 
                      tabledata={tabledata} 
                      tablecolor={"#ACE1E3"} 
                      headcolor={"#789d9e"}/>

      </View> 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#49BDC1',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    fontSize: 40,
    color: 'blue',
  },
  inboxes:{
          flex:1,
          flexDirection: 'row',
          alignContent: 'space-around',
          alignItems: 'stretch',
          justifyContent: 'space-around',
          padding:20,
          
  },
  vvvtext:{
    fontSize: 40,
    color: '#c14d49',
    fontFamily:'Roboto',
          alignSelf:'center',
  },
  rw:{
    height:40,
    backgroundColor: 'yellow',
  },
  HeadStyle: { 
    height: 50,
    alignContent: "center",
    backgroundColor: '#ffe0f0'
  },
  TableText: { 
    margin: 10
  },
});
