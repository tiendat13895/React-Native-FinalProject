import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

export function AboutScreen({navigation}: any) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Yolo system version 1.0</Text>
    </View>
  );
}
