import React, { Component } from 'react'
import {View, ScrollView, ActivityIndicator, KeyboardAvoidingView, Text, StyleSheet, Image, TouchableOpacity, BackHandler, TextInput} from 'react-native'
import date from '../getDate'
import logo from '../assets/LogoONovoFioEletrico.png'
import backArrow from '../assets/backArrow.png'
import saveImg from '../assets/save.png'
import xImg from '../assets/x.png'
import todayImg from '../assets/today.png'
import api  from '../services/api'

export default class New extends Component {
    
    state = {
        item:{},
        confirmCancel: false,
        show: false,
        blank: false,
        _id:'', produto:'', preço:'', qnt:'', med:'', fornecedor:'', dataRep:'', img:'', edit:false,
        imgGet: [],
        showImg: false,
        imgUrl: 'https://i.ibb.co/xhN7XpQ/Grupo-19.png',
        load:false
    }
    
    loadItem = async () => {
        if (this.props.navigation.state.params.edit){
            const { id, name, pre, qnt, medida, rep, forn, img, edit} = this.props.navigation.state.params
            this.setState({_id:id, produto:name, preço:pre, qnt:String(qnt), med:medida, fornecedor:forn, dataRep:rep, imgUrl:img, edit:edit})
        }
    }
    sendItem = async () => {
        if (!this.state.produto) {this.setState({blank:true})} else {
            if(this.state.edit == true){
               this.updateItem()
            } else {
                this.createItem()
            }
        }
    }
    createItem = async () => {
        await api.post('itens', {
            "id": 0,
            "produto": this.state.produto,
            "med": this.state.med,
            "preçoClient": this.state.preço,
            "qnt": this.state.qnt,
            "dataRep": this.state.dataRep,
            "preçoForn": this.state.fornecedor,
            "img": this.state.imgUrl 
        })
        this.handleBack()
    }
    updateItem = async () => {
        this.setState({load:true})
        await api.put(`itens/update/${this.state._id}`, {
            "id": 0,
            "produto": this.state.produto,
            "med": this.state.med,
            "preçoClient": this.state.preço,
            "qnt": this.state.qnt,
            "dataRep": this.state.dataRep,
            "preçoForn": this.state.fornecedor,
            "img": this.state.imgUrl
        })
        this.setState({load:false})
        this.props.navigation.navigate('New', {itemId: this.state._id})
    }

