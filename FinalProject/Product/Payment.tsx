import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export function PaymentScreen({navigation, route}: any) {
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentQuantity, setPaymentQuantity] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    setPaymentData(route.params.paymentList);
    calPayment(route.params.paymentList);

    setName('');
    setPhone('');
    setAddress('');
    AsyncStorage.getItem('userLogin', (err, data) => {
      if (err) {
        console.log('Error getting userLogin from Storage');
        return;
      }
      if (data) {
        const jsonDeValue = JSON.parse(data);
        setName(jsonDeValue.name);
        setPhone(jsonDeValue.phone);
        setAddress(jsonDeValue.address);
      }
    });
  }, []);

  const calPayment = async (data: any) => {
    if (data != undefined) {
      let sumAmount = 0;
      for (let item of data) {
        sumAmount += item.quantity * item.unitPrice;
      }
      setPaymentAmount(sumAmount);
      setPaymentQuantity(data.length);
    }
  };

  const doOrder = () => {
    if (route.params.mode == 'Cart') {
      AsyncStorage.removeItem('cartData');
    }
    Alert.alert('Đặt hàng thành công');
    navigation.navigate('HomeTab');
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <View style={styles.container}>
          <View
            style={{
              marginBottom: 10,
              marginLeft: 20,
              paddingBottom: 10,
              borderBottomColor: 'silver',
              borderBottomWidth: 2,
              width: 320,
            }}>
            <Text>
              {name} ({phone})
            </Text>
            <Text numberOfLines={3}>{address}</Text>
          </View>

          <FlatList
            style={{height: 570}}
            contentInset={{top: 0, bottom: 80, left: 0, right: 0}}
            contentInsetAdjustmentBehavior="automatic"
            data={paymentData}
            renderItem={({item}: ListRenderItemInfo<any>) => (
              <View style={styles.rootItem}>
                <Image
                  style={styles.image}
                  source={{
                    uri:
                      'https://product.minhlong.com/product/' +
                      item.productCode +
                      '/avatar.png',
                  }}
                />

                <View style={styles.rightItem}>
                  <Text style={styles.itemTitleText} numberOfLines={5}>
                    {item.productName}
                  </Text>
                  <Text style={styles.itemCategoryText} numberOfLines={1}>
                    {item.categoryName}
                  </Text>
                  <View style={styles.rootItem}>
                    <Text numberOfLines={1} style={{marginRight: 20}}>
                      {item.unitPrice.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      đ
                    </Text>
                    <Text numberOfLines={1} style={{marginRight: 20}}>
                      SL: {item.quantity}
                    </Text>
                    <Text style={styles.itemPriceText} numberOfLines={1}>
                      {(item.quantity * item.unitPrice).toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 2,
                        },
                      )}
                      đ
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />

          <View
            style={{
              ...styles.rootItem,
              width: '100%',
              alignItems: 'center',
              borderTopColor: 'silver',
              borderTopWidth: 2,
            }}>
            <Text style={{marginLeft: 30, marginRight: 50}}>
              Tổng{' '}
              {paymentQuantity.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{' '}
              mặt hàng
            </Text>
            <Text style={{...styles.sumAmount}}>
              {paymentAmount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
              đ
            </Text>
          </View>
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: '#FF3366',
              width: 340,
            }}
            onPress={() => doOrder()}>
            <Text
              style={{
                color: 'white',
              }}>
              Đặt hàng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffff',
    marginTop: 10,
  },
  sumAmount: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    marginLeft: 30,
    marginRight: 10,
  },

  rootItem: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  itemTitleText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  itemCategoryText: {
    fontSize: 10,
    marginBottom: 5,
  },
  itemPriceText: {
    fontSize: 15,
    color: '#DAA520',
  },
  rightItem: {
    flexDirection: 'column',
    marginHorizontal: 10,
    flex: 1,
  },
  image: {
    width: 80,
    height: 80,
    marginLeft: 10,
    borderRadius: 20,
  },
  button: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
});
