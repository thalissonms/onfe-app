import React, { Component } from 'react'
import {View, SafeAreaView, ActivityIndicator, Text, StyleSheet, Image, TouchableOpacity, BackHandler} from 'react-native'
import logo from '../assets/LogoONovoFioEletrico.png'
import backArrow from '../assets/backArrow.png'
import editImg from '../assets/edit.png'
import delImg from '../assets/del.png'
import eyeOn from '../assets/eye.png'
import eyeOff from '../assets/eye-off.png'
import api  from '../services/api'

export default class New extends Component {
    
    state = {
        item:{},
        confirDelBox: false,
        show: false,
        load:false
    }
    
    loadItem = async () => {
        this.setState({load:true})
        const response = await api.get(`itens/get/${this.props.navigation.state.params.itemId}`)
        const { _id, produto, preçoClient, qnt, med, dataRep, preçoForn, img } = response.data
        this.setState({item:{id:_id, name:produto,  preço:preçoClient, qnt:qnt, medida:med, reposição:dataRep, fornecedor:preçoForn, img:img}, load:false})
    }
    
    
    componentDidMount(){
        this.loadItem()
        BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBack)
    
    }
    handleBack = () =>{ 
        if(this.props.navigation.state.key === 'New'){
        this.props.navigation.navigate('Home')
        BackHandler.removeEventListener('hardwareBackPress')
        return true 
    }
    }
    delItem = async () => {
        console.log(`Item excluido com sucesso! ID: ${this.state.item.id}`)
        await api.delete(`itens/delete/${this.state.item.id}`)
        this.handleBack()
    }
    sendToEdit = () => {
        if(this.state.item.img == 'url'){
            imgUrl = 'https://i.ibb.co/xhN7XpQ/Grupo-19.png'
        } else {
            imgUrl = this.state.item.img
        }
        this.props.navigation.navigate('editAdd', {
            id: this.state.item.id,
            name: this.state.item.name,
            pre: this.state.item.preço,
            qnt: this.state.item.qnt,
            medida: this.state.item.medida,
            rep: this.state.item.reposição,
            forn: this.state.item.fornecedor,
            img: imgUrl,
            edit: true
        })}
    render(){

    if(this.state.item.img == 'url'){
        imgUrl = 'https://i.ibb.co/xhN7XpQ/Grupo-19.png'
    } else {
        imgUrl = this.state.item.img
    }
    
    return(
        <SafeAreaView style={styles.container}>
        {this.state.load == true && (
        <View style={styles.confirmDelBack}>
            <ActivityIndicator size="large" color="#479AFF" style={{position:'absolute', zIndex:-1, top:'50%'}}/>
        </View>)}  
        {this.state.confirDelBox == true && (
            <View style={styles.confirmDelBack}>
                <View style={styles.confirmDel}>
                    <Text style={styles.msgDel}>Realmente deseja excluir o item?</Text>
                    <TouchableOpacity onPress={() => this.setState({confirDelBox:false})} style={[styles.optionButton, {backgroundColor:'#474646', left:'2%'}]}><Text style={styles.optionText}>CANCELAR</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.delItem} style={[styles.optionButton, {backgroundColor:'#EB1313', right:'2%'}]}><Text style={styles.optionText}>EXCLUIR</Text></TouchableOpacity>
                </View> 
            </View> )} 
            <View style={styles.topMenu}>
                <Image source={logo} style={styles.logoImg} />
                <TouchableOpacity style={styles.boxBack}
                onPress={this.handleBack}
                ><Image source={backArrow}  style={styles.backArrow} /></TouchableOpacity>
            </View>

            <View style={styles.produtoImg}>
                <Image source={{uri: imgUrl}} resizeMode={'center'} style={styles.imgProduto} />
            </View>
            <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{this.state.item.name}</Text>

                <TouchableOpacity onPress={() => this.sendToEdit()} style={[styles.editDel, {right:70}]}>
                    <Image source={editImg} />
                    <Text style={styles.editDelText}>EDITAR</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({confirDelBox:true})} style={[styles.editDel, {right:10, backgroundColor:'#D12121'}]}>
                    <Image source={delImg} />
                    <Text style={styles.editDelText}>EXCLUIR</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.itemInfo}>
                    <View style={styles.infoLeft}><Text style={[styles.infoLeftText, {color:'#0F5008'}]}>Preço</Text></View>
                    <View style={styles.infoRight}><Text style={[styles.infoRightText, {color:'#0F5008'}]}>{`R$ ${this.state.item.preço}`}</Text></View>
            </View>
            <View style={[styles.itemInfo, {backgroundColor:'#E4E4E4'}]}>
                    <View style={styles.infoLeft}><Text style={styles.infoLeftText}>Qnt</Text></View>
                    <View style={styles.infoRight}><Text style={styles.infoRightText}>{this.state.item.qnt}{this.state.item.medida}</Text></View>
            </View>
            <View style={[styles.itemInfo, {borderBottomColor:'#333', borderBottomWidth:0.5, backgroundColor:'#D5D5D5'}]}>
                    <View style={styles.infoLeft}>
                        <Text style={[styles.infoLeftText, {color:'#700606'}]}>Preço forn.</Text>
                    </View>
                    {this.state.show == true && (
                    <View style={styles.infoRight}>
                        <Text style={[styles.infoRightText, {color:'#700606'}]}>{`R$ ${this.state.item.fornecedor}`}</Text>
                        <TouchableOpacity style={styles.eyeOff} onPress={() => this.setState({show:false})}>
                        <Image source={eyeOff} />
                        </TouchableOpacity>
                    </View>)}
                        {this.state.show == false && (
                    <View style={styles.infoRight}>
                        <TouchableOpacity onPress={() => this.setState({show:true})}>
                        <Image source={eyeOn} />
                        </TouchableOpacity>
                    </View>)}
                    
            </View>
            <View style={styles.itemInfoLast}>
                <Text style={styles.infoLeftLast}>Data reposição:</Text>
                <Text style={styles.infoRightLast}>{this.state.item.reposição}</Text>
            </View>
        </SafeAreaView>
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
        backgroundColor:'#292727',
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
        height:55,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'#CCCCCC'
    },
    infoLeftLast: {
        fontFamily:'Segoe UI',
        fontSize:22,
        fontWeight:'bold',
        marginLeft:'3%'
    },
    infoRightLast: {
        fontFamily:'Segoe UI',
        fontSize:22, 
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
        color:'#E9E9E9'
    }
})

