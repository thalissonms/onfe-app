import React, { Component } from 'react'
import { View, SafeAreaView, StyleSheet, Text, Image, TextInput,TouchableOpacity, FlatList, TouchableNativeFeedback, BackHandler, ActivityIndicator } from 'react-native'
import logo from '../assets/LogoONovoFioEletrico.png'
import lupa from '../assets/search.png'
import plusImg from '../assets/plus.png'
import api  from '../services/api'

function Item({ title, med, price, clickItem }) {
    return (
        <View style={styles.item}>
            
                <View style={styles.itemName} accessibilityRole={'button'} onPress={clickItem}>
                    <TouchableNativeFeedback onPress={clickItem}>
                        <Text style={styles.itemNameText} numberOfLines={2}>{title}</Text>
                    </TouchableNativeFeedback>
                </View>
                <View style={styles.itemMed}><Text style={styles.itemMedText}>{med}</Text></View>
                <View style={styles.itemPre}><Text style={styles.itemPreText}>{`R$ ${price}`}</Text></View>
            
        </View>
    );
}


export default class Home extends Component {

    state = {
        docs: [],
        searchTerm:'',
        load:false
    }
    componentDidMount(){
        this.loadProducts()
        BackHandler.addEventListener('hardwareBackPress', () => {BackHandler.exitApp()})
    }

    loadProducts = async () => {
        this.setState({load:true})
        const response = await api.get(`itens/get/all`)
        this.setState({ docs:response.data, load:false })
    }
    
    render() {
        let itensFilter = this.state.docs.filter((item) => {
            return item.produto.toLowerCase().includes(this.state.searchTerm.toLowerCase())
        })
        return (
        <SafeAreaView style={styles.container}>

            <View style={styles.topMenu}>
                <Image source={logo} style={styles.logoImg} />
                <TextInput onChangeText={text => this.setState({searchTerm:text})} 
                autoCorrect={false} 
                autoCapitalize={'none'} 
                style={styles.search}></TextInput>
                <TouchableOpacity style={styles.srcImg}><Image source={lupa} /></TouchableOpacity>
            </View>
            {this.state.load == true && (<ActivityIndicator size="large" color="#000" style={{position:'absolute', zIndex:-1, top:'50%'}}/>)} 
            <View style={styles.flatListStyle}>
                <FlatList
                    data={itensFilter}
                    searchProperty={"produto"}
                    searchTerm={this.state.searchItem}
                    renderItem={({ item }) => <Item title={item.produto} med={item.med} price={item.preçoClient} clickItem={() => {this.props.navigation.navigate('New', {itemId: item._id})}} />}
                    keyExtractor={item => item._id}
                    initialNumToRender={80}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() => <ActivityIndicator size="large" color="#AFC" style={{position:'absolute', zIndex:-1, top:'50%'}}/>}
                />
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('editAdd')} style={styles.addItem} >
                <Text style={styles.addItemTxt}>ADICIONAR NOVO ITEM  <Image source={plusImg} style={styles.addItemImg}/></Text> 
            </TouchableOpacity>   
            
        </SafeAreaView> 
        )
    }    
}


const styles = StyleSheet.create({
    container: {
        backgroundColor:'#EEE',
        height:'100%',
        display:'flex',
        alignContent:'center',
        alignItems:'center'
    },
    topMenu: {
        flexDirection: 'row',
        width: '100%',
        height:75,
        backgroundColor:'#878686',
        elevation:2
    },
    logoImg: {
        marginTop:5,
        marginLeft:5
    },
    search: {
        width: '70%',
        height: 40,
        borderRadius: 5,
        backgroundColor:'#FFF',
        marginTop: 12.5,
        marginLeft:10,
        borderStyle:'solid',
        borderWidth:1,
        borderColor: '#000',
        elevation: 2,
        fontSize: 20,
        paddingTop:10,
        paddingLeft:5,
        paddingRight:39,
        color: '#000',
        shadowColor: '#000',
        shadowOpacity:0.15
    },
    srcImg: {
        elevation:2,
        position: 'absolute',
        right: '10%',
        top:19
    },
    item: {
        flexDirection: 'row',
        width:'100%',
        height:45,
        backgroundColor:'#EEE',
        borderBottomWidth:0.5,
        borderBottomColor:'#000',
        zIndex:1
    },
    itemName: {
        width: '75%',
        height:'100%',
        //backgroundColor:'#F00',
        alignContent:'center',
        justifyContent:'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRightWidth:0.5,
        borderRightColor:'#000'
    },
    itemMed: {
        width: '6%',
        height:'100%',
        //backgroundColor:'#0F0',
        justifyContent:'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRightWidth:0.5,
        borderRightColor:'#000'
    },
    itemPre: {
        width: '19%',
        height:'100%',
        //backgroundColor:'#00F',
        justifyContent:'center',
        textAlignVertical: 'center',
        borderRightWidth:0.5,
        borderRightColor:'#000'
    },
    itemNameText: {
        width:'99%',
        color:'#222',
        fontSize:12,
        fontFamily:'Segoe UI',
        textAlign:'left',
        marginLeft:1
    },
    itemMedText: {
        color:'#222',
        fontSize:12,
        fontFamily:'Segoe UI',
        textAlign:'center',
        fontWeight:'bold'
    },
    itemPreText: {
        color:'#222',
        fontSize:12,
        fontFamily:'Segoe UI',
        textAlign:'center'
    
    },
    flatListStyle: {
        width:'100%',
        height:'100%',
        paddingBottom:103
        },
    addItem: {
        width:'100%',
        height:38,
        display:'flex',
        flexDirection:'row',
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        elevation:4,
        bottom:0,
        backgroundColor:'#303030'
    },
    addItemTxt: {
        width:'100%',
        textAlign:'center',
        fontFamily:'Segeo UI',
        fontSize:18,
        fontWeight:'bold',
        color:'#FFFFFF'
    }
})