import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Carousel from 'react-native-snap-carousel';
// import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from './CarouselCardItem';
import data from './data';
import {Result, RootObject} from '../Product/model';
import axios from 'axios';

export function HomeScreen({navigation}: any) {
  const [name, setName] = useState('');
  // const isCarousel = React.useRef(null);
  const [productData, setProductData] = useState<RootObject | undefined>();

  const images = [
    'https://images2.thanhnien.vn/Uploaded/anhdh/2022_03_08/anh-nhan-vat-cung-cap-8199.jpg',
    'https://images2.thanhnien.vn/zoom/328_205/Uploaded/dieutrangqc/2022_12_10/4-2221.png',
    'https://images2.thanhnien.vn/zoom/736_460/528068263637045248/2023/8/19/cap-binh-bong-gom-binh-duong-tu-thoi-ma-chong-toi-de-lai-16924516013891022970621-0-0-1250-2000-crop-16924516183231425573353.jpg',
  ];

  useEffect(() => {
    getProductFromApi().then(response => setProductData(response));

    AsyncStorage.getItem('userLogin', (err, data) => {
      if (err) {
        console.log('Error getting userLogin from Storage');
        return;
      }
      if (data) {
        const jsonDeValue = JSON.parse(data);
        var hour = new Date().getHours();
        if (hour >= 0 && hour < 10) {
          setName('Chào buổi sáng, ' + jsonDeValue.name);
        } else if (hour >= 10 && hour < 14) {
          setName('Chào buổi trưa, ' + jsonDeValue.name);
        } else if (hour >= 14 && hour < 18) {
          setName('Chào buổi chiều! ' + jsonDeValue.name);
        } else if (hour >= 18 && hour < 24) {
          setName('Chào buổi tối, ' + jsonDeValue.name);
        }
      }
    });
  }, []);

  const getProductFromApi = () => {
    return axios
      .get(
        `https://650468e7c8869921ae24ff64.mockapi.io/api/product?completed=false&page=1&limit=10&orderBy=unitPrice&order=desc`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      .then(res => {
        if (res.data) {
          let Result = {
            page: 1,
            results: res.data,
            total_pages: 10,
            total_results: 100,
          };
          return Result;
        }
        return undefined;
      })
      .catch(err => {
        console.log(err);
        return undefined;
      });
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <View style={{paddingTop: 10}}>
        <View
          style={{
            width: '100%',
            backgroundColor: '#6495ED',
            marginBottom: 10,
          }}>
          <Text style={styles.title}>{name}</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          {/* <Carousel
            layout="tinder"
            layoutCardOffset={9}
            ref={isCarousel}
            data={data}
            renderItem={CarouselCardItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            useScrollView={true}
          /> */}

          <FlatList
            contentInset={{top: 0, bottom: 0, left: 0, right: 0}}
            contentInsetAdjustmentBehavior="automatic"
            data={data}
            horizontal
            pagingEnabled
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false}
            renderItem={({item}: ListRenderItemInfo<any>) => (
              <View style={styles.bannerContainer}>
                <Image style={styles.bannerimage} source={{uri: item.imgUrl}} />
                <Text style={styles.header} numberOfLines={3}>
                  {item.title}
                </Text>
                <Text style={styles.body} numberOfLines={10}>
                  {item.body}
                </Text>
              </View>
            )}
            keyExtractor={(item: any, index: number) => `${item.id}-${index}`}
          />
        </View>

        <Text
          style={{
            borderTopColor: 'black',
            borderTopWidth: 2,
            width: 330,
            margin: 10,
            paddingTop: 10,
            fontSize: 18,
            color: '#6495ED',
            fontWeight: 'bold',
          }}>
          Sản phẩm nổi bật
        </Text>

        <View style={{marginBottom: 20}}>
          {productData === undefined ? (
            <Text>Loading ...</Text>
          ) : (
            <FlatList
              style={{marginBottom: 225}}
              contentInset={{top: 0, bottom: 80, left: 0, right: 0}}
              contentInsetAdjustmentBehavior="automatic"
              data={productData?.results}
              horizontal
              pagingEnabled
              snapToAlignment="center"
              showsHorizontalScrollIndicator={false}
              renderItem={({item}: ListRenderItemInfo<Result>) => (
                <Pressable
                  style={styles.rootItem}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      id: item.id,
                      productCode: item.productCode,
                      productName: item.productName,
                      patternName: item.patternName,
                      rangeName: item.rangeName,
                      unitName: item.unitName,
                      length: item.length,
                      width: item.width,
                      height: item.height,
                      weight: item.weight,
                      capacity: item.capacity,
                      unitPrice: item.unitPrice,
                      categoryName: item.categoryName,
                    })
                  }>
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
                    <Text style={styles.itemPriceText} numberOfLines={1}>
                      {item.unitPrice.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      đ
                    </Text>
                  </View>
                </Pressable>
              )}
              keyExtractor={(item: Result, index: number) =>
                `${item.id}-${index}`
              }
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 15,
    textAlign: 'left',
  },
  rootItem: {
    flexDirection: 'row',
    marginVertical: 5,
    width: 350,
  },
  itemTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  itemCategoryText: {
    fontSize: 12,
    marginBottom: 5,
  },
  itemPriceText: {
    fontSize: 16,
    color: '#DAA520',
  },
  rightItem: {
    marginHorizontal: 10,
    width: 200,
  },
  image: {
    width: 120,
    height: 120,
    marginLeft: 10,
    borderRadius: 20,
  },
  bannerimage: {
    width: 250,
    height: 200,
    borderRadius: 20,
  },
  header: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 10,
    width: 300,
    textAlign: 'center',
  },
  body: {
    color: '#222',
    fontSize: 13,
    width: 330,
    paddingLeft: 10,
  },
  bannerContainer: {
    width: 350,
    height: 380,
    alignItems: 'center',
  },
});
