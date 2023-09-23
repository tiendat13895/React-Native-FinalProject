import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

// import {HomeTab} from '../Main';

export function Bai8() {
  const [numberA, setNumberA] = useState(0);
  const [numberB, setNumberB] = useState(0);
  const [state, setLoadingState] = useState(false);

  const Calculate = async (Type = '') => {
    try {
      await console.log('Bắt đầu tính.');
      setLoadingState(true);
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Keyboard.dismiss();
          resolve(showResult(Type));
        }, 2000);
      });
      setLoadingState(false);
      await console.log('Đã tính xong.');
    } catch (error) {}
  };

  const showResult = (Type = '') => {
    if (!numberA || !numberB) {
      Alert.alert('Chưa nhập số A hoặc B!');
    } else {
      if (Type == 'CONG') {
        Alert.alert('Kết quả là: ' + (numberA + numberB));
      } else if (Type == 'TRU') {
        Alert.alert('Kết quả là: ' + (numberA - numberB));
      } else if (Type == 'NHAN') {
        Alert.alert('Kết quả là: ' + numberA * numberB);
      } else if (Type == 'CHIA') {
        Alert.alert('Kết quả là: ' + numberA / numberB);
      }
    }
  }

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {state && <ActivityIndicator size="large" color="#D97B29" />}
      <View style={styles.container}>
        <Text style={styles.title}> Nhập 2 số A và B: </Text>
        <TextInput
          onChangeText={text => {
            setNumberA(+text);
          }}
          style={styles.input}
          placeholder="Số A"
          placeholderTextColor="grey"></TextInput>

        <TextInput
          onChangeText={text => {
            setNumberB(+text);
          }}
          style={styles.input}
          placeholder="Số B"
          placeholderTextColor="grey"></TextInput>

        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'purple'}}
          onPress={() => Calculate('CONG')}>
          <Text>Cộng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'red'}}
          onPress={() => Calculate('TRU')}>
          <Text>Trừ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'blue'}}
          onPress={() => Calculate('NHAN')}>
          <Text>Nhân</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'green'}}
          onPress={() => Calculate('CHIA')}>
          <Text>Chia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  title: {
    color: 'green',
    fontSize: 40,
    fontWeight: 'bold',
  },
  button: {
    width: '90%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 8,
    margin: 10,
    width: '90%',
  },
  error: {
    color: 'red',
    fontSize: 10,
    marginBottom: 5,
    textAlign: 'left',
  },
});
