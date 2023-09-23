import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function HomeScreen({navigation}: any) {


  const [name, setName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('userLogin', (err, data) => {
      if (err) {
        console.log('Error getting userLogin from Storage');
        return;
      }
      if (data) {
        const jsonDeValue = JSON.parse(data);
        var hour = new Date().getHours();
        if (hour >= 0 && hour < 10) {
          setName('Chào buổi sáng! ' + jsonDeValue.name);
        } else if (hour >= 10 && hour < 14) {
          setName('Chào buổi trưa! ' + jsonDeValue.name);
        } else if (hour >= 14 && hour < 18) {
          setName('Chào buổi chiều! ' + jsonDeValue.name);
        } else if (hour >= 18 && hour < 24) {
          setName('Chào buổi tối! ' + jsonDeValue.name);
        }
      }
    });
  }, []);

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: 20,
        }}>
        <View
          style={{
            width: '100%',
            backgroundColor: 'brown',
            marginBottom: 20,
          }}>
          <Text style={styles.title}>{name}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '90%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginVertical: 10,
  },
  title: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 15,
    textAlign: 'left',
  },
  slider: {
    height: 45,
    width: '80%',
  },
});