    getImg = async () => {
        if (!this.state.produto) {this.setState({blank:true})} else {
            let search = this.state.produto.replace(/[-\\^$*+?.()/|[\]{}(/d)]/, '')
            response =  await api.get(`img/${search}`)
            for (let i = 0; i < 4; i++){
                this.state.imgGet[i] = response.data[i].link
            }
            this.setState({showImg:true})
        }
    }
    salveImg = (url) => {
        this.setState({imgUrl:url})
        this.setState({showImg:false})
    }
    componentDidMount(){
        this.loadItem()
        BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBack)
    
    }
    handleBack = () => {
        if(this.state.edit == true){
            if(this.props.navigation.state.key != 'Home'){
            this.props.navigation.navigate('New', {itemId: this.state._id})
            BackHandler.removeEventListener('hardwareBackPress')
            return true }} else {
            if(this.props.navigation.state.key != 'Home'){
            this.props.navigation.navigate('Home')
            BackHandler.removeEventListener('hardwareBackPress')
            return true }}
    
    }
    render(){
    return(
            <KeyboardAvoidingView 
            behavior='position'
            enabled
            style={styles.container}
            keyboardVerticalOffset={-100}
            >
                
                {this.state.load == true && (
                <View style={styles.confirmDelBack}>
                    <ActivityIndicator size="large" color="#479AFF" style={{position:'absolute', zIndex:-1, top:'50%'}}/>
                </View>)}
                {this.state.blank == true && (
                    <View style={styles.warning}>
                        <View style={styles.confirmDel}>
                            <Text style={styles.warningTxt}>O nome do produto não pode ficar em branco!</Text>
                            <TouchableOpacity onPress={() => this.setState({blank:false})} style={[styles.optionButton, {backgroundColor:'#AF0606', width:'70%', left:'15%'}]}><Text style={styles.optionText}>OK</Text></TouchableOpacity>
                        </View>
                    </View>
                )}
                {this.state.confirmCancel == true && (
                    <View style={styles.confirmDelBack}>
                    <View style={styles.confirmDel}>
                        <Text style={styles.msgDel}>Desfazer todas alterações?</Text>
                        <TouchableOpacity onPress={() => this.setState({confirmCancel:false})} style={[styles.optionButton, {backgroundColor:'#474646', left:'2%'}]}><Text style={styles.optionText}>NÃO</Text></TouchableOpacity>
                        <TouchableOpacity onPress={this.handleBack} style={[styles.optionButton, {backgroundColor:'#474646', right:'2%'}]}><Text style={styles.optionText}>SIM</Text></TouchableOpacity>
                    </View> 
                </View> )}
                {this.state.showImg == true && (
                    <View style={styles.warning}>
                        <View style={[styles.confirmDel, {width:'95%', height:'70%'}]}>
                            <TouchableOpacity onPress={() => this.setState({showImg:false})} style={{width:40, height:40, position:'absolute', right:-18, top:'0.5%'}}>
                                <Text style={{fontSize:22, fontFamily:'Arial', fontWeight:'bold', color:'#424242'}}>X</Text>
                            </TouchableOpacity>
                            <Text style={[styles.warningTxt, {marginTop:10, color:'#333', fontSize:18}]}>Imagens sugeridas baseada no nome do produto:</Text>
                            <TouchableOpacity onPress={() => this.salveImg(this.state.imgGet[0])} style={[styles.imgFind, {bottom:200}]}>
                                <Image resizeMode={'center'} style={{width:'100%', height:'100%'}} source={{uri:this.state.imgGet[0]}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.salveImg(this.state.imgGet[1])} style={[styles.imgFind, {left:'3%', bottom:200}]}>
                                <Image resizeMode={'center'} style={{width:'100%', height:'100%'}} source={{uri:this.state.imgGet[1]}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.salveImg(this.state.imgGet[2])} style={[styles.imgFind, {left:'3%', bottom:30}]}>
                                <Image resizeMode={'center'} style={{width:'100%', height:'100%'}} source={{uri:this.state.imgGet[2]}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.salveImg(this.state.imgGet[3])} style={[styles.imgFind, {right:'3%', bottom:30}]}>
                                <Image resizeMode={'center'} style={{width:'100%', height:'100%'}} source={{uri:this.state.imgGet[3]}}/>
                            </TouchableOpacity>
                        </View>
                    </View> 
                )}
                <View style={styles.topMenu}>
                    <Image source={logo} style={styles.logoImg} />
                    <TouchableOpacity style={styles.boxBack}
                    onPress={this.handleBack}
                    ><Image source={backArrow} style={styles.backArrow} /></TouchableOpacity>
                </View>
            

            <View style={styles.produtoImg}>
                <TouchableOpacity onPress={this.getImg} style={{width:'100%', height:'100%'}}>
                    <Image source={{uri: this.state.imgUrl}} resizeMode={'center'} style={styles.imgProduto} />
                </TouchableOpacity>
            </View>
            <View style={styles.itemHeader}>
                <TextInput 
                returnKeyType={'next'} 
                placeholder={'NOME DO PRODUTO'}
                autoCapitalize={'characters'} 
                onChangeText={text => this.setState({produto: text})} 
                value={this.state.produto} 
                style={styles.itemName}></TextInput>
                <TouchableOpacity onPress={() => this.setState({confirmCancel:true})} style={[styles.editDel, {right:70}]}>
                    <Image source={xImg} />
                    <Text style={styles.editDelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.sendItem} style={[styles.editDel, {right:10, backgroundColor:'#3AA829'}]}>
                    <Image source={saveImg} />
                    <Text style={styles.editDelText}>Salvar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.itemInfo}>
                    <View style={styles.infoLeft}><Text style={[styles.infoLeftText, {color:'#0F5008'}]}>Preço</Text></View>
                    <View style={[styles.infoRight, {flexDirection:'row'}]}>
                        <Text style={[styles.infoRightText, {width:'45%', textAlign:'right', color:'#0F5008'}]}>R$</Text>
                        <TextInput 
                        returnKeyType={'next'} 
                        keyboardType={'numeric'} 
                        placeholder={'00,00'}
                        onChangeText={text => this.setState({preço: text})}
                        value={this.state.preço} 
                        style={[styles.infoRightText, {width:'55%', textAlign:'left', color:'#0F5008'}]}></TextInput> 
                    </View>
            </View>
            <View style={[styles.itemInfo, {backgroundColor:'#E4E4E4'}]}>
                    <View style={styles.infoLeft}><Text style={styles.infoLeftText}>Qnt</Text></View>
                    <View style={[styles.infoRight, {flexDirection:'row'}]}>
                        <TextInput 
                        keyboardType={'numeric'} 
                        returnKeyType={'next'} 
                        value={this.state.qnt} 
                        placeholder={'00'}
                        onChangeText={text => this.setState({qnt: text})}
                        style={[styles.infoRightText, {width:'50%', textAlign:'right'}]}></TextInput>
                        <TextInput 
                        autoCapitalize={'characters'} 
                        keyboardType={'web-search'} 
                        returnKeyType={'next'} 
                        value={this.state.med} 
                        placeholder={'UN'}
                        onChangeText={text => this.setState({med: text})}
                        style={[styles.infoRightText, {width:'50%', textAlign:'left'}]}></TextInput>
                    </View>
            </View>
            <View style={[styles.itemInfo, {borderBottomColor:'#333', borderBottomWidth:0.5, backgroundColor:'#D5D5D5'}]}>
                    <View style={styles.infoLeft}>
                        <Text style={[styles.infoLeftText, {color:'#700606'}]}>Preço forn.</Text>
                    </View>
                    <View style={[styles.infoRight, {flexDirection:'row'}]}>
                        <Text style={[styles.infoRightText, {width:'45%', textAlign:'right', color:'#700606'}]}>R$</Text>
                        <TextInput 
                        returnKeyType={'next'} 
                        keyboardType={'numeric'} 
                        placeholder={'00,00'}
                        onChangeText={text => this.setState({fornecedor: text})}
                        value={this.state.fornecedor} 
                        style={[styles.infoRightText, {width:'55%', textAlign:'left', color:'#700606'}]}>
                        </TextInput>
                    </View>    
            </View>
            <View style={styles.itemInfoLast}>
                <Text style={styles.infoLeftLast}>Data reposição:</Text>
                <TextInput 
                returnKeyType={'done'} 
                maxLength={11} 
                autoCorrect={false} 
                placeholder={'18/12/2019'} 
                dataDetectorTypes={'calendarEvent'} 
                style={styles.infoRightLast} 
                onChangeText={text => this.setState({dataRep: text})}
                value={this.state.dataRep}
                ></TextInput>
                <TouchableOpacity onPress={() => this.setState({dataRep:date.date()})} style={styles.today}>
                    <Image source={todayImg} />
                </TouchableOpacity>
            </View>
            
            </KeyboardAvoidingView>
    )}
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#CCCCCC',
        height:'100%',
    },
    topMenu: {
        flexDirection: 'row',
        display:'flex',
        width: '100%',
        height:65,
        elevation:2,
        zIndex:1,
        backgroundColor:'#878686',
        alignItems:'center',
        justifyContent:'center'
    },
    boxBack: {
        position:'absolute',
        left:'5%'
    },
    produtoImg: {
        width:'100%',
        height:'24%',
        backgroundColor:'#E6E6E6',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor:'#333',
        borderBottomWidth:0.5,
    },
    imgProduto: {
        width:'100%',
        height: '99.9%'
    },
    itemHeader: {
        width:'100%',
        height:'22%',
        display:'flex',
        backgroundColor:'#FCFCFC',
        borderBottomColor:'#333',
        borderBottomWidth:0.5
    },
    itemName: {
        fontFamily: 'Segoe UI',
        fontSize:14,
        fontWeight:'bold',
        color: '#000',
        marginTop:'8%',
        width:'100%',
        textAlign:'center',
        textShadowColor:'#AAA',
        textShadowOffset:{width:0.5, height:0.5},
        textShadowRadius:5
    },
    editDel: {
        width:52,
        height:52,
        padding:2,
        flexDirection:'column',
        display:'flex',
        position:'absolute',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#F00',
        borderRadius:6,
        bottom:5
    },
    editDelText: {
        fontFamily:'Segoe UI',
        fontSize:9,
        fontWeight:'bold',
        color:'#F6F6F6'
    },
    itemInfo: {
        width:'100%',
        height:'12%',
        flexDirection:'row',
        backgroundColor:'#F2F2F2'
    },
    infoLeft: {
        width:'35%',
        height:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderRightColor:'#333',
        borderRightWidth:0.5
    },
    infoLeftText: {
        width:'100%',
        fontFamily:'Segoe UI',
        fontSize:20,
        fontWeight:'bold',
        textAlign:'center'
    },
    infoRight: {
        width:'65%',
        height:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    infoRightText: {
        width:'100%',
        flexDirection:'row',
        fontFamily:'Segoe UI',
        fontSize:22,
        textAlign:'center'
    },
    eyeOff: {
        position:'absolute',
        right:'3%'
    },
    itemInfoLast: {
        width:'100%',
        height:'10%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'#CCCCCC'
    },
    infoLeftLast: {
        fontFamily:'Segoe UI',
        fontSize:19,
        fontWeight:'bold',
        marginLeft:'3%'
    },
    infoRightLast: {
        fontFamily:'Segoe UI',
        fontSize:19, 
        marginLeft:5
    },
    confirmDelBack: {
        width:'100%',
        height:'100%',
        display:'flex',
        
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.8)',
        position:'absolute',
        elevation:2,
        zIndex:2
    },
    confirmDel: {
        width:'80%',
        height:'25%',
        marginTop:'-15%',
        flexDirection:'row',
        backgroundColor:'#EFEFEF',
        opacity:2,
        borderRadius:5
    },
    msgDel: {
        width:'100%',
        marginTop:'12%',
        fontFamily:'Segoe UI',
        fontSize:16,
        fontWeight:'bold',
        color:'#000',
        textAlign:'center'
    },
    optionButton: {
        width:'47%',
        height:'20%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        position:'absolute',
        bottom:'3%'
    },
    optionText: {
        fontFamily:'Segeo UI',
        fontSize:16,
        fontWeight:'bold',
        color:'#E9E9E9'},    
    warning: {
        width:'100%',
        height:'100%',
        display:'flex',
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.8)',
        position:'absolute',
        elevation:2,
        zIndex:2
    },
    warningTxt: {
        width:'80%',
        marginLeft:'10%',
        marginTop:20,
        textAlign:'center',
        fontFamily:'Segoe UI',
        fontSize:20,
        fontWeight:'bold',
        color:'#5F0000'
    },
imgFind: {
        width:150,
        height:150,
        backgroundColor:'#D4D4D4',
        position:'absolute',
        right:'3%'
    }
})

