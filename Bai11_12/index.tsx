import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, StyleSheet, Text, View} from 'react-native';

export interface Props {}

const Bai11_12: React.FC<Props> = () => {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('number', (err, data) => {
      if (err) {
        console.log('Error getting number');
        return;
      }
      if (data) {
        setNumber(+data);
      }
    });
  }, []);

  console.log(`Bai11_12 ${number}`);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bai 11-12</Text>
      <Text style={styles.title}>{number}</Text>
      <Text style={styles.title}>{number % 2 === 0 ? 'Chẵn' : 'Lẻ'}</Text>
      <Button
        title="Increment number"
        onPress={() => {
          const newNumber = number + 1;
          setNumber(newNumber);
          AsyncStorage.setItem('number', `${newNumber}`, err => {
            if (err) {
              console.log(`Error to save number ${newNumber}`);
            }
          });
        }}
      />
      <Button
        title="Remove number"
        onPress={() => {
          AsyncStorage.removeItem('number', err => {
            if (err) {
              console.log('Error to remove number');
            } else {
              setNumber(0);
            }
          });
        }}
      />
      <Button
        title="Clear all"
        onPress={() => {
          AsyncStorage.clear(err => {
            if (err) {
              console.log('Clear all');
            } else {
              setNumber(0);
            }
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#312e38',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#fff',
  },
});

export default Bai11_12;
