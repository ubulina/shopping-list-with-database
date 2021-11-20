import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';


export default function App() {

  const [product, setProduct] = useState('')
  const [amount, setAmount] = useState('')
  const [shoppings, setShoppings] = useState([])

  const db = SQLite.openDatabase('shoppingdb.db'); //avataan tietokanta

  useEffect(()=> {
    db .transaction(tx  => {
      tx.executeSql('create table if not exists shopping (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  //save shopping
  const saveShopping = () => {
    db.transaction(tx => {
        tx.executeSql('insert into shopping (product, amount) values (?, ?);', [product, amount]);    
      }, null, updateList
    )

    setProduct('')
    setAmount('')
  }

  //update shoppinglist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shopping;', [], (_, { rows }) =>
        setShoppings(rows._array)
      ); 
    });    
  }

  //delete shopping
  const deleteShopping = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shopping where id = ?;`, [id]);
      }, null, updateList
    )    
  }


  return (
    <View style={styles.container}>
      <TextInput
          placeholder='Product' 
          style={styles.input}
          onChangeText={product => setProduct(product)}
          value={product}          
      />
      <TextInput
          placeholder='Amount' 
          style={styles.input}
          onChangeText={amount => setAmount(amount)}
          value={amount}          
      />
      <View style={styles.buttons}>
        <Button onPress={saveShopping} title="add" />        
      </View>
      <Text style={styles.text}>Shopping list</Text>
      <FlatList
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => 
          <View>
          <Text>{item.product}, {item.amount}
          <Text style={{color: '#0000ff'}} onPress={() => deleteShopping(item.id)}> bought</Text></Text></View>}
        data={shoppings}  
      />
 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  input: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1
      
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20
  }
});
