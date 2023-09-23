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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';

export function CartScreen({navigation}: any) {
  const [cartData, setCartData] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentQuantity, setPaymentQuantity] = useState(0);

  useEffect(() => {
    getCartFromAsyncStorage();
  }, []);

  const getCartFromAsyncStorage = async () => {
    await AsyncStorage.getItem('cartData', (err, data) => {
      if (err) {
        console.log('Error getting userLogin from Storage');
        return;
      }
      if (data) {
        setCartData(JSON.parse(data));
        calPayment();
      }
    });
  };

  const calPayment = () => {
    if (cartData != undefined) {
      let sumAmount = 0;
      for (let item of cartData) {
        sumAmount += item.quantity * item.unitPrice;
      }
      setPaymentAmount(sumAmount);
      setPaymentQuantity(cartData.length);
    }
  };

  const doDeleteCartItem = async (removeItem: any) => {
    const cartRemoved = cartData?.filter(
      (item, index) => item.id !== removeItem.id,
    );
    setCartData(cartRemoved);
    calPayment();
    await AsyncStorage.setItem('cartData', JSON.stringify(cartRemoved));
  };

  const doMinusCartItem = async (minusItem: any) => {
    if (minusItem.quantity > 1) {
      const cartMinus = cartData?.filter(
        (item, index) => item.id !== minusItem.id,
      );
      minusItem.quantity -= 1;
      cartMinus.push(minusItem);

      setCartData(cartMinus);
      calPayment();
      await AsyncStorage.setItem('cartData', JSON.stringify(cartMinus));
    }
  };

  const doPlusCartItem = async (plusItem: any) => {
    const cartPlus = cartData?.filter((item, index) => item.id !== plusItem.id);
    plusItem.quantity += 1;
    cartPlus.push(plusItem);

    setCartData(cartPlus);
    calPayment();
    await AsyncStorage.setItem('cartData', JSON.stringify(cartPlus));
  };

  const refresh = React.useCallback(() => {
    setRefreshing(true);
    getCartFromAsyncStorage();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <View style={styles.container}>
          <FlatList
            style={{marginBottom: 225}}
            contentInset={{top: 0, bottom: 80, left: 0, right: 0}}
            contentInsetAdjustmentBehavior="automatic"
            data={cartData}
            renderItem={({item}: ListRenderItemInfo<any>) => (
              <View style={styles.rootItem}>
                {/* <View style={styles.checkboxContainer}>
                  <CheckBox
                    disabled={false}
                    value={item.isChoose}
                    onValueChange={newValue => setToggleCheckBox(newValue)}
                    style={styles.checkbox}
                  />
                </View> */}
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
                    <View>
                      <View style={styles.rootItem}>
                        <Text numberOfLines={1}>
                          {item.unitPrice.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                          đ
                        </Text>
                        <TouchableOpacity
                          style={{
                            ...styles.button,
                            backgroundColor: '#DCDCDC',
                            width: 30,
                            height: 20,
                            borderRadius: 0,
                          }}
                          onPress={() => doMinusCartItem(item)}>
                          <Text>-</Text>
                        </TouchableOpacity>
                        <Text style={{}} numberOfLines={1}>
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          style={{
                            ...styles.button,
                            backgroundColor: '#DCDCDC',
                            width: 30,
                            height: 20,
                            borderRadius: 0,
                          }}
                          onPress={() => doPlusCartItem(item)}>
                          <Text>+</Text>
                        </TouchableOpacity>
                      </View>
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
                    <TouchableOpacity
                      style={{
                        ...styles.button,
                        backgroundColor: '#DCDCDC',
                        width: 50,
                        marginLeft: 20,
                      }}
                      onPress={() => doDeleteCartItem(item)}>
                      <Image
                        source={{
                          uri: 'https://icon-library.com/images/delete-icon-png/delete-icon-png-1.jpg',
                        }}
                        style={{width: 25, height: 25}}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            onEndReachedThreshold={0.8}
            onRefresh={() => refresh()}
            refreshing={refreshing}
          />

          <View style={{...styles.rootItem, width: '100%'}}>
            <Text style={{...styles.title, marginRight: 70}}>
              {paymentAmount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </Text>
            <TouchableOpacity
              style={{...styles.button, backgroundColor: '#B22222', width: 150}}
              onPress={() => navigation.navigate('Home')}>
              <Text>
                Thanh toán (
                {paymentQuantity.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
                )
              </Text>
            </TouchableOpacity>
          </View>
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
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#4169E1',
    textAlign: 'center',
    margin: 10,
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
