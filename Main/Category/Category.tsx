import {Button, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';

export function CategoryScreen({navigation, route}: any) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{route.params.text}</Text>
      <Button
        title="Go back Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}
