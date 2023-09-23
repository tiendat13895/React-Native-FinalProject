import React, {useState} from 'react';

import {useAppSelector, useAppDispatch} from '../../Store/Index';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
  decrementByAmount,
} from './CounterSlice';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';

export default function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <View style={styles.container}>
      <Button title="Decrement value" onPress={() => dispatch(decrement())} />
      <Text>${count}</Text>
      <Button title="Increment value" onPress={() => dispatch(increment())} />
      <TextInput
        style={styles.textInput}
        placeholder="Set increment amount"
        placeholderTextColor="grey"
        onChangeText={setIncrementAmount}
        value={incrementAmount}
      />
      <Button
        title="Set increment amount"
        onPress={() => dispatch(incrementByAmount(incrementValue))}
      />
      <Button
        title="Set decrement amount"
        onPress={() => dispatch(decrementByAmount(incrementValue))}
      />
      <Button
        title="Set increment amount async"
        onPress={() => dispatch(incrementAsync(incrementValue))}
      />
      <Button
        title="Add If Odd"
        onPress={() => dispatch(incrementIfOdd(incrementValue))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000',
  },

  textInput: {
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    height: 40,
    paddingHorizontal: 8,
    marginVertical: 5,
    width: '90%',
  },
});
