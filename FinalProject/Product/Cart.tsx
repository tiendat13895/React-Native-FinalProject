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
        calPayment(JSON.parse(data));
      }
    });
  };

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

  const doDeleteCartItem = async (removeItem: any) => {
    const cartRemoved = cartData?.filter(
      (item, index) => item.id !== removeItem.id,
    );
    setCartData(cartRemoved);
    calPayment(cartRemoved);
    await AsyncStorage.setItem('cartData', JSON.stringify(cartRemoved));
  };

  const doMinusCartItem = async (minusItem: any) => {
    if (minusItem.quantity > 1) {
      const cartMinus = cartData;
      for (let item of cartMinus) {
        if (item.id == minusItem.id) {
          item.quantity -= 1;
        }
      }
      setCartData(cartMinus);
      calPayment(cartMinus);
      await AsyncStorage.setItem('cartData', JSON.stringify(cartMinus));
    }
  };

  const doPlusCartItem = async (plusItem: any) => {
    const cartPlus = cartData;
    for (let item of cartPlus) {
      if (item.id == plusItem.id) {
        item.quantity += 1;
      }
    }
    setCartData(cartPlus);
    calPayment(cartPlus);
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
            style={{height: 670}}
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
                        <Text numberOfLines={1}>{item.quantity}</Text>
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

          <View
            style={{...styles.rootItem, width: '100%', alignItems: 'center'}}>
            <Text style={{...styles.sumAmount}}>
              {paymentAmount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
              đ
            </Text>
            <TouchableOpacity
              style={{...styles.button, backgroundColor: '#FF3366', width: 150}}
              onPress={() =>
                navigation.navigate('Payment', {
                  paymentList: cartData,
                  mode: 'Cart',
                })
              }>
              <Text
                style={{
                  color: 'white',
                }}>
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
  sumAmount: {
    fontWeight: 'bold',
    fontSize: 25,
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
